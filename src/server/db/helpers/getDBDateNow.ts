/**
 * getDBDateNow
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { Iservice } from "../../types";
export const getDBDateNow = async (service: Iservice): Promise<string> => await config.executeSqlValues(service, "SELECT current_timestamp;").then((res: Record<string, any>) => res[0]);
