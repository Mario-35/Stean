/**
 * Index Models Helpers
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EQuery } from "../../enums";
import { doubleQuotes } from "../../helpers";
import { IentityColumnAliasOptions, Iservice } from "../../types";
import { relationInfos } from "./relationInfos";
export { idColumnName } from "./idColumnName";
export { createInsertValues } from "./createInsertValues";
export { createUpdateValues } from "./createUpdateValues";
export { formatColumnValue } from "./formatColumnValue";
export { relationInfos } from "./relationInfos";
export { singular } from "./singular";
export { createBlankEntity } from "./createBlankEntity";
export const expand = (service: Iservice, entityName: string, entityRelation: string) => relationInfos(service, entityName, entityRelation).expand;
export const link = (service: Iservice, entityName: string, entityRelation: string) => relationInfos(service, entityName, entityRelation).link;
export const as = (options: IentityColumnAliasOptions) => (options.context?.target === EQuery.Select ? ` AS ${doubleQuotes(options.columnName)}` : "");
