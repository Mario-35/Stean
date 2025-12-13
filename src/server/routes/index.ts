/**
 * Index Routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { decodeToken } from "../authentication";
import { EErrors, EHttpCode } from "../enums";
import { createBearerToken, returnFormats, splitLast } from "../helpers";
import { adminRoute, logsRoute, exportRoute, docRoute, InfosRoute } from "./helper";
import { config } from "../configuration";
export { unProtectedRoutes } from "./unProtected";
export { protectedRoutes } from "./protected";
import querystring from "querystring";
import { koaContext } from "../types";
import { paths } from "../paths";
import { SteanContext } from "../context";
import { logging } from "../log";
import { getState } from "../constants";

export const routerHandle = async (ctx: koaContext, next: any) => {
    // copy body
    ctx.body = ctx.request.body;

    // if configuration exist
    if (config.configFileExist() === true)
        await config.trace.write(ctx); // trace request
    else return await adminRoute(ctx); // admin route for first start

    // create token
    createBearerToken(ctx);
    // create stean context
    ctx._ = new SteanContext(ctx);
    
    logging.message("context", ctx._).toLogAndFile();

    // if logs show log file
    if (ctx._.redirect && ctx._.redirect.includes("logs-")) return logsRoute(ctx, ctx._.redirect);
    
    // Specials routes
    if(!ctx._.service || (ctx._.service && ctx._.service.name === "admin")) switch (splitLast(ctx.path, "/").toLocaleUpperCase()) {
        // admin page
        case "INFOS":
            return await InfosRoute(ctx);
        // export page
        case "ADMIN":
            return await adminRoute(ctx);
        // export page
        case "EXPORT":
            await exportRoute(ctx);
        // logging for all
        case "HELP":
        case "DOCUMENTATION":
            if (ctx._.service) ctx.redirect(ctx._.origin + "/documentation")
            else return await docRoute(ctx);
        case "LOGGING":
            return await logsRoute(ctx, paths.logFile.fileName);
        case "STATE":
            ctx.type = returnFormats.json.type;
            ctx.body = { "state": getState()};
            return;
    }
    // error decodedUrl
    if (ctx._.error) {
        ctx.type = returnFormats.json.type;
        ctx.throw(EHttpCode.notFound);
    }

    if (splitLast(ctx.path, "/").toLocaleUpperCase().startsWith("REPLAYS(")) {
        await config.trace.rePlay(ctx);
    }
    
    // if service is not identified get out
    if (!ctx._.service) throw new Error(EErrors.noNameIdentified);

    // forcing post loras with different version IT'S POSSIBLE BECAUSE COLUMN ARE THE SAME FOR ALL VERSION
    if (ctx._.service.apiVersion != ctx._.service.apiVersion) {
        if (!(ctx.request.method === "POST" && ctx.originalUrl.includes(`${ctx._.service.apiVersion}/Loras`)))
            ctx.redirect(ctx.request.method === "GET" ? ctx.originalUrl.replace(String(ctx._.service.apiVersion), ctx._.service.apiVersion) : `${ctx._.base()}/${ctx._.service.apiVersion}/`);
    }

    // Clean query string
    ctx.querystring = ctx.request.method === "POST" && ctx.originalUrl.includes(`${ctx._.service.apiVersion}/Loras`) ? "" : decodeURIComponent(querystring.unescape(ctx.querystring));
 
    try {
        if (!ctx._.service) return;
        ctx._.user = decodeToken(ctx);
        await next().then(async () => {});
    } catch (error: any) {
        logging.error(error);
        const tempError = {
            code: error.statusCode || null,
            message: error.message || null,
            detail: error.detail
        };
        ctx.status = error.statusCode || error.status || EHttpCode.internalServerError;
        ctx.body = error.link ? { ...tempError, link: error.link } : tempError;
        config.trace.error(ctx, tempError);
    }
};