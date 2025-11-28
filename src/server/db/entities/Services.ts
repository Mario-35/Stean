/**
 * Services entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { Id, IreturnResult, koaContext } from "../../types";
import { config } from "../../configuration";
import { hideKeysInJson, hidePassword } from "../../helpers";
import { createService } from "../helpers";
import { userAuthenticated } from "../../authentication";
import { logging } from "../../log";
import { EErrors, EExtensions, EHttpCode } from "../../enums";
import { _DEBUG } from "../../constants";
import { queries } from "../queries";

export class Services extends Common {
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }

    // Override Get All serwices
    async getAll(): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        let can = userAuthenticated(this.ctx);
        if (can) {
            can = this.ctx._.user.PDCUAS[4] === true;
            if (this.ctx._.user.PDCUAS[5] === true) can = true;
        }
        // Return result If not authorised
        if (!can)
            return this.formatReturnResult({
                body: hidePassword(config.getService(this.ctx._.service.name))
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
        console.log(logging.whereIam(new Error().stack));
        // Return result If not authorised
        if (!userAuthenticated(this.ctx)) this.ctx.throw(EHttpCode.Unauthorized);
        // Return result
        return this.formatReturnResult({
            body: hideKeysInJson(config.getService(typeof this.ctx._.odata.id === "string" ? this.ctx._.odata.id : this.ctx._.service.name), ["entities"])
        });
    }

    // Override Post service
    async post(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        if (!this.ctx._.service.extensions.includes(EExtensions.users)) this.ctx.throw(EHttpCode.Unauthorized);
        if (dataInput && dataInput["create"] && dataInput["create"]["name"]) {
            return this.formatReturnResult({
                body: await createService(dataInput)
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
        console.log(logging.whereIam(new Error().stack));
        // This function not exists
        return;
    }

    // Override Delete service
    async delete(idInput: Id | string): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        if (typeof idInput === "string") {
            const conn = await config.delete(idInput);
            if (conn)
                return this.formatReturnResult({
                    body: await conn
                        .unsafe(queries.deleteConfig(idInput))
                        .values()
                        .then((res: Record<string, any>) => {
                            return res[0];
                        })
                        .catch((err: Error) => {
                            logging.error(err, EErrors.execQuery).toLogAndFile();
                            return;
                        })
                });
        }
    }
}
