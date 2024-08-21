 /**
 * createUser
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

 import { EChar } from "../../enums";
import { IconfigFile } from "../../types";
import { _RIGHTS } from "../constants";
import { userAccess } from "../dataAccess";
// onsole.log("!----------------------------------- createUser -----------------------------------!");

export const createUser = async (config: IconfigFile): Promise<string> => {
  return new Promise(async function (resolve, reject) {
    await userAccess.post(config.name, {
      username: config.pg.user,
      email: "TWOdefault@email.com",
      password: config.pg.password,
      database: config.pg.database,
      canPost: true,
      canDelete: true,
      canCreateUser: true,
      canCreateDb: true,
      superAdmin: false,
      admin: false})
    .then(() => { resolve(`${config.pg.user} ${EChar.ok}`); })
    .catch((err: Error) => {
      console.log(err);
      reject(err);
    });
  });
};