/**
 * testDbConnection
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import postgres from "postgres";
import { _DEBUG } from "../../constants";
import { EConstant } from "../../enums";
// test if database exist with admin connection
export async function testDbConnection(host: string, username: string, password: string, port?: number, database?: string): Promise<boolean> {
    return await postgres( `postgres://${username}:${password}@${host}:${port || 5432}/${database || "postgres"}`,
      {
        debug: _DEBUG,          
        connection: { 
          application_name : `${EConstant.appName} ${EConstant.appVersion}`
        }
      })`select 1+1 AS result`.then(async () => true)
    .catch((error: Error) => {
        console.log(error);
        return false;
      });
  }