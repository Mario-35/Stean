 /**
 * createRole
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { EChar, EConstant } from "../../enums";
import { simpleQuotesString } from "../../helpers";
import { Iservice } from "../../types";
export const createRole = async (service: Iservice ): Promise<string> => {
  const connection = config.connection(service.name);
  return new Promise(async function (resolve, reject) {
    await connection.unsafe(`SELECT COUNT(*) FROM pg_user WHERE usename = ${simpleQuotesString(service.pg.user)};`)
        .then(async (res: Record<string, any>) => {
        if (res[0].count == 0) {            
            await connection.unsafe(`CREATE ROLE ${service.pg.user} WITH PASSWORD ${simpleQuotesString(service.pg.password)} ${EConstant.rights}`)
            .catch((err: Error) => {
              reject(err);
            });
        } else {
            await connection.unsafe(`ALTER ROLE ${service.pg.user} WITH PASSWORD ${simpleQuotesString(service.pg.password)}  ${EConstant.rights}`)
            .catch((err: Error) => {
              reject(err);
            });
        }
     });
    resolve(`${service.pg.user} ${EChar.ok}`);
  });
};