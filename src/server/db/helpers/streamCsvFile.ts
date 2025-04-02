/**
 * streamCsvFile
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IcsvFile, IcsvImport, Iservice } from "../../types";
import { createReadStream } from "fs";
import { addAbortSignal } from "stream";
import { config } from "../../configuration";
import { log } from "../../log";

export async function streamCsvFile(service: Iservice, paramsFile: IcsvFile, sqlRequest: IcsvImport): Promise<number> {
    console.log(log.whereIam());
    const cols: string[] = [];
    const controller = new AbortController();
    const readable = createReadStream(paramsFile.filename);
    sqlRequest.columns.forEach((value) => cols.push(`"${value}" varchar(255) NULL`));
    await config.executeSql(service, `CREATE TABLE "${paramsFile.tempTable}" ( id serial4 NOT NULL, ${cols}, CONSTRAINT ${paramsFile.tempTable}_pkey PRIMARY KEY (id));`).catch((error: any) => {
        console.log(error);
    });
    const writable = config
        .connection(service.name)
        .unsafe(`COPY "${paramsFile.tempTable}" (${sqlRequest.columns.join(",")}) FROM STDIN WITH(FORMAT csv, DELIMITER ';'${paramsFile.header})`)
        .writable();
    return new Promise(async function (resolve, reject) {
        readable
            .pipe(addAbortSignal(controller.signal, await writable))
            .on("finish", async (e: any) => {
                await config
                    .executeSqlValues(service, `SELECT count(id) FROM "${paramsFile.tempTable}"`)
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
