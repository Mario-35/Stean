/**
 * Logs entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { Id, IreturnResult, koaContext } from "../../types";
import { config } from "../../configuration";
import { logging } from "../../log";
import { EConstant, EHttpCode } from "../../enums";
import { returnFormats } from "../../helpers";
import { _DEBUG } from "../../constants";

export class Logs extends Common {
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }

    // Override Get All logs
    async getAll(): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        // create query
        this.ctx._.odata.query.where.add(`"url" LIKE '%${this.ctx._.service.name}%'`);
        let sql = this.ctx._.odata.getSql();
        // Return results
        if (sql)
            return await config.trace.getValues(sql).then(async (res: Record<string, any>) => {
                return res[0] > 0
                    ? this.formatReturnResult({
                          [EConstant.count]: this.ctx._.odata.returnFormat === returnFormats.dataArray ? +Object.entries(res[1][0]["dataArray"]).length : +res[0],
                          [EConstant.nextLink]: this.nextLink(res[0]),
                          [EConstant.prevLink]: this.prevLink(res[0]),
                          value: res[1]
                      })
                    : this.formatReturnResult({ body: res[0] == 0 ? [] : res[0] });
            });
    }

    // Override Get one logs
    async getSingle(): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        // create query
        this.ctx._.odata.query.where.add(` AND url LIKE '%${this.ctx._.service.name}%'`);
        const sql = this.ctx._.odata.getSql();
        // Return results
        if (sql)
            return await config.trace
                .getValues(sql)
                .then((res: Record<string, any>) => {
                    if (this.ctx._.odata.query.select && this.ctx._.odata.onlyValue === true) {
                        const temp = res[this.ctx._.odata.query.select[0 as keyof object] == "id" ? EConstant.id : 0];
                        if (typeof temp === "object") {
                            this.ctx._.odata.returnFormat = returnFormats.json;
                            return this.formatReturnResult({ body: temp });
                        } else return this.formatReturnResult({ body: String(temp) });
                    }
                    return this.formatReturnResult({
                        body: this.ctx._.odata.single === true ? res[1][0] : { value: res[1] }
                    });
                })
                .catch((err: Error) => this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: err }));
    }

    // Override Post service
    async post(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest });
    }

    // Override Update service
    async update(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest });
    }

    // Override Delete service
    async delete(idInput: Id | string): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest });
    }
}
