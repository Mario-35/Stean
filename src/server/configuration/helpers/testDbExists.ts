/**
 * testDbExists
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- testDbExists -----------------------------------!");

import postgres from "postgres";
import { APP_NAME, APP_VERSION, _DEBUG } from "../../constants";
import { IdbConnection } from "../../types";

// test if database exist with admin connection
export async function  testDbExists(adminConn: IdbConnection, database: string): Promise<boolean> {
    return await postgres( `postgres://${adminConn.user}:${adminConn.password}@${adminConn.host}:${adminConn.port || 5432}/${database}`,
      {
        debug: _DEBUG,          
        connection: { 
          application_name : `${APP_NAME} ${APP_VERSION}`
        }
      })`select 1+1 AS result`.then(async () => true)
    .catch((error: Error) => {
        console.log(error);
        return false;
      });
  }