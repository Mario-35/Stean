/**
 * Index Models Helpers
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Index Models Helpers -----------------------------------!");

import { koaContext } from "../../types";
import { relationInfos } from "./relationInfos";

export { idColumnName } from "./idColumnName";
export { createInsertValues } from "./createInsertValues";
export { createUpdateValues } from "./createUpdateValues";
export { formatColumnValue } from "./formatColumnValue";
export { getModelVersion } from "./getModelVersion";
export { relationInfos } from "./relationInfos";
export const expand = (ctx: koaContext, entityName: string, entityRelation: string) => relationInfos(ctx.config, entityName, entityRelation).expand;
export const link = (ctx: koaContext, entityName: string, entityRelation: string) => relationInfos(ctx.config, entityName, entityRelation).link;
