/**
 * updateRoute connection page.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { postgresAdmin } from ".";
import { returnFormats } from "../../helpers";
import { koaContext } from "../../types";
import { Update } from "../../views";

export const updateRoute = async (ctx: koaContext) => {
    ctx.set("script-src", "self");
    ctx.set("Content-Security-Policy", "self");
    ctx.type = returnFormats.html.type;
    ctx.body = new Update(ctx, { connection: await postgresAdmin(ctx), url: ctx.request.url, body: ctx.request.body, why: {} }).toString();
};
