/**
 * Decoders entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IreturnResult, koaContext } from "../../types";
import { Common } from "./common";
import { doubleQuotes, asyncForEach } from "../../helpers";
import { decodingPayload } from "../../lora";
import { executeSql, executeSqlValues } from "../helpers";
import { log } from "../../log";
export class Decoders extends Common {
  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    super(ctx);
  }
  // Override get all decoders to be able to search by deveui instead of id only
  async getAll(): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    if (this.ctx.odata.payload) {
      const result:Record<string, any>  = {};
      const decoders = await executeSql(this.ctx.service, `SELECT "id", "name", "code", "nomenclature", "synonym" FROM ${doubleQuotes(this.ctx.model.Decoders.table)}`);
      await asyncForEach(
        // Start connectionsening ALL entries in config file
        Object(decoders),
        async (decoder: Record<string, any> ) => {          
          if (this.ctx.odata.payload) {
            const temp = decodingPayload( { name: decoder["name"], code: String(decoder["code"]), nomenclature: decoder["nomenclature"], }, this.ctx.odata.payload );
            result[decoder["id"]] = temp;
          }
        }
      );
      return this.formatReturnResult({ body: result });
    } else return await super.getAll();
  }
  // Override get one decoders to be able to search by deveui instead of id only
  async getSingle(): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    if (this.ctx.odata.payload) {
      const decoder: Record<string, any>  = await executeSqlValues(this.ctx.service, `SELECT "id", "name", "code", "nomenclature", "synonym" FROM "${this.ctx.model.Decoders.table}" WHERE id = ${this.ctx.odata.id}`);
      return decoder[0]
        ? this.formatReturnResult({
          body: decodingPayload( { name: decoder[0]["name"],
          code: String(decoder[0]["code"]), 
          nomenclature: decoder[0]["nomenclature"], },
            this.ctx.odata.payload
            ),
          })
        : undefined;
    } else return await super.getSingle();
  }
}
