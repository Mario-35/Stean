/**
 * Index messages
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Index messages -----------------------------------!");

import { EHttpCode } from "../enums";
import jsonErrors from "./error.json";
import jsonInfos from "./infos.json";

export const msg = (...args: string[]) => { for (let i = 1; i < args.length; i++) args[0] = args[0].replace(`$${i}`, args[i]); return args[0]; };
export const errors =jsonErrors;
export const infos =jsonInfos;
export const getErrorCode = (err: Error | any, actual: number): number => {
    if (err["where"]&& err["where"].includes("verifyid")) return EHttpCode.notFound;
    return actual;
};
 

