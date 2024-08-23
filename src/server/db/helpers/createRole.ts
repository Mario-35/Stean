 /**
 * createRole
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- createRole -----------------------------------!");

import { config } from "../../configuration";
import { EChar } from "../../enums";
import { addSimpleQuotes } from "../../helpers";
import { Iservice } from "../../types";
import { _RIGHTS } from "../constants";

export const createRole = async (service: Iservice ): Promise<string> => {
  const connection = config.connection(service.name);
  return new Promise(async function (resolve, reject) {
    await connection.unsafe(`SELECT COUNT(*) FROM pg_user WHERE usename = ${addSimpleQuotes(service.pg.user)};`)
        .then(async (res: Record<string, any>) => {
        if (res[0].count == 0) {            
            await connection.unsafe(`CREATE ROLE ${service.pg.user} WITH PASSWORD ${addSimpleQuotes(service.pg.password)} ${_RIGHTS}`)
            .catch((err: Error) => {
              reject(err);
            });
        } else {
            await connection.unsafe(`ALTER ROLE ${service.pg.user} WITH PASSWORD ${addSimpleQuotes(service.pg.password)}  ${_RIGHTS}`)
            .catch((err: Error) => {
              reject(err);
            });
        }
     });
    resolve(`${service.pg.user} ${EChar.ok}`);
  });
};