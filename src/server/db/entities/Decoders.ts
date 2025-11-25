/**
 * Decoders entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IreturnResult, koaContext } from "../../types";
import { Common } from "./common";
import { asyncForEach } from "../../helpers";
import { decodingPayload } from "../../lora";
import { logging } from "../../log";
import { executeSql } from "../helpers";
import { _DEBUG } from "../../constants";
import { queries } from "../queries";

/**
 * Decoders Class
 */

export class Decoders extends Common {
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }
    // Override get all decoders to be able to search by deveui instead of id only
    async getAll(): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        // test all decoder with the payload
        if (this.ctx._.odata.payload) {
            const result: Record<string, any> = {};
            const decoders = await executeSql(this.ctx._.service, queries.getDecoder());
            await asyncForEach(Object(decoders), async (decoder: Record<string, any>) => {
                if (this.ctx._.odata.payload) {
                    const temp = decodingPayload({ name: decoder["name"], code: String(decoder["code"]), nomenclature: decoder["nomenclature"] }, this.ctx._.odata.payload);
                    result[decoder["id"]] = temp;
                }
            });
            return this.formatReturnResult({ body: result });
        } else return await super.getAll();
    }

    // Override get one decoders to be able to search by deveui instead of id only
    async getSingle(): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        if (this.ctx._.odata.payload) {
            const decoder: Record<string, any> = await executeSql(this.ctx._.service, queries.getDecoder(`id = ${this.ctx._.odata.id}`));
            return decoder[0]
                ? this.formatReturnResult({
                      body: decodingPayload({ name: decoder[0]["name"], code: String(decoder[0]["code"]), nomenclature: decoder[0]["nomenclature"] }, this.ctx._.odata.payload)
                  })
                : undefined;
        } else return await super.getSingle();
    }
}
