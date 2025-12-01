/**
 * logsRoute connection page.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { returnFormats } from "../../helpers";
import { koaContext } from "../../types";
import { HtmlLogs } from "../../views/class/logs";

/**
 * 
 * @param ctx koa context
 * @param file file to load
 */
export const logsRoute = async (ctx: koaContext, file: string) => {
    const bodyLogs = new HtmlLogs(ctx, { url: file });
    ctx.type = returnFormats.html.type;
    ctx.body = bodyLogs.toString();
};
