/**
 * executeSql
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { logging } from "../../log";
import { asyncForEach, isTest } from "../../helpers";
import { Iservice, keyobj } from "../../types";
import { _DEBUG } from "../../constants";
import { errors } from "../../messages";

const executeSqlOneValues = async (service: Iservice, query: string): Promise<object> => {
    const test = query.match(new RegExp('INSERT INTO "datastream"', "g"))?.length;
    let sql = "";
    await config
        .connection(service.name)
        .unsafe("select last_value from datastream_id_seq")
        .then((e: Record<string, any>) => {
            if (test)
                for (let i = 1; i <= test; i++) {
                    const nb = +e[0]["last_value"] + i;
                    sql += `CREATE TABLE IF NOT EXISTS "observation${nb}" PARTITION OF observation FOR VALUES IN (${nb});`;
                }
        });
    await config.connection(service.name).unsafe(sql);
    console.log(logging.whereIam(new Error().stack));
    return new Promise(async function (resolve, reject) {
        logging.debug().query(`executeSqlOneValues ${service.name}`, query).to().log().file();
        await config
            .connection(service.name)
            .unsafe(query)
            .values()
            .then((res: Record<string, any>) => {
                resolve(res[0]);
            })
            .catch((err: Error) => {
                if (!isTest() && +err["code" as keyobj] === 23505) logging.debug().error(errors.execQuery, err).to().log().file();
                reject(err);
            });
    });
};

const executeSqlMultiValues = async (service: Iservice, queries: string[]): Promise<object> => {
    return new Promise(async function (resolve, reject) {
        let result = {};
        await asyncForEach(queries, async (sql: string) => {
            await config
                .connection(typeof service === "string" ? service : service.name)
                .unsafe(sql)
                .values()
                .then((res: Record<string, any>) => {
                    result = { ...result, ...res[0] };
                })
                .catch((err: Error) => {
                    if (!isTest() && +err["code" as keyof object] === 23505) logging.debug().error(errors.execQuery, err).to().log().file();
                    reject(err);
                });
        });
        resolve(result);
    });
};
export const executeSqlValues = async (service: Iservice, query: string | string[]): Promise<object> =>
    typeof query === "string" ? executeSqlOneValues(service, query) : executeSqlMultiValues(service, query);
