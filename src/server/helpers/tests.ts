/**
 * tests Is
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- tests Is -----------------------------------!");

import { ADMIN } from "../constants";
import { EExtensions, EUserRights } from "../enums";
import { PgVisitor, RootPgVisitor } from "../odata/visitor";
import { Ientity, koaContext } from "../types";
import { returnFormats } from "./returnFormats";

export const isTest = () => process.env.NODE_ENV?.trim() === "test" || false;
export const isProduction = () => process.env.NODE_ENV?.trim() === "production" || false;
export const isCsvOrArray = (input: RootPgVisitor |PgVisitor) => [returnFormats.dataArray, returnFormats.csv].includes(input.returnFormat) ? true : undefined;
export const isGraph = (input: RootPgVisitor |PgVisitor) => [returnFormats.graph, returnFormats.graphDatas].includes(input.returnFormat) ? true : undefined;
export const isObservation = (input: Ientity | string) => typeof input === "string" ? input === "Observations": input.name === "Observations";
export const isAdmin = (ctx: koaContext): boolean => ctx.config && ctx.config.name === ADMIN;
export const isAllowedTo = (ctx: koaContext, what: EUserRights): boolean => ctx.config.extensions.includes(EExtensions.users) ? true : ctx.user && ctx.user.PDCUAS[what];

export function isString(obj: any) {
    return (typeof obj) === 'string';
 }
 
 export function isBoolean(obj: any) {
    return (typeof obj) === 'boolean';
 }
 
 export function isNumber(obj: any) {
    return (typeof obj) === 'number';
 }
 
 export function isIntegerNumber(obj: any) {
    return (typeof obj) === 'number' && Number.isInteger(obj);
 }
 
 export function isObject(obj: any) {
    return obj != null && (typeof obj) === 'object' && !(obj instanceof Array);
 }
 
 export function isArray(obj: any) {
    return (obj instanceof Array);
 }