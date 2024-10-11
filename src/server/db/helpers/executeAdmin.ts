/**
 * executeAdmin.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { config } from "../../configuration";
import { EConstant } from "../../enums";
import { log } from "../../log";
export const executeAdmin = async (query: string): Promise<object> => {
    config.writeLog(log.query(query));
    return new Promise(async function (resolve, reject) {
        await config.connection(EConstant.admin).unsafe(query).then((res: object) => {                            
            resolve(res);
        }).catch((err: Error) => {
            reject(err);
        });
    });
};