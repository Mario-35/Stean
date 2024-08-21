 /**
 * createRole
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- createRole -----------------------------------!");

import { serverConfig } from "../../configuration";
import { EChar } from "../../enums";
import { addSimpleQuotes } from "../../helpers";
import { IconfigFile } from "../../types";
import { _RIGHTS } from "../constants";

export const createRole = async (config: IconfigFile): Promise<string> => {
  const connection = serverConfig.connection(config.name);
  return new Promise(async function (resolve, reject) {
    await connection.unsafe(`SELECT COUNT(*) FROM pg_user WHERE usename = ${addSimpleQuotes(config.pg.user)};`)
        .then(async (res: Record<string, any>) => {
        if (res[0].count == 0) {            
            await connection.unsafe(`CREATE ROLE ${config.pg.user} WITH PASSWORD ${addSimpleQuotes(config.pg.password)} ${_RIGHTS}`)
            .catch((err: Error) => {
              reject(err);
            });
        } else {
            await connection.unsafe(`ALTER ROLE ${config.pg.user} WITH PASSWORD ${addSimpleQuotes(config.pg.password)}  ${_RIGHTS}`)
            .catch((err: Error) => {
              reject(err);
            });
        }
     });
    resolve(`${config.pg.user} ${EChar.ok}`);
  });
};