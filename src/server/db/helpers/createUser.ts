/**
 * createUser
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { EChar } from "../../enums";
import { Iservice } from "../../types";
import { userAccess } from "../dataAccess";

/**
 *
 * @param service service
 * @returns return user string
 */

export const createUser = async (service: Iservice): Promise<string> => {
    return new Promise(async function (resolve, reject) {
        await userAccess
            .post(service.name, {
                username: service.pg.user,
                email: "default@email.com",
                password: service.pg.password,
                database: service.pg.database,
                canPost: true,
                canDelete: true,
                canCreateUser: true,
                canCreateDb: true,
                superAdmin: false,
                admin: false
            })
            .then(() => {
                resolve(`${service.pg.user} ${EChar.ok}`);
            })
            .catch((err: Error) => {
                console.log(err);
                reject(err);
            });
    });
};
