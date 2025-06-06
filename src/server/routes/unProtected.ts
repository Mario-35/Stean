/**
 * Unprotected Routes for API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import Router from "koa-router";
import { userAuthenticated, getAuthenticatedUser } from "../authentication";
import { _READY } from "../constants";
import { getUrlKey, isAdmin, returnFormats } from "../helpers";
import { apiAccess } from "../db/dataAccess";
import { IreturnResult } from "../types";
import { DefaultState, Context } from "koa";
import { createOdata } from "../odata";
import { info } from "../messages";
import { config } from "../configuration";
import { createDatabase, testDatas } from "../db/createDb";
import { disconnectDb, exportService } from "../db/helpers";
import { models } from "../models";
import { testRoute } from "./helper";
import { createService } from "../db/helpers";
import { HtmlError, Login, Status, Query } from "../views/";
import { createQueryParams } from "../views/helpers";
import { EOptions, EHttpCode, EConstant, EEncodingType } from "../enums";
import { getMetrics } from "../db/monitoring";
import { log } from "../log";

export const unProtectedRoutes = new Router<DefaultState, Context>();
// ALL others
// API GET REQUEST
unProtectedRoutes.get("/(.*)", async (ctx) => {
    switch (ctx.decodedUrl.path.toUpperCase()) {
        // Root path
        case `/`:
            ctx.body = models.getRoot(ctx);
            ctx.type = returnFormats.json.type;
            return;
        // tests only for testing wip features
        case "TEST":
            if (!isAdmin(ctx.service)) {
                ctx.type = returnFormats.json.type;
                ctx.body = await testRoute(ctx);
                return;
            }
            ctx.throw(EHttpCode.notFound);
        // metrics for monitoring
        case "METRICS":
            ctx.type = returnFormats.json.type;
            ctx.body = await getMetrics(ctx.service);
            return;
        // error show in html if query call
        case "ERROR":
            const bodyError = new HtmlError(ctx, { url: "what ?" });
            ctx.type = returnFormats.html.type;
            ctx.body = bodyError.toString();
            return;
        // logs
        case "HELP":
        case "DOC":
        case "DOCUMENTATION":
            ctx.redirect(`${ctx.decodedUrl.origin}/documentation`);
            return;
        // logs
        case "LOGGING":
            ctx.redirect(`${ctx.decodedUrl.origin}/logging`);
            return;
        // export service
        case "EXPORT":
            ctx.type = returnFormats.json.type;
            ctx.body = await exportService(ctx);
            return;
        // Admin page login
        case "ADMIN":
            ctx.redirect(`${ctx.decodedUrl.origin}/admin`);
            return;
        // User login
        case "LOGIN":
            if (userAuthenticated(ctx)) ctx.redirect(`${ctx.decodedUrl.root}/status`);
            else {
                const bodyLogin = new Login(ctx, { url: "", login: true });
                ctx.type = returnFormats.html.type;
                ctx.body = bodyLogin.toString();
            }
            return;
        // Status user
        case "STATUS":
            if (userAuthenticated(ctx)) {
                const user = await getAuthenticatedUser(ctx);
                if (user) {
                    const bodyStatus = new Status(ctx, { url: "", user: user });
                    ctx.type = returnFormats.html.type;
                    ctx.body = bodyStatus.toString();
                    return;
                }
            }
            ctx.cookies.set("jwt-session");
            ctx.redirect(`${ctx.decodedUrl.root}/login`);
            return;
        // Create user
        case "REGISTER":
            const bodyLogin = new Login(ctx, { url: "", login: false });
            ctx.type = returnFormats.html.type;
            ctx.body = bodyLogin.toString();
            return;
        // Logout user
        case "LOGOUT":
            ctx.cookies.set("jwt-session");
            if (ctx.request.header.accept && ctx.request.header.accept.includes(EEncodingType.html)) ctx.redirect(`${ctx.decodedUrl.root}/login`);
            else ctx.status = EHttpCode.ok;
            ctx.body = {
                message: info.logoutOk
            };
            return;
        // Execute Sql query pass in url
        case "SQL":
            let sql = getUrlKey(ctx.request.url, "query");
            if (sql) {
                sql = atob(sql);
                const resultSql = await config.executeSql(sql.includes("log_request") ? config.getService(EConstant.admin) : ctx.service, sql);
                ctx.status = EHttpCode.created;
                ctx.body = [resultSql];
            }
            return;
        // Show draw.io model
        case "DRAW":
            ctx.type = returnFormats.xml.type;
            ctx.body = models.getDrawIo(ctx.service);
            return;
        // Infos and link of a services
        case "INFOS":
            ctx.type = returnFormats.json.type;
            ctx.body = await models.getInfos(ctx);
            return;
        // Create DB test
        case "CREATE":
            if (ctx.decodedUrl.service === EConstant.test) {
                console.log(log.debug_head("Create service"));
                try {
                    (ctx.body = await createService(ctx.service, testDatas)), (ctx.status = EHttpCode.created);
                } catch (error) {
                    ctx.status = EHttpCode.badRequest;
                    ctx.redirect(`${ctx.decodedUrl.root}/error`);
                }
                return;
            }
            ctx.throw(EHttpCode.notFound);
        // Drop DB
        case "DROP":
            console.log(log.debug_head("drop database"));
            if (ctx.service.options.includes(EOptions.canDrop)) {
                await disconnectDb(ctx.service.pg.database, true);
                try {
                    ctx.status = EHttpCode.created;
                    ctx.body = await createDatabase(ctx.service.pg.database);
                } catch (error) {
                    ctx.status = EHttpCode.badRequest;
                    ctx.redirect(`${ctx.decodedUrl.root}/error`);
                }
                return;
            }
            ctx.throw(EHttpCode.notFound);
        // Return Query HTML Page Tool
        case "QUERY":
            const tempContext = await createQueryParams(ctx);
            if (tempContext) {
                const bodyQuery = new Query(ctx, { url: "", queryOptions: tempContext });
                ctx.set("script-src", "self");
                ctx.set("Content-Security-Policy", "self");
                ctx.type = returnFormats.html.type;
                ctx.body = bodyQuery.toString();
            }
            return;
    } // END Switch

    if (ctx.decodedUrl.path.includes(ctx.service.apiVersion) || ctx.decodedUrl.version) {
        console.log(log.debug_head(`unProtected GET ${ctx.service.apiVersion}`));
        // decode odata url infos
        const odataVisitor = await createOdata(ctx);

        if (odataVisitor) {
            ctx.odata = odataVisitor;
            if (ctx.odata.returnNull === true) {
                ctx.body = { values: [] };
                return;
            }
            console.log(log.debug_head(`GET ${ctx.service.apiVersion}`));
            // Create api object
            const objectAccess = new apiAccess(ctx);
            if (objectAccess) {
                // Get all
                ctx.type = ctx.odata.returnFormat.type;
                if (ctx.odata.entity && ctx.odata.single === false) {
                    const returnValue = await objectAccess.getAll();
                    if (returnValue) {
                        ctx.body = ctx.odata.returnFormat.format(returnValue.body || (returnValue as object), ctx);
                        if (returnValue.selfLink) ctx.set("Location", returnValue.selfLink);
                    } else ctx.throw(EHttpCode.notFound);
                    // Get One
                } else if (ctx.odata.single === true) {
                    const returnValue = await objectAccess.getSingle();
                    if (returnValue) {
                        ctx.body = returnValue;
                    } else ctx.throw(EHttpCode.notFound, { detail: `id : ${ctx.odata.id} not found` });
                } else ctx.throw(EHttpCode.badRequest);
            }
        }
    }
});

// API PUT REQUEST only for add decoder from admin
unProtectedRoutes.put("/(.*)", async (ctx) => {
    const action = ctx.request.url.split("/").reverse()[0];
    switch (action.toUpperCase()) {
        case "DECODERS":
            if (ctx.request.type.startsWith(EEncodingType.json) && Object.keys(ctx.body).length > 0) {
                const odataVisitor = await createOdata(ctx);
                if (odataVisitor) ctx.odata = odataVisitor;
                if (ctx.odata) {
                    const objectAccess = new apiAccess(ctx);
                    const returnValue: IreturnResult | undefined | void = await objectAccess.put();
                    if (returnValue) {
                        returnFormats.json.type;
                        if (returnValue.selfLink) ctx.set("Location", returnValue.selfLink);
                        ctx.status = EHttpCode.created;
                        ctx.body = returnValue.body;
                    }
                } else ctx.throw(EHttpCode.badRequest);
            }
            break;
        case "SYNONYMS":
        case "OPTIONS":
            if (ctx.request.type.startsWith(EEncodingType.json) && Object.keys(ctx.body).length > 0) {
                ctx.service[action as keyof object] = ctx.body as never;
                ctx.body = await config.updateConfig(ctx.service);
            }
            break;
        case "NB_PAGE":
        case "CSVDELIMITER":
            if (ctx.request.type.startsWith(EEncodingType.json) && Object.keys(ctx.body).length > 0) {
                ctx.service[action as keyof object] = ctx.body[action] as never;
                ctx.body = await config.updateConfig(ctx.service);
            }
            break;
        default:
            ctx.throw(EHttpCode.badRequest);
            break;
    }
});
