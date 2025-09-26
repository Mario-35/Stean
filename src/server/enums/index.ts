/**
 * Index Enums
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EOptions } from "./options";
export { EChar } from "./chars";
export { EentityType } from "./entityType";
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
export const enumKeys = (input: any) => Object.keys(input).filter((prop) => isNaN(parseInt(prop)));
export const typeOptions = Object.keys(EOptions) as Array<keyof typeof EOptions>;
