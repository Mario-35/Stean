/**
 * Main Helpers.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
*/
import { koaContext } from "../types";
const removeFirstAndEnd = (input: string, char: string) => input[0] === char && input[input.length - 1] === char[0] ? input.slice(0, -1).slice(1).trim() : input;
export const getUserId = (ctx: koaContext): number => ctx.state.user && ctx.state.user.id ? ctx.state.user.id : -1;
export const unikeList = (input: string[]) => [...new Set(input)];
export { isTest, isProduction, isDataArray, isCsv, isGraph, isObservation, isGeoJson, isAdmin,  isAllowedTo, isString , isBoolean , isNumber , isIntegerNumber , isObject, isArray } from "./tests";
export { asyncForEach } from "./asyncForEach";
export { cleanStringComma } from "./cleanStringComma";
export { cleanUrl } from "./cleanUrl";
export { containsAll } from "./containsAll";
export { createBearerToken } from "./createBearerToken";
export { deepClone } from "./deepClone";
export { encrypt, decrypt } from "./crypto";
export { getBigIntFromString } from "./getBigIntFromString";
export { getUrlKey } from "./getUrlKey";
export { hideKeysInJson } from "./hideKeysInJson";
export { hidePassword} from "./hidePassword";
export { notNull } from "./notNull";
export { returnFormats } from "./returnFormats";
export { unique } from "./unique";
export { removeEmpty } from "./removeEmpty";
export { upload } from "./upload";
export { logToHtml } from "./logToHtml";
export { Csv } from "./csv";
export const removeAllQuotes = (input: string): string => input.replace(/['"]+/g, "");
export const escapeSimpleQuotes = (input: string) => input.replace(/[']+/g, "''");
export const escapeDoubleQuotes = (input: string) => input.replace(/["]+/g, '\\"');
export const trimSimpleQuotes = (input: string) => input.replace(/^'+/, '').replace(/'+$/, '');
export const trimDoubleQuotes = (input: string) => input.replace(/^"+/, '').replace(/"+$/, '');
export const removeFirstEndDoubleQuotes = (input: string) => removeFirstAndEnd(input, '"');
export const removeFirstEndSimpleQuotes = (input: string) => removeFirstAndEnd(input, "'");
export const trimAllQuotes = (input: string) => trimDoubleQuotes(trimSimpleQuotes(input));
export const formatPgString = (input: string): string => escapeSimpleQuotes(trimAllQuotes(input));
export const doubleQuotesString = (input: string): string => `"${escapeDoubleQuotes(trimDoubleQuotes(input))}"`;
export const simpleQuotesString = (input: string): string => `'${escapeSimpleQuotes(trimSimpleQuotes(input))}'`;
export const formatPgTableColumn = (table: string, column?: string) => `\"${table}\"${column ? `.\"${column}\"`:''}`;
export const formatPgSelectTableColumn = (table: string, column?: string) => `SELECT ${column === "*" ? '*' : formatPgTableColumn(table, column)} FROM \"${table}\"`;
