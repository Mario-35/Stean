/**
 * Index Types
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Index Types -----------------------------------!");

import Koa from "koa";
import { allEntitiesType, EExtensions, EOptions } from "../enums";
import { Ientity } from "./entity";

export { IrelationInfos } from "./relationInfos";
export { Icomon } from "./comon";
export { Iservice } from "./service";
export { IcsvColumn } from "./csvColumn";
export { IcsvFile } from "./csvFile";
export { IcsvImport } from "./csvImport";
export { IdbConnection } from "./dbConnection";
export { IentityCore, Ientity } from "./entity";
export { IentityColumn } from "./entityColumn";
export { IentityRelation } from "./entityRelation";
export { Ilog } from "./log";
export { ILoraDecodingResult } from "./loraDecodingResult";
export { IodataContext } from "./odataContext";
export { IpgQuery } from "./pgQuery";
export { IqueryOptions } from "./queryOptions";
export { IreturnFormat } from "./returnFormat";
export { IreturnResult } from "./returnResult";
export { IserviceInfos } from "./serviceLink";
export { IstreamInfos } from "./streamInfos";
export { Iuser } from "./user";
export { IuserToken } from "./userToken";
export { IdecodedUrl } from "./decodedUrl";
export { IforwardConnection } from "./forwardConnection";
export { IvisitRessource } from "./visitRessource";
export interface IKeyBoolean { [key: string]: boolean; }
export interface IKeyString { [key: string]: string; }
export type Ientities = { [key in allEntitiesType as string]: Ientity }
export type koaContext = Koa.ParameterizedContext<Koa.DefaultState,  Koa.DefaultContext>
export const typeOptions = Object.keys(EOptions) as Array<keyof typeof EOptions>;
export const typeExtensions= Object.keys(EExtensions) as Array<keyof typeof EExtensions>;
export type keyobj = keyof object;