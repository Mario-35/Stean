/**
 * disconnectDb.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { EErrors } from "../../enums";
import { logging } from "../../log";
import { queries } from "../queries";

/**
 *
 * @param dbName name of the database to close
 * @param drop true to drop database
 * @returns operation result
 */
export const disconnectDb = async (dbName: string, drop: boolean): Promise<boolean> => {
    try {
        return await config.executeAdmin(queries.terminate(dbName)).then(async () => {
            if (drop === true) await config.executeAdmin(queries.dropDB(dbName));
            return true;
        });
    } catch (error) {
        logging.error(error, EErrors.execQuery);
    }
    return false;
};
