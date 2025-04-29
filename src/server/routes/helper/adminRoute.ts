/**
 * adminRoute connection page.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { postgresAdmin } from ".";
import { returnFormats } from "../../helpers";
import { koaContext } from "../../types";
import { Admin, HtmlError } from "../../views";

/**
 * Generate admin page
 *
 * @param ctx koa context
 * @param message optional mussage
 */
export const adminRoute = async (ctx: koaContext, message?: string) => {
    ctx.set("script-src", "self");
    ctx.set("Content-Security-Policy", "self");
    ctx.type = returnFormats.html.type;
    const connection = await postgresAdmin(ctx);
    if (connection?.startsWith("[error]")) ctx.body = new HtmlError(ctx, { message: connection.replace("[error]", ""), url: ctx.path }).toString();
    else ctx.body = new Admin(ctx, { connection: connection, url: ctx.request.url, body: ctx.request.body, why: {}, message: message }).toString();
};
