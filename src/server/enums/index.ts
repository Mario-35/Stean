/**
 * Index Enums
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Index Enums -----------------------------------!\n");

import { EExtensions } from "./extensions";
import { EOptions } from "./options";

export { EChar } from "./chars";
export { ETable } from "./table";
export { EColor } from "./colors";
export { EColumnType } from "./colType";
export { EDatesType } from "./datesType";
export { EFileName } from "./fileName";
export { EFrom } from "./from";
export { allEntities, allEntitiesType, filterEntities } from "./entities";
export { EExtensions } from "./extensions";
export { EHttpCode } from "./httpCode";
export { EReturnFormats } from "./resultFormats";
export { EVersion } from "./version";
export { EObservationType } from "./observationType";
export { EOperation } from "./operation";
export { ERelations } from "./relations";
export { EOptions } from "./options";
export { EUpdate } from "./update";
export { EQuery } from "./query";
export { EUserRights } from "./userRights";
export const enumKeys = (input: any) => Object.keys(input).filter(prop => isNaN(parseInt(prop)));
export const typeExtensions = Object.keys(EExtensions) as Array<keyof typeof EExtensions>;
export const typeOptions = Object.keys(EOptions) as Array<keyof typeof EOptions>;
