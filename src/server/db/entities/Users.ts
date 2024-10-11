/**
 * Users entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { keyobj, koaContext } from "../../types";
import { Common } from "./common";
import { IreturnResult } from "../../types";
import { config } from "../../configuration";
import { hidePassword } from "../../helpers";
import { errors } from "../../messages/";
import { EConstant, EHttpCode, EUserRights } from "../../enums";
import { executeSqlValues } from "../helpers";
import { models } from "../../models";
import { log } from "../../log";
export class Users extends Common {
  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    super(ctx);
  }
  // Override get all to return all users only if rights are good
  async getAll(): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    if (this.ctx.user?.PDCUAS[EUserRights.SuperAdmin] === true || this.ctx.user?.PDCUAS[EUserRights.Admin] === true ) {
      const temp = await executeSqlValues(config.getService(EConstant.admin), `SELECT ${models.getSelectColumnList(this.ctx.config, models.DBAdmin(config.getService(EConstant.admin)).Users, true)} FROM "user" ORDER BY "id"`);      
      return this.formatReturnResult({
        body: hidePassword(temp),
      });
    } else this.ctx.throw(EHttpCode.Unauthorized, { code: EHttpCode.Unauthorized, detail: errors[EHttpCode.Unauthorized as keyobj] });
  }
  // Override to creste a new config and load it 
  async post(dataInput: object | undefined): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    if (dataInput)
      return this.formatReturnResult({
        body: await config.addConfig(dataInput),
      });
  }
}
