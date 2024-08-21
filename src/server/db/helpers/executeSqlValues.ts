/**
 * executeSqlValues
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- executeSqlValues. -----------------------------------!");

import { serverConfig } from "../../configuration";
import { log } from "../../log";
import { asyncForEach, isTest } from "../../helpers";
import { IconfigFile } from "../../types";

export const executeSqlValues = async (config: IconfigFile | string, query: string | string[]): Promise<object> => {
    serverConfig.writeLog(log.query(query));
    if (typeof query === "string") {
        return new Promise(async function (resolve, reject) {
            await serverConfig.connection(typeof config === "string" ? config : config.name).unsafe(query).values().then((res: Record<string, any>) => {
      resolve(res[0]);
            }).catch((err: Error) => {
                if (!isTest() && +err["code" as keyof object] === 23505) serverConfig.writeLog(log.queryError(query, err));
                reject(err);
            });
        });
    } else {
        return new Promise(async function (resolve, reject) {
            let result = {};
            await asyncForEach(
                query,
                async (sql: string) => {
                await serverConfig.connection(typeof config === "string" ? config : config.name).unsafe(sql).values().then((res: Record<string, any>) => { 
      result = { ... result, ...res[0] };
                }).catch((err: Error) => {
                    if (!isTest() && +err["code" as keyof object] === 23505) serverConfig.writeLog(log.queryError(query, err));
                    reject(err);
                });    
            });
            resolve(result);            
        });

    }
};