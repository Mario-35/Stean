/**
 * Index Routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { decodeToken } from "../authentication";
import { _DEBUG } from "../constants";
import { log } from "../log";
import { EHttpCode } from "../enums";
import { createBearerToken, returnFormats } from "../helpers";
import { adminRoute, decodeUrl, logsRoute, updateRoute, exportRoute } from "./helper";
import { errors } from "../messages";
import { config } from "../configuration";
import { models } from "../models";
export { unProtectedRoutes } from "./unProtected";
export { protectedRoutes } from "./protected";
import querystring from "querystring";
import { koaContext } from "../types";
import { paths } from "../paths";

export const routerHandle = async (ctx: koaContext, next: any) => {
    // copy body
    ctx.body = ctx.request.body;
    // if configuration exist
    if (config.configFileExist() === true)
        // trace request
        await config.trace.write(ctx);
    // admin coute for first start
    else return await adminRoute(ctx);

    // create token
    createBearerToken(ctx);
    // decode url
    const decodedUrl = decodeUrl(ctx);

    if (!decodedUrl && ctx.path.includes("/logs-")) return logsRoute(ctx, ctx.path);
    switch (ctx.path.split("/").reverse()[0].toLocaleUpperCase()) {
        // admin page
        case "ADMIN":
            return await adminRoute(ctx);
        // update page
        case "UPDATE":
            if (!decodedUrl) return await updateRoute(ctx);
        // export page
        case "EXPORT":
            if (!decodedUrl) await exportRoute(ctx);
        // logging for all
        case "LOGGING":
            if (!decodedUrl) return await logsRoute(ctx, paths.logFile.fileName);
    }

    if (!decodedUrl) {
        ctx.type = returnFormats.json.type;
        ctx.throw(EHttpCode.notFound);
    }
    // set decodedUrl context
    ctx.decodedUrl = decodedUrl;

    if (_DEBUG) console.log(log.object("decodedUrl", decodedUrl));
    if (!decodedUrl.service) throw new Error(errors.noNameIdentified);
    if (decodedUrl.service && decodedUrl.configName) ctx.service = config.getService(decodedUrl.configName);
    else return;
    // forcing post loras with different version IT'S POSSIBLE BECAUSE COLUMN ARE THE SAME FOR ALL VERSION
    if (decodedUrl.version != ctx.service.apiVersion) {
        if (!(ctx.request.method === "POST" && ctx.originalUrl.includes(`${decodedUrl.version}/Loras`))) ctx.redirect(ctx.request.method === "GET" ? ctx.originalUrl.replace(String(decodedUrl.version), ctx.service.apiVersion) : `${ctx.decodedUrl.linkbase}/${ctx.service.apiVersion}/`);
    }

    // try to clean query string
    ctx.querystring = decodeURIComponent(querystring.unescape(ctx.querystring));
    // get model
    ctx.model = models.filtered(ctx.service);

    try {
        // Init config context
        if (!ctx.service) return;
        ctx.user = decodeToken(ctx);
        await next().then(async () => {});
    } catch (error: any) {
        const tempError = {
            code: error.statusCode,
            message: error.message,
            detail: error.detail
        };
        config.trace.error(ctx, tempError);
        ctx.status = error.statusCode || error.status || EHttpCode.internalServerError;
        ctx.body = error.link ? { ...tempError, link: error.link } : tempError;
    }
};
