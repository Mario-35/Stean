/**
 * CreateObservations entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { IcsvColumn, IcsvFile, Id, IreturnResult, IstreamInfos, koaContext } from "../../types";
import { executeSql, executeSqlValues, dateToDateWithTimeZone, InsertFromCsv } from "../helpers";
import { doubleQuotes, asyncForEach, splitLast, makeNull } from "../../helpers";
import { messages } from "../../messages/";
import { EChar, EConstant, EDatesType, EErrors, EHttpCode, EInfos, EState } from "../../enums";
import util from "util";
import { models } from "../../models";
import { logging } from "../../log";
import { OBSERVATION } from "../../models/entities";
import { queries } from "../queries";
import { config } from "../../configuration";

/**
 * CreateObservations Class
 */

export class CreateObservations extends Common {
    public indexResult = -1;
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }

    // creatle liste of data values
    createListColumnsValues(type: "COLUMNS" | "VALUES", input: string[], stream: IstreamInfos): string[] {
        console.log(logging.whereIam(new Error().stack));
        function formatResult(value: any, test: boolean): string {
            if(test) 
                switch (String(stream.observationType)) {
                case  "http://www.opengis.net/def/observation-type/ogc-om/2.0/om_complex-observation": // "_resulttext",
                    return `'{"value": [${value}]}'`
                case  "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_CountObservation": // = "number",
                    return `'{"value": ${value}}'`
                case  "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement": // = "number",
                    return `'{"value": ${value}}'`
                case  "http://www.opengis.net/def/observation-type/ogc-om/2.0/om_complex-observation": // = "array",
                    return `'{"value": [${value}]}'`
                case  "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation": // = "any",
                    return `'{"value": "${value}"}'`
                case  "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_TruthObservation": // = "_resultBoolean",
                    return `'{"value": ${value}}'`
                case  "http://www.opengis.net/def/observation-type/ogc-omxml/2.0/swe-array-observation": // = "object"
                    return `'{"value": "${value}"}'`        
            }
            return `${separateur}${value}${separateur}`;
        }

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
                            ? `TO_TIMESTAMP('${dateToDateWithTimeZone(elem)}', '${EDatesType.dateImport}')::TIMESTAMP`
                            : formatResult(elem, (index === this.indexResult && type === "VALUES"))
                        : `${separateur}{${elem}}${separateur}`
                    : formatResult(elem, (index === this.indexResult && type === "VALUES"))
            );
        });
        return res;
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

    // Override post to posted file as createObservations
    async postForm(): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        // verify is there FORM data
        const datasJson = JSON.parse(this.ctx.datas["jsonDatas"] || this.ctx.datas["datas"] || this.ctx.datas["json"]);
        if (!datasJson["columns"]) this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: EErrors.noColumn });
        const myColumns: IcsvColumn[] = [];
        const streamInfos: IstreamInfos[] = [];
        // loop for mulitDatastreams inputs or one for datastream
        await asyncForEach(Object.keys(datasJson["columns"]), async (key: string) => {
            const tempStreamInfos = await models.streamInfos(this.ctx, datasJson["columns"][key] as JSON);
            if (tempStreamInfos) {
                streamInfos.push(tempStreamInfos);
                myColumns.push({
                    column: key,
                    stream: tempStreamInfos
                });
            } else this.ctx.throw(EHttpCode.notFound, messages.str(EErrors.noValidStream, util.inspect(datasJson["columns"][key], { showHidden: false, depth: null, colors: false })));
        });
        // Create paramsFile
        const paramsFile: IcsvFile = {
            tempTable: `temp${Date.now().toString()}`,
            filename: this.ctx.datas["file"],
            columns: myColumns,
            header: datasJson["header"] && datasJson["header"] == true ? ", HEADER" : "",
            stream: streamInfos
        };
        // stream file in temp table and get query to insert
        const sqlInsert = await new InsertFromCsv(this.ctx, paramsFile).query();
        logging
            .message(messages.str(EInfos.streamFile, paramsFile.filename), sqlInsert ? EChar.ok : EChar.notOk)
            .to()
            .log()
            .file();
        if (sqlInsert) {
            const sqls = sqlInsert.query.map((e: string, index: number) => `${index === 0 ? "WITH " : ", "}updated${index + 1} as (${e})${EConstant.return}`);
            // Remove logs and triggers for speed insert
            await executeSql(this.ctx._.service, queries.logsAndTriggers(false));
            const resultSql: Record<string, any> = await executeSql(
                this.ctx._.service,
                `${sqls.join("")}SELECT (SELECT count(*) FROM ${paramsFile.tempTable}) AS total, (SELECT count(*) FROM updated1) AS inserted`
            );
            // Restore logs and triggers
            await executeSql(this.ctx._.service, queries.logsAndTriggers(true));
                
            return this.formatReturnResult({
                total: sqlInsert.count,
                body: [`Add ${resultSql[0]["inserted"]} on ${resultSql[0]["total"]} lines from ${splitLast(paramsFile.filename, "/")}`]
            });
        }
        return undefined;
    }

    // Override post xson file as createObservations
    async postJson(dataInput: Record<string, any>): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        config.setServiceState(this.ctx._.service, EState.importing);
        const returnValue: string[] = [];
        let total = 0;
        /// classic Create
        const dataStreamId = await models.streamInfos(this.ctx, dataInput);
        
        if (!dataStreamId) this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: EErrors.noStream });
        else {
            const columnList= [...dataInput["components"]];
            // init add index
            let addIndex = -1;        
            // verify if resultTime present
            if (!dataInput["components"].includes("resultTime") && dataInput["components"].includes("phenomenonTime")) {
                // get the index in column lists
                addIndex = dataInput["components"].indexOf("phenomenonTime");
                // Add it to colum list to insert
                columnList.push("resultTime");
            }
            // verify if phenomenonTime present
            if (!dataInput["components"].includes("phenomenonTime") && dataInput["components"].includes("resultTime")) {
                // get the index in column lists
                addIndex = dataInput["components"].indexOf("resultTime");
                // Add it to colum list to insert
                columnList.push("phenomenonTime");
            }
            // create keys
            const keys = [`"${dataStreamId.type?.toLowerCase()}_id"`].concat(this.createListColumnsValues("COLUMNS", columnList, dataStreamId));
            await asyncForEach(dataInput["dataArray"], async (elem: string[]) => {
                // if adding resultTime or phenomenonTime that is not in values
                if (addIndex >= 0 ) 
                    elem.push(elem[addIndex]);
                // create insert values
                const values = this.createListColumnsValues("VALUES", [String(dataStreamId.id), ...elem], dataStreamId);                
                await executeSqlValues(this.ctx._.service, `INSERT INTO ${doubleQuotes(OBSERVATION.table)} (${keys}) VALUES (${makeNull(values.toString())}) RETURNING id`)
                    .then((res: Record<string, any>) => {
                        returnValue.push(this.linkBase.replace("Create", "") + "(" + res[0] + ")");
                        total += 1;
                    }).catch(async (error) => {
                        if (error.code === "23505") {
                            returnValue.push(`Duplicate (${elem})`);
                            if (dataInput["duplicate"] && dataInput["duplicate"].toUpperCase() === "DELETE") {
                                await executeSqlValues(
                                    this.ctx._.service,
                                    `DELETE FROM ${doubleQuotes(OBSERVATION.table)} WHERE 1=1 ` + keys.map((e, i) => `AND ${e} = ${values[i]}`).join(" ") + ` RETURNING id`
                                ).then((res: Record<string, any>) => {
                                    returnValue.push(`delete id ==> ${res[0]}`);
                                    total += 1;
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                            }
                        } else this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: error });
                    });
            });
            
            config.setServiceState(this.ctx._.service, EState.normal);
            if (returnValue) {
                return this.formatReturnResult({
                    total: total,
                    body: returnValue
                });
            }
        }
    }

    // Override post caller
    async post(dataInput: JSON): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));        
        return this.ctx.datas 
            ? await this.postForm() 
            : await this.postJson(Array.isArray(dataInput) 
                ? Object(dataInput)[0] 
                : dataInput);
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
