/**
 * addToService
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { doubleQuotesString, asyncForEach } from "../../helpers";
import { log } from "../../log";
import { models } from "../../models";
import { LORA } from "../../models/entities";
import { createInsertValues } from "../../models/helpers";
import { blankRootPgVisitor } from "../../odata/visitor/helper";
import { Ilog, koaContext } from "../../types";
import { apiAccess } from "../dataAccess";
import { executeSqlValues } from "./executeSqlValues";
export const addToService = async (ctx: koaContext, dataInput: Record<string, any>): Promise<Record<string, any>> => {
  console.log(log.whereIam());
  const results = {};    
  const temp = blankRootPgVisitor(ctx, LORA);
  if (temp) {
    ctx.odata = temp;
    const objectAccess = new apiAccess(ctx);
    await asyncForEach(dataInput["value"],  async (line: Record<string, any>) => {
      if (line["payload"] != "000000000000000000")  
      try {
        const datas = line["value"] 
        ? { "timestamp": line["phenomenonTime"], "value": line["value"], "deveui": line["deveui"].toUpperCase() }
        : { "timestamp": line["phenomenonTime"], "frame": line["payload"].toUpperCase(), "deveui": line["deveui"].toUpperCase() };
        await objectAccess.post(datas);  
      } catch (error: any) {
        const datas: Ilog = {
          method: "PAYLOADS",
          code: error["code"] ? +error["code"] : +ctx.response.status,
          url: "/Loras",
          database: ctx.service.pg.database,
          datas: line,
          user_id: String(ctx.user.id),
          error: error
        } ;
        await executeSqlValues(ctx.service, `INSERT INTO ${doubleQuotesString(models.DBFull(ctx.service).Logs.table)} ${createInsertValues(ctx, datas, models.DBFull(ctx.service).Logs.name)} returning id`);
      }
    });
  }
  return results;
}