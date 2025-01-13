/**
 * Services entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { IreturnResult, koaContext } from "../../types";
import { config } from "../../configuration";
import { hideKeysInJson, hidePassword } from "../../helpers";
import { createService } from "../helpers";
import { userAuthenticated } from "../../authentication";
import { log } from "../../log";
import { EExtensions, EHttpCode } from "../../enums";

export class Services extends Common {
    constructor(ctx: koaContext) {
        console.log(log.whereIam());
        super(ctx);
    }

    // Override Get All serwices
    async getAll(): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        let can = userAuthenticated(this.ctx);
        if (can) {
            can = this.ctx.user.PDCUAS[4] === true;
            if (this.ctx.user.PDCUAS[5] === true) can = true;
        }
        // Return result If not authorised
        if (!can)
            return this.formatReturnResult({
                body: hidePassword(config.getService(this.ctx.service.name))
            });
        // Return result
        return this.formatReturnResult({
            body: hidePassword(
                config.getServicesNames().map((elem: string) => ({
                    [elem]: { ...config.getService(elem) }
                }))
            )
        });
    }

    // Override Get One serwice
    async getSingle(): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        // Return result If not authorised
        if (!userAuthenticated(this.ctx)) this.ctx.throw(EHttpCode.Unauthorized);
        // Return result
        return this.formatReturnResult({
            body: hideKeysInJson(config.getService(typeof this.ctx.odata.id === "string" ? this.ctx.odata.id : this.ctx.service.name), ["entities"])
        });
    }

    // Override Post service
    async post(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        if (!this.ctx.service.extensions.includes(EExtensions.users)) this.ctx.throw(EHttpCode.Unauthorized);
        if (dataInput && dataInput["create"] && dataInput["create"]["name"]) {
            return this.formatReturnResult({
                body: await createService(this.ctx, dataInput)
            });
        }
        if (!userAuthenticated(this.ctx)) this.ctx.throw(EHttpCode.Unauthorized);
        if (dataInput) {
            const added = await config.addConfig(dataInput);
            if (added)
                return this.formatReturnResult({
                    body: hidePassword(added)
                });
        }
    }

    // Override Update service
    async update(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        // This function not exists
        return;
    }

    // Override Delete service
    async delete(idInput: bigint | string): Promise<IreturnResult | undefined> {
        console.log(log.whereIam(idInput));
        // This function not exists
        return;
    }
}
