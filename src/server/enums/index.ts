/**
 * Index Enums
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EExtensions } from "./extensions";
import { EOptions } from "./options";
export { EChar } from "./chars";
export { ETable } from "./table";
export { EColor } from "./colors";
export { EConstant } from "./constant";
export { EColumnType } from "./colType";
export { EDatesType } from "./datesType";
export { EDataType } from "./dataType";
export { EFrom } from "./from";
export { allEntities, allEntitiesType, filterEntities } from "./entities";
export { EExtensions } from "./extensions";
export { EHttpCode } from "./httpCode";
export { EReturnFormats } from "./resultFormats";
export { EObservationType } from "./observationType";
export { EOperation } from "./operation";
export { EEncodingType } from "./encodingType";
export { ERelations } from "./relations";
export { EOptions } from "./options";
export { EQuery } from "./query";
export { EUserRights } from "./userRights";
export const color = (col: number) => `\x1b[${col}m`;
export const enumKeys = (input: any) => Object.keys(input).filter((prop) => isNaN(parseInt(prop)));
export const typeExtensions = Object.keys(EExtensions) as Array<keyof typeof EExtensions>;
export const typeOptions = Object.keys(EOptions) as Array<keyof typeof EOptions>;
