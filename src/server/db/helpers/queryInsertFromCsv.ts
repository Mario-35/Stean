/**
 * queryInsertFromCsv.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IcsvColumn, IcsvFile, Iservice } from "../../types";
import { columnsNameFromHydrasCsv, streamCsvFile } from ".";
import { log } from "../../log";
import { EChar } from "../../enums";
import { OBSERVATION } from "../../models/entities";

export async function queryInsertFromCsv(service: Iservice, paramsFile: IcsvFile): Promise<{ count: number; query: string[] } | undefined> {
    console.log(log.whereIam());
    const sqlRequest = await columnsNameFromHydrasCsv(paramsFile);
    if (sqlRequest) {
        const stream = await streamCsvFile(service, paramsFile, sqlRequest);
        console.log(log.debug_infos(`COPY TO ${paramsFile.tempTable}`, stream > 0 ? EChar.ok : EChar.notOk));
        if (stream > 0) {
            const fileImport = paramsFile.filename.split("/").reverse()[0];
            const dateImport = new Date().toLocaleString();
            // stream finshed so COPY
            const scriptSql: string[] = [];
            // make import query
            Object.keys(paramsFile.columns).forEach((myColumn: string, index: number) => {
                const csvColumn: IcsvColumn = paramsFile.columns[myColumn as keyof object];
                scriptSql.push(`INSERT INTO "${OBSERVATION.table}" 
          ("${csvColumn.stream.type?.toLowerCase()}_id", "featureofinterest_id", "phenomenonTime", "resultTime", "result", "resultQuality")
            SELECT 
            ${csvColumn.stream.id}, 
            ${csvColumn.stream.FoId},  
            ${sqlRequest.dateSql}, 
            ${sqlRequest.dateSql},
            json_build_object('value', 
            CASE "${paramsFile.tempTable}".value${csvColumn.column}
              WHEN '---' THEN NULL 
              WHEN '#REF!' THEN NULL 
              ELSE CAST(REPLACE(value${csvColumn.column},',','.') AS float) 
            END),
            '{"import": "${fileImport}","date": "${dateImport}"}'  
           FROM "${paramsFile.tempTable}" ON CONFLICT DO NOTHING returning 1`);
            });
            return {
                count: stream,
                query: scriptSql
            };
        }
    }
}
