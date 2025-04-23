/**
 * Trace class
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { _DEBUG } from "../constants";
import { isTest, logToHtml, notNull } from "../helpers";
import { koaContext } from "../types";
import postgres from "postgres";
import { log } from ".";
import { paths } from "../paths";
import { EConstant } from "../enums";
import { FORMAT_JSONB } from "../db/constants";

/**
 * Class to trace requests
 */

export class Trace {
    static adminConnection: postgres.Sql<Record<string, unknown>>;

    constructor(adminConnection: postgres.Sql<Record<string, unknown>>) {
        Trace.adminConnection = adminConnection;
    }

    private query(ctx: koaContext, error?: any[]) {
        return ctx.traceId && error ? `UPDATE log SET error = ${FORMAT_JSONB(error)} WHERE id = ${ctx.traceId}` : `INSERT INTO log (method, url${notNull(ctx.body) ? ", datas" : ""}${notNull(error) ? ", error" : ""}) VALUES('${ctx.method}', '${ctx.request.url}'${notNull(ctx.body) ? `,${FORMAT_JSONB(ctx.body)}` : ""}${notNull(error) ? `,${FORMAT_JSONB(error)}` : ""}) RETURNING id;`;
    }

    /**
     * Add to trace
     *
     * @param ctx koa context
     */
    async write(ctx: koaContext) {
        if (ctx.method !== "GET") {
            const datas = this.query(ctx);
            await Trace.adminConnection
                .unsafe(datas)
                .then((res) => {
                    ctx.traceId = BigInt(res[0].id);
                })
                .catch(async (error) => {
                    if (error.code === "42P01") {
                        await Trace.adminConnection.unsafe(`CREATE TABLE public.log ( id int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE ) NOT NULL, "date" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, "method" text NULL, url text NULL, datas jsonb NULL, CONSTRAINT log_pkey PRIMARY KEY (id) ); CREATE INDEX log_id ON public.log USING btree (id); `).catch((err) => process.stdout.write(err + EConstant.return));
                        Trace.adminConnection.unsafe(datas);
                    } else process.stdout.write(error + EConstant.return);
                });
        }
    }

    /**
     * Trace error
     *
     * @param ctx koa context
     */
    async error(ctx: koaContext, error: any) {
        try {
            await Trace.adminConnection.unsafe(this.query(ctx, error));
        } catch (err) {
            console.log(err);
        }
    }

    async get(query: string): Promise<object> {
        return new Promise(async function (resolve, reject) {
            await Trace.adminConnection
                .unsafe(query)
                .values()
                .then((res: Record<string, any>) => {
                    resolve(res[0]);
                })
                .catch((err: Error) => {
                    if (!isTest() && +err["code" as keyof object] === 23505) {
                        const input = log.queryError(query, err);
                        process.stdout.write(input + EConstant.return);
                        paths.logFile.writeStream(logToHtml(input));
                    }
                    reject(err);
                });
        });
    }
}
