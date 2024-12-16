/**
 * Loras entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { getBigIntFromString, notNull, } from "../../helpers/index";
import { ESCAPE_SIMPLE_QUOTE } from "../../constants";
import { IreturnResult, keyobj, koaContext } from "../../types";
import { errors, msg } from "../../messages/";
import { EConstant, EDatesType, EHttpCode } from "../../enums";
import { multiDatastreamFromDeveui, streamFromDeveui } from "../queries";
import { decodeloraDeveuiPayload } from "../../lora";
import { log } from "../../log";
import { DATASTREAM, FEATUREOFINTEREST, OBSERVATION } from "../../models/entities";
import { config } from "../../configuration";

export class Loras extends Common {
  synonym: Record<string, any>  = {};
  stean: Record<string, any>  = {};
  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    super(ctx);
  }
  // prepare datas to lora input
  async prepareInputResult(dataInput: Record<string, any> ): Promise<Record<string, any> > {
    console.log(log.whereIam());
    const result:Record<string, any>  = {};
    const listKeys = ["deveui", "DevEUI", "sensor_id", "frame"];
      if (notNull(dataInput["payload_deciphered"]))
        result["frame"] = dataInput["payload_deciphered"].toUpperCase();
      
      Object.entries(dataInput).forEach( ([k, v]) => (result[listKeys.includes(k) ? k.toLowerCase() : k] = listKeys.includes( k ) ? v.toUpperCase() : v) );
      if (!isNaN(dataInput["timestamp"])) 
        result["timestamp"] = new Date( dataInput["timestamp"] * 1000 ).toISOString();
    
    return result;
  }

  createListQuery(input: string[], columnListString: string): string {
    console.log(log.whereIam());
    const tempList = columnListString.split("COLUMN");
    return tempList[0].concat( '"', input.join(`"${tempList[1]}${tempList[0]}"`), '"', tempList[1] );
  }

  // Override post
  async post( dataInput: Record<string, any>, silent?: boolean ): Promise<IreturnResult | undefined | void> {
    console.log(log.whereIam());
    const addToStean = (key: string) => (this.stean[key] = dataInput[key]);
    if (dataInput) this.stean = await this.prepareInputResult(dataInput);
    if (this.stean["frame"] === "000000000000000000") this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errors.frameNotConform });
    function gedataInputtDate(): string | undefined {
      if (dataInput["datetime"]) return String(dataInput["datetime"]);
      if (dataInput["phenomenonTime"]) return String(dataInput["phenomenonTime"]);
      if (dataInput["timestamp"]) return String(new Date(dataInput["timestamp"] * 1000));
    }
    // search for MultiDatastream
    if (notNull(dataInput["MultiDatastream"])) {
      if (!notNull(this.stean["deveui"])) {
        if (silent) return this.formatReturnResult({ body: errors.deveuiMessage });
        else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errors.deveuiMessage });
      }
      addToStean("MultiDatastream");
      return await super.post(this.stean);
    }
    // search for Datastream 
    if (notNull(dataInput["Datastream"])) {
      if (!notNull(dataInput["deveui"])) {
        if (silent) return this.formatReturnResult({ body: errors.deveuiMessage });
        else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errors.deveuiMessage });
      }
      addToStean("Datastream");
      return await super.post(this.stean);
    }
    // search for deveui
    if (!notNull(this.stean["deveui"])) {
      if (silent) return this.formatReturnResult({ body: errors.deveuiMessage });
      else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errors.deveuiMessage });
    }

    const stream = await config.executeSql(this.ctx.service, streamFromDeveui(this.stean["deveui"])).then((res: Record<string, any> ) => {
      if (res[0]["multidatastream"] != null) return res[0]["multidatastream"][0];
      if (res[0]["datastream"] != null) return res[0]["datastream"][0];
      this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: msg( errors.deveuiNotFound, this.stean["deveui"] )}); 
    });
    
    console.log(log.debug_infos("stream", stream));
    // search for frame and decode payload if found
      if (notNull(this.stean["frame"])) {
        const temp = await decodeloraDeveuiPayload( this.ctx, this.stean["deveui"], this.stean["frame"] );
        if (!temp) return this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: "Error"});
        if (temp && temp.error) {
          if (silent) return this.formatReturnResult({ body: temp.error });
          else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: temp.error });
        }
      this.stean["decodedPayload"] = temp["result"];
      if (this.stean["decodedPayload"].valid === false) this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errors.InvalidPayload });
    }
    
    const searchMulti = multiDatastreamFromDeveui(this.stean["deveui"]);
    this.stean["formatedDatas"] = {};
      
    if (stream["multidatastream"]) {
      if ( this.stean["decodedPayload"] && notNull(this.stean["decodedPayload"]["datas"]) )
        Object.keys(this.stean["decodedPayload"]["datas"]).forEach((key) => {
          this.stean["formatedDatas"][key.toLowerCase()] =
          this.stean["decodedPayload"]["datas"][key];
        });
  
      // convert all keys in lowercase
      if (notNull(dataInput["data"]))
        Object.keys(dataInput["data"]).forEach((key) => {
          this.stean["formatedDatas"][key.toLowerCase()] = dataInput["data"][key];
        });
  
      if (!notNull(this.stean["formatedDatas"])) {
        if (silent) return this.formatReturnResult({ body: errors.dataMessage });
        else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errors.dataMessage });
      }
    } else {
      
      if (this.stean["decodedPayload"] && this.stean["decodedPayload"]["datas"]) {
      this.stean["formatedDatas"] = this.stean["decodedPayload"]["datas"];
    } else if (!this.stean["value"]) {
          if (silent) return this.formatReturnResult({ body: errors.dataMessage });
          else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errors.dataMessage });
        }
    }
      console.log(log.debug_infos("Formated datas", this.stean["formatedDatas"]));
      this.stean["date"] = gedataInputtDate();
      if (!this.stean["date"]) {
      if (silent) return this.formatReturnResult({ body: errors.noValidDate });
      else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errors.noValidDate });
    }    
    
    if (stream["multidatastream"]) {
      console.log(log.debug_infos("multiDatastream", stream));
      const listOfSortedValues: { [key: string]: number | null } = {};
      stream["keys"].forEach((element: string) => {
        listOfSortedValues[element] = null;
        const searchStr = element .toLowerCase() .normalize("NFD") .replace(/[\u0300-\u036f]/g, "");
      if (this.stean["formatedDatas"][searchStr]) listOfSortedValues[element] = this.stean["formatedDatas"][searchStr];
        else
      Object.keys(this.stean["formatedDatas"]).forEach(
            (subElem: string) => {
      if (element.toUpperCase().includes(subElem.toUpperCase())) listOfSortedValues[element] = this.stean["formatedDatas"][subElem];
      else if (this.synonym[element])
      this.synonym[element].forEach((key: string) => {
      if (key.toUpperCase().includes(subElem.toUpperCase())) listOfSortedValues[element] = this.stean["formatedDatas"][subElem];
                });
            }
          );
      });
      
      console.log(log.debug_infos("Values", listOfSortedValues));
      if ( Object.values(listOfSortedValues).filter((word) => word != null) .length < 1 ) {
      const errorMessage = `${errors.dataNotCorresponding} [${stream["keys"]}] with [${Object.keys(this.stean["formatedDatas"])}]`;
        if (silent) return this.formatReturnResult({ body: errorMessage });
        else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errorMessage });
      }
      const getFeatureOfInterest = getBigIntFromString( dataInput["FeatureOfInterest"] );
      const temp = listOfSortedValues;
      if (temp && typeof temp == "object") {
        const tempLength = Object.keys(temp).length;
        console.log(log.debug_infos( "data : Keys", `${tempLength} : ${stream["keys"].length}` ));
        if (tempLength != stream["keys"].length) {
          const errorMessage = msg(
            errors.sizeListKeys,
            String(tempLength),
            stream["keys"].length
          );
          if (silent) return this.formatReturnResult({ body: errorMessage });
          else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errorMessage });
        }
      }
      const resultCreate = `'${JSON.stringify({
        value: Object.values(listOfSortedValues),
        valueskeys: ESCAPE_SIMPLE_QUOTE(JSON.stringify(listOfSortedValues)),
      payload: this.stean["frame"],
      })}'::jsonb`;
      const insertObject: Record<string, any> = {
        featureofinterest_id: getFeatureOfInterest
          ? `SELECT COALESCE((SELECT "id" FROM "${FEATUREOFINTEREST.table}" WHERE "id" = ${getFeatureOfInterest}), ${getFeatureOfInterest})`
          : `(SELECT multidatastream1._default_featureofinterest FROM multidatastream1)`,
        multidatastream_id: "(SELECT multidatastream1.id FROM multidatastream1)",
      phenomenonTime: `to_timestamp('${this.stean["timestamp"]}','${EDatesType.dateImport}')::timestamp`,
      resultTime: `to_timestamp('${this.stean["timestamp"]}','${EDatesType.dateImport}')::timestamp`,
        result: resultCreate,
      };
      const searchDuplicate = Object.keys(insertObject)
        .slice(0, -1)
      .map((elem: string) => `"${elem}" = ${insertObject[elem]} AND `)
        .concat(`"result" = ${resultCreate}`)
        .join("");
      const sql = `WITH "${EConstant.voidtable}" AS (SELECT srid FROM "${EConstant.voidtable}" LIMIT 1)
               , multidatastream1 AS (SELECT id, thing_id, _default_featureofinterest, ${searchMulti} LIMIT 1)
               , myValues ( "${Object.keys(insertObject).join(
                  EConstant.doubleQuotedComa
                )}") AS (values (${Object.values(insertObject).join()}))
               , searchDuplicate AS (SELECT * FROM "${
                  OBSERVATION.table
                }" WHERE ${searchDuplicate})
               , observation1 AS (INSERT INTO  "${
                  OBSERVATION.table
                }" ("${Object.keys(insertObject).join(
                  EConstant.doubleQuotedComa
      )}") SELECT * FROM myValues WHERE NOT EXISTS (SELECT * FROM searchDuplicate)
                                  AND (SELECT id FROM multidatastream1) IS NOT NULL
                                  RETURNING *)
               , result1 AS (SELECT (SELECT observation1.id FROM observation1)
               , (SELECT multidatastream1."keys" FROM multidatastream1)
               , (SELECT searchDuplicate.id AS duplicate FROM  searchDuplicate)
               , ${this.createListQuery(
                  Object.keys(insertObject),
                  "(SELECT observation1.COLUMN FROM observation1), "
                )} (SELECT multidatastream1.id FROM multidatastream1) AS multidatastream, (SELECT multidatastream1.thing_id FROM multidatastream1) AS thing)
                 SELECT coalesce(json_agg(t), '[]') AS result FROM result1 AS t`;
      return await config.executeSqlValues(this.ctx.service, sql).then(async (res: object) => {
        // TODO MULTI 
      const tempResult: Record<string, any>  = res[0 as keyobj][0];
        if (tempResult.id != null) {          
          const result: Record<string, any>  = {
            phenomenonTime: `"${tempResult.phenomenonTime}"`,
            resultTime: `"${tempResult.resultTime}"`,
            result: tempResult["result"]["value"],
          };
          result[EConstant.id] = tempResult.id;
          result[EConstant.selfLink] = `${this.ctx.decodedUrl.root}/Observations(${tempResult.id})`;
          Object.keys(OBSERVATION.relations).forEach((word) => {
      result[ `${word}${EConstant.navLink}` ] = `${this.ctx.decodedUrl.root}/Observations(${tempResult.id})/${word}`;
          });
          return this.formatReturnResult({ body: result, query: sql, });
        } else {
          if (silent) return this.formatReturnResult({ body: errors.observationExist });
          else
            this.ctx.throw(EHttpCode.conflict, {
              code: EHttpCode.conflict,
              detail: errors.observationExist,
              link: `${this.ctx.decodedUrl.root}/Observations(${[
                tempResult.duplicate,
              ]})`,
            });
        }
      });
    } else if (stream["datastream"]) {
      console.log(log.debug_infos("datastream", stream["datastream"]));
      const getFeatureOfInterest = getBigIntFromString(
      dataInput["FeatureOfInterest"]
      );
      const searchFOI: Record<string, any>  = await config.executeSql(this.ctx.service, 
        getFeatureOfInterest
          ? `SELECT coalesce((SELECT "id" FROM "${FEATUREOFINTEREST.table}" WHERE "id" = ${getFeatureOfInterest}), ${getFeatureOfInterest}) AS id `
          : stream["_default_featureofinterest"] ? `SELECT id FROM "${FEATUREOFINTEREST.table}" WHERE id = ${stream["_default_featureofinterest"]}` : ""
      );
      
      if (searchFOI[0].length < 1) {
        if (silent) return this.formatReturnResult({ body: errors.noFoi });
        else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errors.noFoi });
      }
      const value = this.stean["value"] 
      ? this.stean["value"]
      : this.stean["decodedPayload"]["datas"]
      ? this.stean["decodedPayload"]["datas"]
      : this.stean["data"]["Data"]
      ? this.stean["data"]["Data"]
      : undefined;
      if (!value) {
        if (silent) return this.formatReturnResult({ body: errors.noValue });
        else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errors.noValue });
      }
      const resultCreate = `'${JSON.stringify({ value: value })}'::jsonb`;
      const insertObject: Record<string, any>  = {
        featureofinterest_id: "(SELECT datastream1._default_featureofinterest from datastream1)",
        datastream_id: "(SELECT datastream1.id from datastream1)",
      phenomenonTime: `to_timestamp('${this.stean["timestamp"]}','${EDatesType.dateImport}')::timestamp`,
      resultTime: `to_timestamp('${this.stean["timestamp"]}}','${EDatesType.dateImport}')::timestamp`,
        result: resultCreate,
      };
      const searchDuplicate = Object.keys(insertObject)
        .slice(0, -1)
      .map((elem: string) => `"${elem}" = ${insertObject[elem]} AND `)
        .concat(`"result" = ${resultCreate}`)
        .join("");
      console.log(log.debug_infos("searchDuplicate", searchDuplicate));
      const sql = `WITH "${EConstant.voidtable}" AS (SELECT srid FROM "${EConstant.voidtable}" LIMIT 1)
              , datastream1 AS (SELECT id, _default_featureofinterest, thing_id FROM "${
                 DATASTREAM.table
               }" WHERE id =${stream["id"]})
              , myValues ( "${Object.keys(insertObject).join(
                EConstant.doubleQuotedComa
               )}") AS (values (${Object.values(insertObject).join()}))
              , searchDuplicate AS (SELECT * FROM "${
                 OBSERVATION.table
               }" WHERE ${searchDuplicate})
              , observation1 AS (INSERT INTO  "${
                 OBSERVATION.table
               }" ("${Object.keys(insertObject).join(
                EConstant.doubleQuotedComa
      )}") SELECT * FROM myValues
                                WHERE NOT EXISTS (SELECT * FROM searchDuplicate)
                               AND (SELECT id from datastream1) IS NOT NULL
                               RETURNING *)
              , result1 AS (SELECT 
                    (SELECT observation1.id FROM observation1),
                    (SELECT searchDuplicate.id AS duplicate FROM searchDuplicate),
                    ${this.createListQuery(
                      Object.keys(insertObject),
                      "(SELECT observation1.COLUMN from observation1), "
                    )} (SELECT datastream1.id from datastream1) AS datastream, (SELECT datastream1.thing_id from datastream1) AS thing)
                SELECT coalesce(json_agg(t), '[]') AS result FROM result1 AS t`;
      return await config.executeSql(this.ctx.service, sql).then(async (res: object) => {
      const tempResult: Record<string, any>  = res[0 as keyobj]["result"][0];
        if (tempResult.id != null) {
          const result: Record<string, any>  = {
            phenomenonTime: `"${tempResult.phenomenonTime}"`,
            resultTime: `"${tempResult.resultTime}"`,
            result: tempResult["result"]["value"],
          };
          result[EConstant.id] = tempResult.id;
          result[EConstant.selfLink] = `${this.ctx.decodedUrl.root}/Observations(${tempResult.id})`;
          Object.keys(OBSERVATION.relations).forEach((word) => {
      result[ `${word}${EConstant.navLink}` ] = `${this.ctx.decodedUrl.root}/Observations(${tempResult.id})/${word}`;
          });
          return this.formatReturnResult({
            body: result,
            query: sql,
          });
        } else {
          if (silent) return this.formatReturnResult({ body: errors.observationExist });
          else
            this.ctx.throw(EHttpCode.conflict, {
              code: EHttpCode.conflict,
              detail: errors.observationExist,
              link: `${this.ctx.decodedUrl.root}/Observations(${[
                tempResult.duplicate,
              ]})`,
            });
        }
      });
    }
  }
}
