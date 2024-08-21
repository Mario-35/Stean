/**
 * writeLogToDb
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- writeLogToDb -----------------------------------!");

import { addDoubleQuotes, hidePassword, isTest } from "../helpers";
import { executeSqlValues } from "../db/helpers";
import { models } from "../models";
import { log } from ".";
import { createInsertValues } from "../models/helpers";
import { keyobj, koaContext } from "../types";
import { _ID } from "../db/constants";

export const writeLogToDb = async ( ctx: koaContext, ...error: any[] ): Promise<void> => {
  console.log(log.whereIam());
  if (ctx.log && ctx.log.method != "GET") {
    ctx.log.code = error && error["code" as keyobj] ? +error["code" as keyobj] : +ctx.response.status;
    ctx.log.error = error;
    ctx.log.datas = hidePassword(ctx.log.datas);

    try {
      if (ctx.body && typeof ctx.body === "string") ctx.log.returnid = JSON.parse(ctx.body)[_ID];       
    } catch (error) {
      ctx.log.returnid = undefined;
    }

    const code = Math.floor(ctx.log.code / 100);
    if (code == 2 || code == 3 )return;
    
    await executeSqlValues(ctx.config, `INSERT INTO ${addDoubleQuotes(models.DBFull(ctx.config).Logs.table)} ${createInsertValues(ctx.config, ctx.log, models.DBFull(ctx.config).Logs.name)} returning id`).then((res: object) =>{
      if (!isTest()) console.log(log.url(`${ctx.decodedUrl.root}/Logs(${res[0 as keyobj]})`));      
    }).catch((error) => {
      console.log(error);
    });
  }
};


