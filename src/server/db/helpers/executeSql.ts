/**
 * executeSql
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- executeSql -----------------------------------!");

import { config } from "../../configuration";
import { log } from "../../log";
import { isTest } from "../../helpers";
import { Iservice, keyobj } from "../../types";

const executeSqlOne = async (service: Iservice , query: string): Promise<object> => {
    config.writeLog(log.query(query))
    return new Promise(async function (resolve, reject) {
        await config.connection(service.name).unsafe(query).then((res: object) => {                            
            resolve(res);
        }).catch((err: Error) => {
            if (!isTest() && +err["code" as keyobj] === 23505) config.writeLog(log.queryError(query, err));
            reject(err);
        });
    });
};

const executeSqlMulti = async (service: Iservice , query: string[]): Promise<object> => {
    config.writeLog(log.query(query));
    return new Promise(async function (resolve, reject) {
        await config.connection(service.name).begin(sql => query.map((e: string) => sql.unsafe(e)))
        .then((res: object) => {                            
            resolve(res);
        }).catch((err: Error) => {
            if (!isTest() && +err["code" as keyobj] === 23505) config.writeLog(log.queryError(query, err));
            reject(err);
        });
    });
};

export const executeSql = async (service: Iservice , query: string | string[]): Promise<object> => typeof query === "string" 
    ? executeSqlOne(service, query) 
    : executeSqlMulti(service, query);