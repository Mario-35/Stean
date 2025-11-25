/**
 * tests Is
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { EConstant, EExtensions, EUserRights } from "../enums";
import { PgVisitor, RootPgVisitor } from "../odata/visitor";
import { Ientity, Iservice, koaContext } from "../types";
import { returnFormats } from "./returnFormats";
export const isTestEntity = (input: Ientity | string, test: string) => (typeof input === "string" ? input === test : input.name === test);
export const isTest = () => process.env.NODE_ENV?.trim() === EConstant.test || false;
export const isProduction = () => process.env.NODE_ENV?.trim() === "production" || false;
export const isReturnCsv = (input: RootPgVisitor | PgVisitor) => (input.returnFormat === returnFormats.csv ? true : undefined);
export const isReturnDataArray = (input: RootPgVisitor | PgVisitor) => (input.returnFormat === returnFormats.dataArray ? true : undefined);
export const isReturnGraph = (input: RootPgVisitor | PgVisitor) => ([returnFormats.graph, returnFormats.graphDatas].includes(input.returnFormat) ? true : undefined);
export const isReturnGeoJson = (inputE: Ientity | string, input: RootPgVisitor | PgVisitor) =>
    (typeof inputE === "string" ? ["Locations", "FeaturesOfInterest"].includes(inputE) : ["Locations", "FeaturesOfInterest"].includes(inputE.name)) && input.returnFormat === returnFormats.GeoJSON
        ? true
        : undefined;
export const isObservation = (input: RootPgVisitor | PgVisitor): boolean =>
    (input.entity && isTestEntity(input.entity, "Observations")) || (input.parentEntity && isTestEntity(input.parentEntity, "Observations")) ? true : false;
export const isAdmin = (service: Iservice): boolean => service && service.name === EConstant.admin;
export const isAllowedTo = (ctx: koaContext, what: EUserRights): boolean => (ctx._.service.extensions.includes(EExtensions.users) ? ctx._.user && ctx._.user.PDCUAS[what] === true : true);
export const isLog = (input: RootPgVisitor | PgVisitor): boolean => (input.entity && isTestEntity(input.entity, "Logs") ? true : false);

export function isString(obj: any) {
    return typeof obj === "string";
}

export function isBoolean(obj: any) {
    return typeof obj === "boolean";
}

export function isNumber(obj: any) {
    return typeof obj === "number";
}

export function isIntegerNumber(obj: any) {
    return typeof obj === "number" && Number.isInteger(obj);
}

export function isObject(obj: any) {
    return obj != null && typeof obj === "object" && !(obj instanceof Array);
}

export function isArray(obj: any) {
    return obj instanceof Array;
}
