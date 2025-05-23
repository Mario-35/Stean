/**
 * docRoute connection page.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { returnFormats } from "../../helpers";
import { koaContext } from "../../types";
import { Documentation } from "../../views";

/**
 * Generate admin page
 *
 * @param ctx koa context
 * @param message optional mussage
 */
export const docRoute = async (ctx: koaContext, message?: string) => {
    ctx.set("script-src", "self");
    ctx.set("Content-Security-Policy", "self");
    ctx.type = returnFormats.html.type;
    ctx.body = new Documentation(ctx, { url: "" }).toString();
};
