/**
 * executeSql
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { logging } from "../../log";
import { isTest } from "../../helpers";
import { Iservice, keyobj } from "../../types";
import { _DEBUG } from "../../constants";
import { errors } from "../../messages";

const executeSqlOne = async (service: Iservice, query: string): Promise<object> => {
    console.log(logging.whereIam(new Error().stack));
    return new Promise(async function (resolve, reject) {
        logging.debug().query(`executeSqlOne ${service.name}`, query).to().log().file();
        await config
            .connection(service.name)
            .unsafe(query)
            .then((res: object) => {
                resolve(res);
            })
            .catch((err: Error) => {
                if (!isTest() && +err["code" as keyobj] === 23505) logging.debug().error(errors.execQuery, err).to().log().file();
                reject(err);
            });
    });
};

const executeSqlMulti = async (service: Iservice, queries: string[]): Promise<object> => {
    console.log(logging.whereIam(new Error().stack));
    return new Promise(async function (resolve, reject) {
        await config
            .connection(service.name)
            .begin((sql) =>
                queries.map(async (query: string) => {
                    logging.debug().query(`executeSqlMulti ${service.name}`, query).to().log().file();
                    await sql.unsafe(query);
                })
            )
            .then((res: object) => {
                resolve(res);
            })
            .catch((err: Error) => {
                if (!isTest() && +err["code" as keyobj] === 23505) logging.debug().error(errors.execQuery, err).to().log().file();
                reject(err);
            });
    });
};

export const executeSql = async (service: Iservice, query: string | string[]): Promise<object> => (typeof query === "string" ? executeSqlOne(service, query) : executeSqlMulti(service, query));
