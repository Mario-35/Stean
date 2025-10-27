/**
 * insertFromCsv.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IcsvColumn, IcsvFile, IcsvImport, Iservice, koaContext } from "../../types";
import { executeSql, executeSqlValues, streamCsvFile } from ".";
import { logging } from "../../log";
import { EChar } from "../../enums";
import { OBSERVATION } from "../../models/entities";
import { splitLast } from "../../helpers";
import { _DEBUG } from "../../constants";
import readline from "readline";
import fs from "fs";
import { createReadStream } from "fs";
import { addAbortSignal } from "stream";
import { config } from "../../configuration";
import { queries } from "../queries";

export class InsertFromCsv {
    readonly ctx: koaContext;
    paramsFile: IcsvFile;

    constructor(ctx: koaContext, paramsFile: IcsvFile) {
        console.log(logging.whereIam(new Error().stack));
        this.ctx = ctx;
        this.paramsFile = paramsFile;
    }

    creteNbColums(nb: number) {
        return Array(nb)
            .fill("")
            .map((_, i) => `value${i}`);
    }

    async createColumnsName(): Promise<IcsvImport | undefined> {
        console.log(logging.whereIam(new Error().stack));
        const returnValue: IcsvImport = { header: false, dateSql: "", columns: [] };
        const fileStream = fs.createReadStream(this.paramsFile.filename);
        const regexDate = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g;
        const regexHour = /^[0-9]{2}[:][0-9]{2}[:][0-9]{2}$/g;
        const regexDateHour = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4} [0-9]{2}[:][0-9]{2}$/g;
        const regexDateHourTz = /^[0-9]{4}[-][0-9]{2}[-][0-9]{2} [0-9]{2}[:][0-9]{2}[:][0-9]{2}[+][0-9]{2}$/g;
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in filename as a single line break.
        for await (const line of rl) {
            const splitColumns = line.split(";");
            if (regexDateHour.test(splitColumns[0]) == true || regexDateHourTz.test(splitColumns[0]) == true) {
                returnValue.columns = this.creteNbColums(splitColumns.length);
                fileStream.destroy();
                returnValue.dateSql = `TO_TIMESTAMP(REPLACE("${this.paramsFile.tempTable}".value0, '24:00:00', '23:59:59'), 'DD/MM/YYYY HH24:MI:SS')`;
                return returnValue;
            } else if (regexDate.test(splitColumns[0]) == true && regexHour.test(splitColumns[1]) == true) {
                returnValue.columns = Array(splitColumns.length)
                    .fill("")
                    .map((_, i) => `value${i}`);
                fileStream.destroy();
                returnValue.dateSql = `TO_TIMESTAMP(CONCAT("${this.paramsFile.tempTable}".value0, REPLACE("${this.paramsFile.tempTable}".value1, '24:00:00', '23:59:59')), 'DD/MM/YYYYHH24:MI:SS:MS')`;
                return returnValue;
                // detect if is csv observation save
            } else if (Object.keys(OBSERVATION.columns).includes(splitColumns[0]) || Object.keys(OBSERVATION.columns).includes(splitColumns[1])) {
                logging.message("nothing found", "default").toLogAndFile();
                const obs = Object.keys(OBSERVATION.columns).filter((e) => !e.includes("_id"));
                Object.keys(OBSERVATION.relations).forEach((e) => obs.push(e));
                splitColumns.forEach((e, i) => {
                    returnValue.columns.push(obs.includes(e) ? e : `value-${i}`);
                });
                fileStream.destroy();
                return returnValue;
            }
            // go to the next line because we found header
            returnValue.header = true;
        }
        return returnValue;
    }

    async streamFile(service: Iservice, paramsFile: IcsvFile, sqlRequest: IcsvImport): Promise<number> {
        console.log(logging.whereIam(new Error().stack));
        const cols: string[] = Array(sqlRequest.columns.length)
            .fill("")
            .map((_, i) => `value${i}`);
        const controller = new AbortController();
        const readable = createReadStream(paramsFile.filename);
        await executeSql(
            service,
            `CREATE TABLE "${paramsFile.tempTable}" ( id serial4 NOT NULL, ${cols.map((e) => `"${e}" ${e === "result" ? "float NULL" : "varchar(255) NULL"}`)}, CONSTRAINT ${
                paramsFile.tempTable
            }_pkey PRIMARY KEY (id));`
        ).catch((error: any) => {
            console.log(error);
        });
        const writable = config
            .connection(service.name)
            .unsafe(`COPY "${paramsFile.tempTable}" (${cols.join(",")}) FROM STDIN WITH(FORMAT csv, DELIMITER ';', NULL ' ' ${paramsFile.header})`)
            .writable();
        return new Promise(async function (resolve, reject) {
            readable
                .pipe(addAbortSignal(controller.signal, await writable))
                .on("finish", async (e: any) => {
                    await executeSqlValues(service, queries.count(paramsFile.tempTable, "id"))
                        .then((e) => {
                            resolve(+e[0 as keyof object]);
                        })
                        .catch((error) => {
                            console.log(error);
                            resolve(-1);
                        });
                })
                .on("error", (error) => {
                    console.log(error);
                    resolve(-1);
                });
        });
    }

    async query(): Promise<{ count: number; query: string[] } | undefined> {
        console.log(logging.whereIam(new Error().stack));
        const sqlRequest = await this.createColumnsName();
        if (sqlRequest) {
            const kelResult = (def: any) => {
                const tmp = sqlRequest.columns.findIndex((element) => element === "result");
                return tmp > 0
                    ? `json_build_object('value', TRANSLATE (SUBSTRING (value${tmp} FROM '(([0-9]+.*)*[0-9]+)'), '[]','')::FLOAT)`
                    : `json_build_object('value', CASE "${this.paramsFile.tempTable}"."${def}" WHEN '---' THEN NULL WHEN '#REF!' THEN NULL ELSE CAST(REPLACE(value2,',','.') AS FLOAT) END)`;
            };
            const kel = (search: string, def: any) => {
                const tmp = sqlRequest.columns.findIndex((element) => element === search);
                return tmp > 0 ? `value${tmp}` : def;
            };
            const kelName = (search: string, def: any) => {
                const tmp = sqlRequest.columns.findIndex((element) => element === search);
                return tmp > 0
                    ? `CASE value${tmp}
            WHEN 'NULL' THEN NULL
            WHEN NULL THEN NULL
            ELSE (SELECT id FROM "${search.toLowerCase()}" WHERE name = value${tmp}::JSONB->>'name')
        END`
                    : def;
            };
            const stream = await streamCsvFile(this.ctx.service, this.paramsFile, sqlRequest);
            logging
                .message(`COPY TO ${this.paramsFile.tempTable}`, stream > 0 ? EChar.ok : EChar.notOk)
                .to()
                .log()
                .file();
            if (stream > 0) {
                const fileImport = splitLast(this.paramsFile.filename, "/");
                const dateImport = new Date().toLocaleString();
                // stream finshed so COPY
                const scriptSql: string[] = [];
                // make import query
                Object.keys(this.paramsFile.columns).forEach((myColumn: string, index: number) => {
                    const csvColumn: IcsvColumn = this.paramsFile.columns[myColumn as keyof object];
                    scriptSql.push(`INSERT INTO "${OBSERVATION.table}" 
              ("${csvColumn.stream.type?.toLowerCase()}_id", "featureofinterest_id", "phenomenonTime", "resultTime", "result", "resultQuality")
                SELECT 
                ${kelName("Datastream", csvColumn.stream.id)}, 
                ${kelName("FeatureOfInterest", csvColumn.stream.FoId)},
                ${kel("phenomenonTime", sqlRequest.dateSql)}::timestamptz, 
                ${kel("resultTime", sqlRequest.dateSql)}::timestamptz,                 
                ${kelResult("value2")},
                '{"import": "${fileImport}","date": "${dateImport}"}'  
               FROM "${this.paramsFile.tempTable}" ON CONFLICT DO NOTHING returning 1`);
                });
                return {
                    count: stream,
                    query: scriptSql
                };
            }
        }
    }
}

// json_build_object('value', CASE "${this.paramsFile.tempTable}".${kel("result", "value2")} WHEN '---' THEN NULL WHEN '#REF!' THEN NULL ELSE CAST(REPLACE(value2,',','.') AS float) END),
