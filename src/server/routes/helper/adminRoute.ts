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
import { Admin } from "../../views";

export const adminRoute = async (ctx: koaContext, message?: string) => {
    ctx.set("script-src", "self");
    ctx.set("Content-Security-Policy", "self");
    ctx.type = returnFormats.html.type;
    ctx.body = new Admin(ctx, { connection: await postgresAdmin(ctx), url: ctx.request.url, body: ctx.request.body, why: {}, message: message }).toString();
};
