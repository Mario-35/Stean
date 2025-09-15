/**
 * Main Helpers.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { koaContext } from "../types";
export const getUserId = (ctx: koaContext): number => (ctx.state.user && ctx.state.user.id ? ctx.state.user.id : -1);
export const unikeList = (input: string[]) => [...new Set(input)];
export {
    isTest,
    isProduction,
    isReturnDataArray,
    isReturnCsv,
    isReturnGraph,
    isObservation,
    isReturnGeoJson,
    isAdmin,
    isAllowedTo,
    isString,
    isBoolean,
    isNumber,
    isIntegerNumber,
    isObject,
    isArray
} from "./tests";
export { asyncForEach } from "./asyncForEach";
export { cleanStringComma } from "./cleanStringComma";
export { cleanUrl } from "./cleanUrl";
export { removeFromUrl } from "./removeFromUrl";
export { createBearerToken } from "./createBearerToken";
export { deepClone } from "./deepClone";
export { encrypt, decrypt } from "./crypto";
export { getBigIntFromString } from "./getBigIntFromString";
export { getUrlKey } from "./getUrlKey";
export { hideKeysInJson } from "./hideKeysInJson";
export { readRemoteVersion } from "./readRemoteVersion";
export { hidePassword } from "./hidePassword";
export { notNull } from "./notNull";
export { returnFormats } from "./returnFormats";
export { unique } from "./unique";
export { searchInJson } from "./searchInJson";
export { flatten } from "./flatten";
export { listFiles } from "./listFiles";
export { compareVersions } from "./compareVersions";
export { promiseHttpsRequest } from "./promiseHttpsRequest";
export { httpsDownload } from "./httpsDownload";
export { httpsDownloadJSON } from "./httpsDownloadJson";
export { upload } from "./upload";
export { connectWeb } from "./connectWeb";
export { logToHtml } from "./logToHtml";
export { Csv } from "./csv";
export const removeFirstAndEnd = (input: string, char: string) => (input[0] === char && input[input.length - 1] === char[0] ? input.slice(0, -1).slice(1).trim() : input);
export const removeAllQuotes = (input: string): string => input.replace(/['"]+/g, "");
export const escapeSimpleQuotes = (input: string) => input.replace(/[']+/g, "''");
export const escapeDoubleQuotes = (input: string) => input.replace(/["]+/g, '\\"');
export const trimSimpleQuotes = (input: string) => input.replace(/^'+/, "").replace(/'+$/, "");
export const trimDoubleQuotes = (input: string) => input.replace(/^"+/, "").replace(/"+$/, "");
export const removeFirstEndDoubleQuotes = (input: string) => removeFirstAndEnd(input, '"');
export const removeFirstEndSimpleQuotes = (input: string) => removeFirstAndEnd(input, "'");
export const trimAllQuotes = (input: string) => trimDoubleQuotes(trimSimpleQuotes(input));
export const formatPgString = (input: string): string => escapeSimpleQuotes(trimAllQuotes(input));
export const doubleQuotes = (input: string): string => `"${escapeDoubleQuotes(trimDoubleQuotes(input))}"`;
export const simpleQuotesString = (input: string): string => `'${escapeSimpleQuotes(trimSimpleQuotes(input))}'`;
export const formatPgTableColumn = (table: string, column?: string) => `\"${table}\"${column ? `.\"${column}\"` : ""}`;
export const formatPgSelectTableColumn = (table: string, column?: string) => `SELECT ${column === "*" ? "*" : formatPgTableColumn(table, column)} FROM \"${table}\"`;
export const splitLast = (input: string, separateur: string) => input.split(separateur).reverse()[0];
