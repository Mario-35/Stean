/**
 * testDbExists
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import postgres from "postgres";
import { _DEBUG, appVersion } from "../../constants";
import { IdbConnection } from "../../types";
import { EConstant } from "../../enums";

/**
 * Test if database exist with admin connection
 *
 * @param adminConn admin connection
 * @param database DB name
 * @returns true if exist
 */

export async function testDbExists(adminConn: IdbConnection, database: string): Promise<boolean> {
    return await postgres(`postgres://${adminConn.user}:${adminConn.password}@${adminConn.host}:${adminConn.port || 5432}/${database}`, {
        debug: _DEBUG,
        connection: {
            application_name: `${EConstant.appName} ${appVersion}`
        }
    })`select 1+1 AS result`
        .then(async () => true)
        .catch((error: Error) => {
            console.log(error);
            return false;
        });
}
