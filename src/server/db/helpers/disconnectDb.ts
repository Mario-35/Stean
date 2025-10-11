/**
 * disconnectDb.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { logging } from "../../log";
import { errors } from "../../messages";

/**
 *
 * @param dbName name of the database to close
 * @param drop true to drop database
 * @returns operation result
 */
export const disconnectDb = async (dbName: string, drop: boolean): Promise<boolean> => {
    try {
        return await config.executeAdmin(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = '${dbName}'`).then(async () => {
            if (drop === true) await config.executeAdmin(`DROP DATABASE IF EXISTS ${dbName}`);
            return true;
        });
    } catch (error) {
        logging.debug().error(errors.execQuery, error).to().log().file();
    }
    return false;
};
