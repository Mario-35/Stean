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
export const createUser = async (service: Iservice ): Promise<string> => {
  return new Promise(async function (resolve, reject) {
    await userAccess.post(service.name, {
      username: service.pg.user,
      email: "TWOdefault@email.com",
      password: service.pg.password,
      database: service.pg.database,
      canPost: true,
      canDelete: true,
      canCreateUser: true,
      canCreateDb: true,
      superAdmin: false,
      admin: false})
    .then(() => { resolve(`${service.pg.user} ${EChar.ok}`); })
    .catch((err: Error) => {
      console.log(err);
      reject(err);
    });
  });
};