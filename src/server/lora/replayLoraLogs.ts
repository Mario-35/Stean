/**
 * replayLoraLogs for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../configuration";
import { apiAccess } from "../db/dataAccess";
import { EChar } from "../enums";
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
    config.connection(ctx.service.name).unsafe(`DELETE FROM "${LOG.table}" WHERE id = ${id}`).then((e) => {
      process.stdout.write( `replay log ----> ${id}` + EChar.ok + "\n"); 
    });
  }

  await config.connection(ctx.service.name).unsafe(`SELECT "@iot.id","datas" FROM (${sql})`).cursor(async (res: object) => {
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
        if (error["detail"].includes("already exist")) delLog(res[0 as keyof object]["@iot.id"]);
        process.stdout.write( error["detail"] + "\n"); 
      }
    }
  });
  return true;
};