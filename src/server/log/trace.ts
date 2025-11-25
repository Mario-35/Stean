/**
 * Trace class
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { _DEBUG } from "../constants";
import { isTest, notNull, simpleQuotes } from "../helpers";
import { koaContext } from "../types";
import postgres from "postgres";
import { logging } from ".";
import { EConstant, EEncodingType, EErrors } from "../enums";
import { FORMAT_JSONB } from "../db/constants";

/**
 * Class to trace requests
 */

export class Trace {
    static adminConnection: postgres.Sql<Record<string, unknown>>;

    constructor(adminConnection: postgres.Sql<Record<string, unknown>>) {
        console.log(logging.whereIam(new Error().stack));
        Trace.adminConnection = adminConnection;
    }

    private query(ctx: koaContext, error?: any[]) {
        return ctx.traceId && error
            ? `UPDATE public.log SET error = ${FORMAT_JSONB(error)} WHERE id = ${ctx.traceId}`
            : `INSERT INTO public.log (method, url${notNull(ctx.body) ? ", datas" : ""}${notNull(error) ? ", error" : ""}) VALUES('${ctx.method}', '${ctx.request.url}'${
                  notNull(ctx.body) ? `,${simpleQuotes(JSON.stringify(ctx.body))}` : ""
              }${notNull(error) ? `,${FORMAT_JSONB(error)}` : ""}) RETURNING id;`;
    }

    async createTable(datas?: string) {
        await Trace.adminConnection
        .unsafe(`CREATE TABLE public.log 
            ( id int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE ) NOT NULL, 
            "date" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, 
            "method" text NULL, 
            url text NULL, 
            datas jsonb NULL, 
            error jsonb NULL, 
            CONSTRAINT log_pkey PRIMARY KEY (id) ); 
            CREATE INDEX log_id ON public.log USING btree (id);`
        )
        .catch((err) => process.stdout.write(err + EConstant.return));
        if (datas) await Trace.adminConnection.unsafe(datas);
    }

    /**
     * Add to trace
     *
     * @param ctx koa context
     */
    async write(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        if (ctx.method !== "GET") {
            const datas = this.query(ctx);
            await Trace.adminConnection
                .unsafe(datas)
                .then((res) => {
                    ctx.traceId = BigInt(res[0].id);
                })
                .catch(async (error) => {
                    if (error.code === "42P01") {
                        await this.createTable(datas);
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
        console.log(logging.whereIam(new Error().stack));
        try {
            await Trace.adminConnection.unsafe(this.query(ctx, error));
        } catch (err: any) {
            if (err.code === "42P01") 
                await this.createTable(this.query(ctx, error)).then(() => true);            
            console.log("---- [Error Log Error] -------------");
            console.log(err);
        }
    }

    async get(query: string): Promise<object> {
        return new Promise(async function (resolve, reject) {
            await Trace.adminConnection
                .unsafe(query)
                .then((res: Record<string, any>) => {
                    resolve(res[0]);
                })
                .catch((err: Error) => {
                    if (!isTest() && +err["code" as keyof object] === 23505) {
                        logging.error(EErrors.execQuery, query).toLogAndFile();
                    }
                    reject(err);
                });
        });
    }

    async getValues(query: string): Promise<object> {
        return new Promise(async function (resolve, reject) {
            await Trace.adminConnection
                .unsafe(query)
                .values()
                .then((res: Record<string, any>) => {
                    resolve(res[0]);
                })
                .catch((err: Error) => {
                    if (!isTest() && +err["code" as keyof object] === 23505) {
                        logging.error(EErrors.execQuery, query).toLogAndFile();
                    }
                    reject(err);
                });
        });
    }

    async rePlay(ctx: koaContext): Promise<boolean> {
        console.log(logging.whereIam(new Error().stack));
        await this.get(`SELECT * FROM log WHERE id=${ctx._.id}`).then(async (input: Record<string, any>) => {
            if (["POST", "PUT", "PATCH"].includes(input.method)) {
                try {
                    await fetch(ctx._.origin + input.url + "?$replay=" + ctx._.id, {
                        method: input.method,
                        headers: {
                            "Content-Type": EEncodingType.json
                        },
                        body: JSON.stringify(input.datas)
                    });
                    return true;
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }
        });
        return false;
    }
}
