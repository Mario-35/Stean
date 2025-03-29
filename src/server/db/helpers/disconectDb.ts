/**
 * disconectDb.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { EConstant } from "../../enums";

export const disconectDb = async (dbName: string, drop: boolean): Promise<boolean> => {
    try {
        return await config
            .connection(EConstant.admin)
            .unsafe(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = '${dbName}'`)
            .then(async () => {
                if (drop === true) await config.connection(EConstant.admin).unsafe(`DROP DATABASE IF EXISTS ${dbName}`);
                return true;
            });
    } catch (error) {
        console.log(error);
    }
    return false;
};
