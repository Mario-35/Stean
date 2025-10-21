/**
 * createRole
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { EChar } from "../../enums";
import { Iservice } from "../../types";
import { queries } from "../queries";

/**
 *
 * @param service service
 * @returns return ok or notOk
 */

export const createRole = async (service: Iservice): Promise<string> => {
    return new Promise(async function (resolve, reject) {
        await config.executeAdmin(queries.countUser(service.pg.user)).then(async (res: Record<string, any>) => {
            if (res[0].count == 0) {
                await config.executeAdmin(queries.createRole(service.pg.user, service.pg.password)).catch((err: Error) => {
                    reject(err);
                });
            } else {
                await config.executeAdmin(queries.updateRole(service.pg.user, service.pg.password)).catch((err: Error) => {
                    reject(err);
                });
            }
        });
        resolve(`${service.pg.user} ${EChar.ok}`);
    });
};
