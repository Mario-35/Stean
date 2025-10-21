/**
 * getDBDateNow
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { executeSqlValues } from ".";
import { Iservice } from "../../types";
import { queries } from "../queries";
export const getDBDateNow = async (service: Iservice): Promise<string> => await executeSqlValues(service, queries.getDate()).then((res: Record<string, any>) => res[0]);
