/**
 * postgresAdmin connection page.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import postgres from "postgres";
import { koaContext } from "../../types";
import { adminRoute, formatConfig } from ".";
import { config } from "../../configuration";
import { encrypt } from "../../helpers";

export async function postgresAdmin(ctx: koaContext): Promise<string | undefined> {
    // valid connection ?
    if (ctx.request.body && ctx.request.body["_connection" as keyof object]) {
        // Adding service
        if (ctx.request.body && ctx.request.body["_action" as keyof object] && ctx.request.body["_action" as keyof object] === "addService") {
            const src = JSON.parse(JSON.stringify(ctx.request.body["jsonDatas" as keyof object], null, 2));
            await config.addConfig(JSON.parse(src));
        } else return ctx.request.body["_connection" as keyof object];
    }
    // connection not found so ...
    const src = JSON.parse(JSON.stringify(ctx.request.body, null, 2));
    function missingItems(src: any, search: string[]): Record<string, string> | undefined {
        const mess: Record<string, string> = {};
        search.forEach((e) => {
            if (!src.hasOwnProperty(e)) mess[e] = `${e} not define`;
        });
        return Object.keys(mess).length > 0 ? mess : undefined;
    }
    if (!missingItems(src, ["optName", "optVersion", "optPassword", "optRepeat", "jsonDatas"])) {
        if (await config.addConfig(JSON.parse(src["jsonDatas"]))) ctx.redirect(`${ctx.request.origin}/admin`);
    }
    if (missingItems(src, ["host", "adminname", "port", "adminpassword"])) return;
    return await postgres(`postgres://${src["adminname"]}:${src["adminpassword"]}@${src["host"]}:${src["port"]}/postgres`, {})`select 1+1 AS result`
        .then(async () => {
            if (config.configFileExist() === false) if (await config.initConfig(JSON.stringify({ "admin": formatConfig(src, true) }, null, 2))) await adminRoute(ctx);
            return encrypt(JSON.stringify({ login: true, "host": src["host"], "adminname": src["adminname"], "port": src["port"], "adminpassword": src["adminpassword"] }));
        })
        .catch((error) => {
            return `[error]${error.message}`;
        });
}
