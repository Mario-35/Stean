/**
 * executeAdmin.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- executeAdmin. -----------------------------------!\n");
import { config } from "../../configuration";
import { ADMIN } from "../../constants";
import { log } from "../../log";

export const executeAdmin = async (query: string): Promise<object> => {
    config.writeLog(log.query(query));
    return new Promise(async function (resolve, reject) {
        await config.connection(ADMIN).unsafe(query).then((res: object) => {                            
            resolve(res);
        }).catch((err: Error) => {
            reject(err);
        });
    });
};