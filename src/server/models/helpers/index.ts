/**
 * Index Models Helpers
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { koaContext } from "../../types";
import { relationInfos } from "./relationInfos";
export { idColumnName } from "./idColumnName";
export { createInsertValues } from "./createInsertValues";
export { createUpdateValues } from "./createUpdateValues";
export { formatColumnValue } from "./formatColumnValue";
export { relationInfos } from "./relationInfos";
export { singular } from "./singular";
export { createBlankEntity } from "./createBlankEntity";

export const expand = (ctx: koaContext, entityName: string, entityRelation: string) => relationInfos(ctx, entityName, entityRelation).expand;
export const link = (ctx: koaContext, entityName: string, entityRelation: string) => relationInfos(ctx, entityName, entityRelation).link;

