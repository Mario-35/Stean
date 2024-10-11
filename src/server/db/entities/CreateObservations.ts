/**
 * CreateObservations entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { Common } from "./common";
import { IcsvColumn, IcsvFile, IreturnResult, IstreamInfos, koaContext } from "../../types";
import { queryInsertFromCsv, dateToDateWithTimeZone, executeSql, executeSqlValues } from "../helpers";
import { doubleQuotesString, asyncForEach } from "../../helpers";
import { errors, msg } from "../../messages/";
import { EChar, EDatesType, EExtensions, EHttpCode } from "../../enums";
import util from "util";
import { models } from "../../models";
import { log } from "../../log";
export class CreateObservations extends Common {
  public indexResult = -1;
  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    super(ctx);
  }
  createListColumnsValues( type: "COLUMNS" | "VALUES", input: string[] ): string[] {
    const res: string[] = [];
    const separateur = type === "COLUMNS" ? '"' : "'";
    input.forEach((elem: string, index: number) => {
      switch (elem) {
        case "result":
          this.indexResult = index + 1;
          break;
        case "FeatureOfInterest/id":
          elem = "featureofinterest_id";
          break;
      }
      res.push(
        isNaN(+elem)
          ? Array.isArray(elem)
            ? `'{"value": [${elem}]}'`
            : typeof elem === "string"
            ? elem.endsWith("Z")
              ? `TO_TIMESTAMP('${dateToDateWithTimeZone(elem)}', '${ EDatesType.dateWithOutTimeZone }')::TIMESTAMP`
              : `${separateur}${elem}${separateur}`
            : `${separateur}{${elem}}${separateur}`
          : index === this.indexResult && type === "VALUES"
          ? this.ctx.config.extensions.includes(EExtensions.resultNumeric)
            ? elem
            : `'{"value": ${elem}}'`
          : elem
      );
    });
    return res;
  }
  // Override get all to return error Bad request
  async getAll(): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    this.ctx.throw(400, { code: 400 });
  }
  
  // Override get one to return error Bad request
  async getSingle(): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    this.ctx.throw(400, { code: 400 });
  }
  // Override post to posted file as createObservations
  async postForm(dataInput: Record<string, any> ): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    // verify is there FORM data    
    // const datasJson = JSON.parse(this.ctx.datas["datas"]);
    const datasJson = JSON.parse(this.ctx.datas["datas"] || this.ctx.datas["json"]);
    if (!datasJson["columns"]) this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: errors.noColumn });
    const myColumns: IcsvColumn[] = [];
    const streamInfos: IstreamInfos[] = [];
    // loop for mulitDatastreams inputs or one for datastream
    await asyncForEach(
      Object.keys(datasJson["columns"]),
      async (key: string) => {
        const tempStreamInfos = await models.getStreamInfos( this.ctx.config, datasJson["columns"][key] as JSON );
        if (tempStreamInfos) {
          streamInfos.push(tempStreamInfos);
          myColumns.push(
            { 
              column: key, 
              stream: tempStreamInfos
            }
          );
        } else this.ctx.throw( EHttpCode.notFound, msg( errors.noValidStream, util.inspect(datasJson["columns"][key], { showHidden: false, depth: null, colors: false, }) ) );
      }
    );
    // Create paramsFile
    const paramsFile: IcsvFile = {
      tempTable: `temp${Date.now().toString()}`,
      filename: this.ctx.datas["file"],
      columns: myColumns,
      header: datasJson["header"] && datasJson["header"] == true ? ", HEADER" : "",
      stream: streamInfos,
    };
    // stream file in temp table and get query to insert
    const sqlInsert = await queryInsertFromCsv(this.ctx, paramsFile);
    console.log(log.debug_infos(`Stream csv file ${paramsFile.filename} in PostgreSql`, sqlInsert ? EChar.ok : EChar.notOk));
    if (sqlInsert) {
      const sqls = sqlInsert.query.map((e: string, index: number) => `${index === 0 ? 'WITH ' :', '}updated${index+1} as (${e})\n`);
      // Remove logs and triggers for speed insert
      await executeSql(this.ctx.config, `SET session_replication_role = replica;`);
      const resultSql:Record<string, any>  = await executeSql(this.ctx.config, `${sqls.join("")}SELECT (SELECT count(*) FROM ${paramsFile.tempTable}) AS total, (SELECT count(*) FROM updated1) AS inserted`);
      // Restore logs and triggers
      await executeSql(this.ctx.config, `SET session_replication_role = DEFAULT;`);
      return this.formatReturnResult({
        total: sqlInsert.count,
        body: [`Add ${ resultSql[0]["inserted"] } on ${resultSql[0]["total"]} lines from ${ paramsFile.filename.split("/").reverse()[0] }`],
      }); 
    }        
    return undefined;
  }
    // Override post xson file as createObservations
  async postJson(dataInput: Record<string, any> ): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    const returnValue: string[] = [];
    let total = 0;
      /// classic Create      
      const dataStreamId = await models.getStreamInfos(this.ctx.config, dataInput);
      if (!dataStreamId)
        this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: errors.noStream });
      else {
        await asyncForEach(dataInput["dataArray"], async (elem: string[]) => {
      const keys = [`"${dataStreamId.type?.toLowerCase()}_id"`].concat( this.createListColumnsValues( "COLUMNS", dataInput["components"] ) );
          const values = this.createListColumnsValues("VALUES", [ String(dataStreamId.id), ...elem, ]);
          await executeSqlValues(this.ctx.config, `INSERT INTO ${doubleQuotesString(this.ctx.model.Observations.table)} (${keys}) VALUES (${values}) RETURNING id`)
            .then((res: Record<string, any> ) => {
              returnValue.push( this.linkBase.replace("Create", "") + "(" + res[0]+ ")" );
              total += 1;
            })
            .catch(async (error) => {
              if (error.code === "23505") {
                returnValue.push(`Duplicate (${elem})`);
                if ( dataInput["duplicate"] && dataInput["duplicate"].toUpperCase() === "DELETE" ) {
                  await executeSqlValues(this.ctx.config, `DELETE FROM ${doubleQuotesString(this.ctx.model.Observations.table)} WHERE 1=1 ` + keys .map((e, i) => `AND ${e} = ${values[i]}`) .join(" ") + ` RETURNING id` ) .then((res: Record<string, any> ) => {
                      returnValue.push(`delete id ==> ${res[0]}`);
                      total += 1;
                    }).catch((error) => {
                      console.log(error);                     
                    });
                }
              } else this.ctx.throw(400, { code: 400, detail: error });
            });
        });
        if (returnValue) {
          return this.formatReturnResult({
            total: total,
            body: returnValue,
          });
        };
      }
  }
  // Override post caller
  async post(dataInput: JSON): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    return (this.ctx.datas) ? await this.postForm(dataInput) : await this.postJson(dataInput);
  }
  // Override update to return error Bad request
  async update( idInput: bigint | string, dataInput: Record<string, any>  | undefined ): Promise<IreturnResult | undefined> {
    console.log(log.whereIam(idInput || dataInput));
    this.ctx.throw(400, { code: 400 });
  }
  // Override delete to return error Bad request
  async delete(idInput: bigint | string): Promise<IreturnResult | undefined> {
    console.log(log.whereIam(idInput));
    this.ctx.throw(400, { code: 400 });
  }
}
