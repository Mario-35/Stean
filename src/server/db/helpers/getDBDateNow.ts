/**
 * getDBDateNow
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- getDBDateNow -----------------------------------!");

import { executeSqlValues } from ".";
import { Iservice } from "../../types";
export const getDBDateNow = async ( service: Iservice  ): Promise<string> => await executeSqlValues(service, "SELECT current_timestamp;").then((res: Record<string, any>) => res[0]);