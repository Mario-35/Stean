/**
 * Main Helpers.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Main Helpers -----------------------------------!");

import { koaContext } from "../types";
export const addDoubleQuotes = (input: string | undefined): string => input ? addQuotes(input, '"') : "";
export const removeDoubleQuotes = (input: string) => removeFirstAndEnd(input, '"');
export const removeSimpleQuotes = (input: string) => removeFirstAndEnd(input, "'");
export const addSimpleQuotes = (input: string): string => addQuotes(input, "'");
export const getUserId = (ctx: koaContext): number => ctx.state.user && ctx.state.user.id ? ctx.state.user.id : -1;
export const removeAllQuotes = (input: string): string => input.replace(/['"]+/g, "");
export const unikeList = (input: string[]) => [...new Set(input)];
export  * from "./tests";
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
export { getKey } from "./getKey";
export { createTunnel } from "./tunnel";

const removeFirstOrEnd = (input: string, char: string) => {    
    while (input[0] === char[0]) input = input.slice(1).trim();
    while (input[input.length - 1] === char[0]) input = input.slice(0, -1);
    return input;
}
const removeFirstAndEnd = (input: string, char: string) => input[0] === char && input[input.length - 1] === char[0] ? input.slice(0, -1).slice(1).trim() : input;
const addQuotes = (input: string, Quotes: string): string => { input = removeFirstOrEnd(input,Quotes) ; return `${input[0] !== Quotes ? Quotes : ''}${input}${input[input.length - 1] !== Quotes ? Quotes : ''}`};
