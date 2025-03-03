/**
 * testDbConnection
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import postgres from "postgres";
import { _DEBUG, appVersion } from "../../constants";
import { EConstant } from "../../enums";

/**
 * Test if database exist with admin connection
 *
 * @param host pg host name
 * @param username pg username name
 * @param password pg password name
 * @param port pg port name
 * @param database pg database name
 * @returns true if connection valid
 */

export async function testDbConnection(host: string, username: string, password: string, port?: number, database?: string): Promise<boolean> {
    return await postgres(`postgres://${username}:${password}@${host}:${port || 5432}/${database || "postgres"}`, {
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
