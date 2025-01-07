/**
 * writeLogToDb
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { doubleQuotesString, hidePassword } from "../helpers";
import { models } from "../models";
import { log } from ".";
import { createInsertValues } from "../models/helpers";
import { keyobj, koaContext } from "../types";
import { config } from "../configuration";
import { EConstant } from "../enums";
export const writeLogToDb = async ( ctx: koaContext, ...error: any[] ): Promise<void> => {
  console.log(log.whereIam());
  if (!(ctx.odata && ctx.odata.replay) === true && ctx.log && ctx.log.method != "GET") {
    ctx.log.code = error && error["code" as keyobj] ? +error["code" as keyobj] : +ctx.response.status;
    ctx.log.error = error;
    ctx.log.datas = ctx.body;
    ctx.log.datas = hidePassword(ctx.log.datas);
    try {
      if (ctx.body && typeof ctx.body === "string") ctx.log.returnid = JSON.parse(ctx.body)[EConstant.id];       
    } catch (error) {
      ctx.log.returnid = undefined;
    }
    await config.connection(ctx.service.name).unsafe(`INSERT INTO ${doubleQuotesString(models.DBFull(ctx.service).Logs.table)} ${createInsertValues(ctx, ctx.log, models.DBFull(ctx.service).Logs.name)} returning id`).then((res: object) => {                            
      }).catch((err: Error) => {
        process.stdout.write( err + "\n");
      });    
  }
};

