/**
 * executeSqlValues
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { log } from "../../log";
import { asyncForEach, isTest } from "../../helpers";
import { Iservice } from "../../types";
export const executeSqlValues = async (service: Iservice | string, query: string | string[]): Promise<object> => {
    config.writeLog(log.query(query));
    if (typeof query === "string") {
        return new Promise(async function (resolve, reject) {
            await config
                .connection(typeof service === "string" ? service : service.name)
                .unsafe(query)
                .values()
                .then((res: Record<string, any>) => {
                    resolve(res[0]);
                })
                .catch((err: Error) => {
                    if (!isTest() && +err["code" as keyof object] === 23505) config.writeLog(log.queryError(query, err));
                    reject(err);
                });
        });
    } else {
        return new Promise(async function (resolve, reject) {
            let result = {};
            await asyncForEach(query, async (sql: string) => {
                await config
                    .connection(typeof service === "string" ? service : service.name)
                    .unsafe(sql)
                    .values()
                    .then((res: Record<string, any>) => {
                        result = { ...result, ...res[0] };
                    })
                    .catch((err: Error) => {
                        if (!isTest() && +err["code" as keyof object] === 23505) config.writeLog(log.queryError(query, err));
                        reject(err);
                    });
            });
            resolve(result);
        });
    }
};
