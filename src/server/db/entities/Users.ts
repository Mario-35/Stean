/**
 * Users entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { koaContext } from "../../types";
import { Common } from "./common";
import { IreturnResult } from "../../types";
import { config } from "../../configuration";
import { hidePassword } from "../../helpers";
import { EConstant, EErrors, EHttpCode, EUserRights } from "../../enums";
import { models } from "../../models";
import { logging } from "../../log";
import { USER } from "../../models/entities";
import { executeSqlValues } from "../helpers";

export class Users extends Common {
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }

    // Override get all to return all users only if rights are good
    async getAll(): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        if (this.ctx._.user?.PDCUAS[EUserRights.SuperAdmin] === true || this.ctx._.user?.PDCUAS[EUserRights.Admin] === true) {
            const temp = await executeSqlValues(config.getService(EConstant.admin), `SELECT ${models.entityColumnListForSelect(this.ctx._.model(), USER, true)} FROM "${USER.table}" ORDER BY "id"`);
            return this.formatReturnResult({
                body: hidePassword(temp)
            });
        } else this.ctx.throw(EHttpCode.Unauthorized, { code: EHttpCode.Unauthorized, detail: EErrors.Unauthorized });
    }

    // Override to creste a new config and load it
    async post(dataInput: object | undefined): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        if (dataInput)
            return this.formatReturnResult({
                body: await config.addConfig(dataInput)
            });
    }
}
