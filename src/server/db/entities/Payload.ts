/**
 * Payload entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { escapeSimpleQuotes, flatten, getBigIntFromString, notNull, searchInJson } from "../../helpers/index";
import { _DEBUG } from "../../constants";
import { Id, IreturnResult, koaContext } from "../../types";
import { logging } from "../../log";
import { EHttpCode, EErrors, EDatesType, EConstant } from "../../enums";
import { decodeloraDeveuiPayload } from "../../lora";
import { messages } from "../../messages";
import { DATASTREAM, FEATUREOFINTEREST, OBSERVATION } from "../../models/entities";
import { executeSql, executeSqlValues } from "../helpers";
import { queries } from "../queries";

/**
 * Logs Loras
 */

export class Payload extends Common {
    synonym: Record<string, any> = {};
    stean: Record<string, any> = {};
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }
    // Override get all to return error Bad request
    async getAll(): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest });
    }

    // Override get one to return error Bad request
    async getSingle(): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest });
    }

    // prepare datas to lora input

    async prepareInputResult(dataInput: Record<string, any>): Promise<Record<string, any>> {
        console.log(logging.whereIam(new Error().stack));
        // const temp = Object.keys(dataInput).length === 1 ? flatten(dataInput[Object.keys(dataInput)[0]]) : dataInput;
        const temp = Object.keys(dataInput).length === 1 ? flatten(dataInput[Object.keys(dataInput)[0]]) : dataInput;
        const result: Record<string, any> = {};
        // if sub json get it
        if (this.ctx.service.synonyms)
            Object.keys(this.ctx.service.synonyms).forEach((e: string) => {
                let search = searchInJson(temp, [...(this.ctx.service.synonyms ? this.ctx.service.synonyms[e as keyof object] : []), ...[e]]);
                if (search) result[e] = search.toUpperCase();
            });
        else Object.entries(temp).forEach(([k, v]) => (result[k] = ["frame", "deveui", "timestamp"].includes(k) ? String(v).toUpperCase() : v));

        if (!isNaN(dataInput["timestamp"])) result["timestamp"] = new Date(temp["timestamp" as keyof object] * 1000).toISOString();

        return result;
    }

    createListQuery(input: string[], columnListString: string): string {
        console.log(logging.whereIam(new Error().stack));
        const tempList = columnListString.split("COLUMN");
        return tempList[0].concat('"', input.join(`"${tempList[1]}${tempList[0]}"`), '"', tempList[1]);
    }

    // Override post

    async post(dataInput: Record<string, any>, silent?: boolean): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        // this.stean store datas to insert

        if (dataInput) this.stean = await this.prepareInputResult(dataInput);
        logging.message("input formated", this.stean).toLogAndFile();

        if (this.stean["frame"] === "000000000000000000") this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: EErrors.frameNotConform });

        // search for deveui
        if (!notNull(this.stean["deveui"])) {
            if (silent) return this.formatReturnResult({ body: EErrors.deveuiMessage });
            else this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: EErrors.deveuiMessage });
        }

        const stream = await executeSql(this.ctx.service, queries.streamInfosFromDeveui(this.stean["deveui"])).then((res: Record<string, any>) => {
            if (res[0]["multidatastream"] != null) return res[0]["multidatastream"][0];
            if (res[0]["datastream"] != null) return res[0]["datastream"][0];
            this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: messages.str(EErrors.deveuiNotFound, this.stean["deveui"]) });
        });
        logging.message("stream", stream).toLogAndFile();
        // search for frame and decode payload if found
        if (notNull(this.stean["frame"])) {
            const temp = await decodeloraDeveuiPayload(this.ctx.service, this.stean["deveui"], this.stean["frame"]);
            if (!temp) return this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: "Error" });
            if (temp && temp.error) {
                if (silent) return this.formatReturnResult({ body: temp.error });
                else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: temp.error });
            }
            this.stean["decodedPayload"] = temp["result"];
            if (this.stean["decodedPayload"].valid === false) this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: EErrors.InvalidPayload });
        }

        const searchMulti = queries.multiDatastreamFromDeveui(this.stean["deveui"]);
        this.stean["formatedDatas"] = {};
        if (stream["multidatastream"]) {
            if (this.stean["decodedPayload"] && notNull(this.stean["decodedPayload"]["datas"]))
                Object.keys(this.stean["decodedPayload"]["datas"]).forEach((key) => {
                    this.stean["formatedDatas"][key.toLowerCase()] = this.stean["decodedPayload"]["datas"][key];
                });

            // convert all keys in lowercase
            if (notNull(dataInput["data"]))
                Object.keys(dataInput["data"]).forEach((key) => {
                    this.stean["formatedDatas"][key.toLowerCase()] = dataInput["data"][key];
                });

            if (!notNull(this.stean["formatedDatas"])) {
                if (silent) return this.formatReturnResult({ body: EErrors.dataMessage });
                else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: EErrors.dataMessage });
            }
        } else {
            if (this.stean["decodedPayload"] && this.stean["decodedPayload"]["datas"]) {
                this.stean["formatedDatas"] = this.stean["decodedPayload"]["datas"];
            } else if (!this.stean["value"]) {
                if (silent) return this.formatReturnResult({ body: EErrors.dataMessage });
                else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: EErrors.dataMessage });
            }
        }
        logging.message("Formated datas", this.stean["formatedDatas"]).toLogAndFile();
        this.stean["date"] = searchInJson(dataInput, ["datetime", "phenomenonTime", "timestamp", "Time"]);
        if (!this.stean["date"]) {
            if (silent) return this.formatReturnResult({ body: EErrors.noValidDate });
            else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: EErrors.noValidDate });
        }

        if (stream["multidatastream"]) {
            logging.message("multiDatastream", stream).toLogAndFile();
            const listOfSortedValues: { [key: string]: number | null } = {};
            stream["keys"].forEach((element: string) => {
                listOfSortedValues[element] = null;
                const searchStr = element
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                if (this.stean["formatedDatas"][searchStr]) listOfSortedValues[element] = this.stean["formatedDatas"][searchStr];
                else
                    Object.keys(this.stean["formatedDatas"]).forEach((subElem: string) => {
                        if (element.toUpperCase().includes(subElem.toUpperCase())) listOfSortedValues[element] = this.stean["formatedDatas"][subElem];
                        else if (this.synonym[element])
                            this.synonym[element].forEach((key: string) => {
                                if (key.toUpperCase().includes(subElem.toUpperCase())) listOfSortedValues[element] = this.stean["formatedDatas"][subElem];
                            });
                    });
            });

            logging.message("Values", listOfSortedValues).toLogAndFile();
            if (Object.values(listOfSortedValues).filter((word) => word != null).length < 1) {
                logging.error;
                const errorMessage = `${EErrors.dataNotCorresponding} [${stream["keys"]}] with [${Object.keys(this.stean["formatedDatas"])}]`;
                if (silent) return this.formatReturnResult({ body: errorMessage });
                else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errorMessage });
            }
            const getFeatureOfInterest = getBigIntFromString(dataInput["FeatureOfInterest"]);
            const temp = listOfSortedValues;
            if (temp && typeof temp == "object") {
                const tempLength = Object.keys(temp).length;
                logging.message("data : Keys", `${tempLength} : ${stream["keys"].length}`).toLogAndFile();
                if (tempLength != stream["keys"].length) {
                    const errorMessage = messages.str(EErrors.sizeListKeys, String(tempLength), stream["keys"].length).toString();
                    if (silent) return this.formatReturnResult({ body: errorMessage });
                    else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: errorMessage });
                }
            }
            const resultCreate = `'${JSON.stringify({
                value: Object.values(listOfSortedValues),
                valueskeys: escapeSimpleQuotes(JSON.stringify(listOfSortedValues)),
                payload: this.stean["frame"]
            })}'::jsonb`;
            const insertObject: Record<string, any> = {
                featureofinterest_id: getFeatureOfInterest
                    ? `SELECT COALESCE((SELECT "id" FROM "${FEATUREOFINTEREST.table}" WHERE "id" = ${getFeatureOfInterest}), ${getFeatureOfInterest})`
                    : `(SELECT multidatastream1._default_featureofinterest FROM multidatastream1)`,
                multidatastream_id: "(SELECT multidatastream1.id FROM multidatastream1)",
                phenomenonTime: `to_timestamp('${this.stean["timestamp"]}','${EDatesType.dateImport}')::timestamp`,
                resultTime: `to_timestamp('${this.stean["timestamp"]}','${EDatesType.dateImport}')::timestamp`,
                result: resultCreate
            };
            const searchDuplicate = Object.keys(insertObject)
                .slice(0, -1)
                .map((elem: string) => `"${elem}" = ${insertObject[elem]} AND `)
                .concat(`"result" = ${resultCreate}`)
                .join("");
            const sql = `WITH "${EConstant.voidtable}" AS (${EConstant.voidSql})
               , multidatastream1 AS (SELECT id, thing_id, _default_featureofinterest, ${searchMulti} LIMIT 1)
               , myValues ( "${Object.keys(insertObject).join(EConstant.doubleQuotedComa)}") AS (values (${Object.values(insertObject).join()}))
               , searchDuplicate AS (SELECT * FROM "${OBSERVATION.table}" WHERE ${searchDuplicate})
               , observation1 AS (INSERT INTO  "${OBSERVATION.table}" ("${Object.keys(insertObject).join(
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
            return await executeSqlValues(this.ctx.service, sql).then(async (res: object) => {
                // TODO MULTI
                const tempResult: Record<string, any> = res[0 as keyof object][0];
                if (tempResult.id != null) {
                    const result: Record<string, any> = {
                        phenomenonTime: `"${tempResult.phenomenonTime}"`,
                        resultTime: `"${tempResult.resultTime}"`,
                        result: tempResult["result"]["value"]
                    };
                    result[EConstant.id] = tempResult.id;
                    result[EConstant.selfLink] = `${this.ctx.decodedUrl.root}/Observations(${tempResult.id})`;
                    Object.keys(OBSERVATION.relations).forEach((word) => {
                        result[`${word}${EConstant.navLink}`] = `${this.ctx.decodedUrl.root}/Observations(${tempResult.id})/${word}`;
                    });
                    return this.formatReturnResult({ body: result, query: sql });
                } else {
                    if (silent) return this.formatReturnResult({ body: EErrors.observationExist });
                    else
                        this.ctx.throw(EHttpCode.conflict, {
                            code: EHttpCode.conflict,
                            detail: EErrors.observationExist,
                            link: `${this.ctx.decodedUrl.root}/Observations(${[tempResult.duplicate]})`
                        });
                }
            });
        } else if (stream["datastream"]) {
            logging.message("datastream", stream["datastream"]).toLogAndFile();
            const getFeatureOfInterest = getBigIntFromString(dataInput["FeatureOfInterest"]);
            const searchFOI: Record<string, any> = await executeSql(
                this.ctx.service,
                getFeatureOfInterest
                    ? `SELECT coalesce((SELECT "id" FROM "${FEATUREOFINTEREST.table}" WHERE "id" = ${getFeatureOfInterest}), ${getFeatureOfInterest}) AS id `
                    : stream["_default_featureofinterest"]
                    ? `SELECT id FROM "${FEATUREOFINTEREST.table}" WHERE id = ${stream["_default_featureofinterest"]}`
                    : ""
            );

            if (searchFOI[0].length < 1) {
                if (silent) return this.formatReturnResult({ body: EErrors.noFoi });
                else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: EErrors.noFoi });
            }
            const value = this.stean["value"]
                ? this.stean["value"]
                : this.stean["decodedPayload"]["datas"]
                ? this.stean["decodedPayload"]["datas"]
                : this.stean["data"]["Data"]
                ? this.stean["data"]["Data"]
                : undefined;
            if (!value) {
                if (silent) return this.formatReturnResult({ body: EErrors.noValue });
                else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: EErrors.noValue });
            }
            const resultCreate = `'${JSON.stringify({ value: value })}'::jsonb`;
            const insertObject: Record<string, any> = {
                featureofinterest_id: "(SELECT datastream1._default_featureofinterest from datastream1)",
                datastream_id: "(SELECT datastream1.id from datastream1)",
                phenomenonTime: `to_timestamp('${this.stean["timestamp"]}','${EDatesType.dateImport}')::timestamp`,
                resultTime: `to_timestamp('${this.stean["timestamp"]}}','${EDatesType.dateImport}')::timestamp`,
                result: resultCreate
            };
            const searchDuplicate = Object.keys(insertObject)
                .slice(0, -1)
                .map((elem: string) => `"${elem}" = ${insertObject[elem]} AND `)
                .concat(`"result" = ${resultCreate}`)
                .join("");
            logging.message("searchDuplicate", searchDuplicate).toLogAndFile();
            const sql = `WITH "${EConstant.voidtable}" AS (${EConstant.voidSql})
              , datastream1 AS (SELECT id, _default_featureofinterest, thing_id FROM "${DATASTREAM.table}" WHERE id =${stream["id"]})
              , myValues ( "${Object.keys(insertObject).join(EConstant.doubleQuotedComa)}") AS (values (${Object.values(insertObject).join()}))
              , searchDuplicate AS (SELECT * FROM "${OBSERVATION.table}" WHERE ${searchDuplicate})
              , observation1 AS (INSERT INTO  "${OBSERVATION.table}" ("${Object.keys(insertObject).join(EConstant.doubleQuotedComa)}") SELECT * FROM myValues
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
            return await executeSql(this.ctx.service, sql).then(async (res: object) => {
                const tempResult: Record<string, any> = res[0 as keyof object]["result"][0];
                if (tempResult.id != null) {
                    const result: Record<string, any> = {
                        phenomenonTime: `"${tempResult.phenomenonTime}"`,
                        resultTime: `"${tempResult.resultTime}"`,
                        result: tempResult["result"]["value"]
                    };
                    result[EConstant.id] = tempResult.id;
                    result[EConstant.selfLink] = `${this.ctx.decodedUrl.root}/Observations(${tempResult.id})`;
                    Object.keys(OBSERVATION.relations).forEach((word) => {
                        result[`${word}${EConstant.navLink}`] = `${this.ctx.decodedUrl.root}/Observations(${tempResult.id})/${word}`;
                    });
                    return this.formatReturnResult({
                        body: result,
                        query: sql
                    });
                } else {
                    if (silent) return this.formatReturnResult({ body: EErrors.observationExist });
                    else
                        this.ctx.throw(EHttpCode.conflict, {
                            code: EHttpCode.conflict,
                            detail: EErrors.observationExist,
                            link: `${this.ctx.decodedUrl.root}/Observations(${[tempResult.duplicate]})`
                        });
                }
            });
        }
    }

    // Override update to return error Bad request
    async update(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest });
    }
    // Override delete to return error Bad request
    async delete(idInput: Id | string): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest });
    }
}
