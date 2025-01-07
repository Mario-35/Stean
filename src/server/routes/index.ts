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
import { EExtensions, EFileName, EHttpCode } from "../enums";
import { createBearerToken, getUserId, returnFormats } from "../helpers";
import { adminRoute, decodeUrl, updateRoute } from "./helper";
import { errors } from "../messages";
import { config } from "../configuration";
import { models } from "../models";
export { unProtectedRoutes } from "./unProtected";
export { protectedRoutes } from "./protected";
import querystring from "querystring";
import { koaContext } from "../types";
import { writeLogToDb } from "../log/writeLogToDb";
import { HtmlLogs } from "../views/class/logs";
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const routerHandle = async (ctx: koaContext, next: any) => {
    // copy body
    ctx.body = ctx.request.body;
    // trace request
    if (config.configFileExist() === true) config.writeTrace(ctx);
    else return await adminRoute(ctx);

    // create token
    createBearerToken(ctx);
    // decode url
    const decodedUrl = decodeUrl(ctx);

    if (ctx.path.toLocaleUpperCase() === "/ADMIN" || (decodedUrl && decodedUrl.configName && decodedUrl.configName.toLocaleUpperCase() === "ADMIN"))
        return await adminRoute(ctx);
    if (ctx.path.toLocaleUpperCase() === "/UPDATE" || (decodedUrl && decodedUrl.configName && decodedUrl.configName.toLocaleUpperCase() === "UPDATE"))
        return await updateRoute(ctx);
    if (ctx.path.toLocaleUpperCase() === "/EXPORT" || (decodedUrl && decodedUrl.configName && decodedUrl.configName.toLocaleUpperCase() === "EXPORT")) {
        const a = await config.export();
        console.log(a);
    }

    if (!decodedUrl) {
        // Get all infos services
        switch (ctx.path.toLocaleUpperCase()) {
            // Infos for all
            case "/INFOS":
                ctx.body = config.getInfosForAll(ctx);
            // logging for all
            case "/LOGGING":
                const bodyLogs = new HtmlLogs(ctx, { url: "../../" + EFileName.logs });
                ctx.type = returnFormats.html.type;
                ctx.body = bodyLogs.toString();
        }
        return;
    }

    // set decodedUrl context
    ctx.decodedUrl = decodedUrl;
    if (_DEBUG) console.log(log.object("decodedUrl", decodedUrl));
    if (!decodedUrl.service) throw new Error(errors.noNameIdentified);
    if (decodedUrl.service && decodedUrl.configName) ctx.service = config.getService(decodedUrl.configName);
    else return;
    // forcing post loras with different version IT'S POSSIBLE BECAUSE COLUMN ARE THE SAME FOR ALL VERSION
    if (decodedUrl.version != ctx.service.apiVersion) {
        if (!(ctx.request.method === "POST" && ctx.originalUrl.includes(`${decodedUrl.version}/Loras`)))
            ctx.redirect(
                ctx.request.method === "GET"
                    ? ctx.originalUrl.replace(String(decodedUrl.version), ctx.service.apiVersion)
                    : `${ctx.decodedUrl.linkbase}/${ctx.service.apiVersion}/`
            );
    }

    // try to clean query string
    ctx.querystring = decodeURIComponent(querystring.unescape(ctx.querystring));
    // prepare logs object
    try {
        if (ctx.service.extensions.includes(EExtensions.logs))
            ctx.log = {
                datas: { ...ctx.body },
                code: -999,
                method: ctx.method,
                url: ctx.url,
                database: ctx.service.pg.database,
                user_id: getUserId(ctx).toString()
            };
    } catch (error: any) {
        ctx.log = undefined;
    }
    // get model
    ctx.model = models.filtered(ctx.service);

    try {
        // Init config context
        if (!ctx.service) return;
        ctx.user = decodeToken(ctx);
        await next().then(async () => {});
    } catch (error: any) {
        console.log(error);
        if (ctx.service && ctx.service.extensions.includes(EExtensions.logs)) writeLogToDb(ctx, error);
        const tempError = {
            code: error.statusCode,
            message: error.message,
            detail: error.detail
        };
        ctx.status = error.statusCode || error.status || EHttpCode.internalServerError;
        ctx.body = error.link ? { ...tempError, link: error.link } : tempError;
    }
};
