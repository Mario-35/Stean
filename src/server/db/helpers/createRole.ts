/**
 * createRole
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { EChar, EConstant } from "../../enums";
import { simpleQuotes } from "../../helpers";
import { Iservice } from "../../types";

/**
 *
 * @param service service
 * @returns return ok or notOk
 */

export const createRole = async (service: Iservice): Promise<string> => {
    return new Promise(async function (resolve, reject) {
        await config.executeAdmin(`SELECT COUNT(*) FROM pg_user WHERE usename = ${simpleQuotes(service.pg.user)};`).then(async (res: Record<string, any>) => {
            if (res[0].count == 0) {
                await config.executeAdmin(`CREATE ROLE ${service.pg.user} WITH PASSWORD ${simpleQuotes(service.pg.password)} ${EConstant.rights}`).catch((err: Error) => {
                    reject(err);
                });
            } else {
                await config.executeAdmin(`ALTER ROLE ${service.pg.user} WITH PASSWORD ${simpleQuotes(service.pg.password)}  ${EConstant.rights}`).catch((err: Error) => {
                    reject(err);
                });
            }
        });
        resolve(`${service.pg.user} ${EChar.ok}`);
    });
};
