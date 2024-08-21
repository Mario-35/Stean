/**
 * Index Helpers
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Index Helpers -----------------------------------!");

import { koaContext } from "../../types";
import { exportToJson } from "./exportToJson";
import { exportToXlsx } from "./exportToXlsx";

export { addToService } from "./addToService";
export { createDatabase } from "../createDb";
export { createService } from "./createService";
export { createTable } from "./createTable";
export { createUser } from "./createUser";
export { dateToDateWithTimeZone } from "./dateToDateWithTimeZone";
export { executeAdmin } from "./executeAdmin";
export { executeSql } from "./executeSql";
export { executeSqlValues } from "./executeSqlValues";
export { getDBDateNow } from "./getDBDateNow";
export { removeKeyFromUrl } from "./removeKeyFromUrl";
export { queryInsertFromCsv } from "./queryInsertFromCsv";
export { columnsNameFromCsv } from "./columnsNameFromCsv";
export { streamCsvFile } from "./streamCsvFile";
export { createIndexes } from "./createIndexes";
export { columnsNameFromHydrasCsv } from "./columnsNameFromHydrasCsv";
export const exportService = async (ctx: koaContext) => { return (ctx.url.includes("xls")) ? exportToXlsx(ctx) : exportToJson(ctx); };