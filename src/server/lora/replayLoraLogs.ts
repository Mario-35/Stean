/**
 * replayLoraLogs for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../configuration";
import { apiAccess } from "../db/dataAccess";
import { LOG } from "../models/entities";
import { blankRootPgVisitor } from "../odata/visitor/helper";
import { koaContext } from "../types";

/**
 * 
 * @param ctx koa context
 * @param sql filter query
 */
export const replayLoraLogs = async ( ctx: koaContext, sql: string | undefined ) => {
  const delLog = (id: bigint) => {
    config.connection(ctx.service.name).unsafe(`DELETE FROM "${LOG.table}" WHERE id = ${id}`);
  }

  await config.connection(ctx.service.name).unsafe(`SELECT "@iot.id","datas" FROM (${sql}) as t`).cursor(async (res: object) => {
    const temp = blankRootPgVisitor(ctx, ctx.model.Loras);
    if (temp) {
      ctx.odata = temp;
      ctx.odata.replay = true;
      const objectAccess = new apiAccess(ctx);
      try {
        await objectAccess.post(res[0 as keyof object]["datas"]).then((ok) => {
          delLog(res[0 as keyof object]["@iot.id"]);
        })
      } catch (error: any) {
        process.stdout.write(`[${res[0 as keyof object]["@iot.id"]}] `+ error["detail"] + "\n"); 
        if (error["detail"].includes("already exist")) delLog(res[0 as keyof object]["@iot.id"]);
        else process.stdout.write( res[0 as keyof object]["datas"]+ "\n"); 
      }
    }
  });
  return true;
};
