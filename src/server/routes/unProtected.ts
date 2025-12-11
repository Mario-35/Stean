/**
 * Unprotected Routes for API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import Router from "koa-router";
import { userAuthenticated, getAuthenticatedUser } from "../authentication";
import { isState } from "../constants";
import { getUrlKey, returnFormats } from "../helpers";
import { apiAccess } from "../db/dataAccess";
import { IreturnResult } from "../types";
import { DefaultState, Context } from "koa";
import { createOdata } from "../odata";
import { config } from "../configuration";
import { createDatabase, testDatas } from "../db/createDb";
import { cleanDb, disconnectDb, executeSql, exportService } from "../db/helpers";
import { models } from "../models";
import { createService } from "../db/helpers";
import { HtmlError, Login, Status, Query } from "../views/";
import { createQueryParams } from "../views/helpers";
import { EOptions, EHttpCode, EConstant, EInfos, EState } from "../enums";
import { logging } from "../log";

export const unProtectedRoutes = new Router<DefaultState, Context>();
// ALL others
unProtectedRoutes.get("/*path", async (ctx) => {    
    switch (ctx._.path.toUpperCase()) {
        // Root path
        case `/`:
            ctx.body = models.root(ctx);
            ctx.type = returnFormats.json.type;
            return;
        // tests only for testing wip features
        case "HELP":
        case "DOCUMENTATION":
        case "DOC":
            ctx.redirect(`${ctx._.origin}/documentation`);
            return;
        // error show in html if query call
        case "ERROR":
            const bodyError = new HtmlError(ctx, { url: "what ?" });
            ctx.type = returnFormats.html.type;
            ctx.body = bodyError.toString();
            return;
        // Clean
        case "CLEAN":
            ctx.type = returnFormats.json.type;
            ctx.body = { clean: isState(EState.normal) ? await cleanDb(ctx) : "Not Ready" };
            return;
        // Restart
        case "RESTART":
            if (userAuthenticated(ctx)) {
                ctx.type = returnFormats.json.type;
                ctx.status = isState(EState.normal) ? 200 : 202;
                ctx.body = { restart: isState(EState.normal) ? await config.start(true) : "Not Ready" };
                return;
            }
        // logs
        case "LOGGING":
            ctx.redirect(`${ctx._.root()}/logging`);
            return;
        // export service
        case "EXPORT":
            ctx.type = returnFormats.json.type;
            ctx.body = await exportService(ctx);
            return;
        // Admin login
        case "ADMIN":
            ctx.redirect(`${ctx._.origin}/admin`);
            return;
        // User login
        case "LOGIN":
            if (userAuthenticated(ctx)) ctx.redirect(`${ctx._.root()}/status`);
            else {
                const bodyLogin = new Login(ctx, { url: "", login: true });
                ctx.type = returnFormats.html.type;
                ctx.body = bodyLogin.toString();
            }
            return;
        // User Status
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
            ctx.cookies.set(EConstant.appName);
            ctx.redirect(`${ctx._.root()}/login`);
            return;
        // Create user
        case "REGISTER":
            const bodyLogin = new Login(ctx, { url: "", login: false });
            ctx.type = returnFormats.html.type;
            ctx.body = bodyLogin.toString();
            return;
        // Logout user
        case "LOGOUT":
            ctx.cookies.set(EConstant.appName);
            if (ctx.request.header.accept && ctx.request.header.accept.includes("text/html")) ctx.redirect(`${ctx._.root()}/login`);
            else ctx.status = EHttpCode.ok;
            ctx.body = {
                message: EInfos.logoutOk
            };
            return;
        // Execute Sql query pass in url
        case "SQL":
            let sql = getUrlKey(ctx.request.url, "query");
            if (sql) {
                sql = atob(sql);
                const resultSql = await executeSql(sql.includes("log_request") ? config.getService(EConstant.admin) : ctx._.service, sql);
                ctx.status = EHttpCode.created;
                ctx.body = [resultSql];
            }
            return;
        // Infos and link of a services
        case "INFOS":
            ctx.type = returnFormats.json.type;
            ctx.body = await models.infos(ctx);
            return;
        // Create DB test
        case "CREATE":
            if (ctx._.service.name === EConstant.test) {
                console.log(logging.head("Create service").to().text());
                try {
                    (ctx.body = await createService(testDatas)), (ctx.status = EHttpCode.created);
                } catch (error) {
                    ctx.status = logging.error(error).return(EHttpCode.badRequest);
                    ctx.redirect(`${ctx._.root()}/error`);
                }
                return;
            }
            ctx.throw(EHttpCode.notFound);
        // Drop DB
        case "DROP":
            console.log(logging.head("drop database").to().text());
            if (ctx._.isOption(EOptions.canDrop)) {
                await disconnectDb(ctx._.service.pg.database, true);
                try {
                    ctx.status = EHttpCode.created;
                    ctx.body = await createDatabase(ctx._.service.pg.database);
                } catch (error) {
                    ctx.status = logging.error(error).return(EHttpCode.badRequest);
                    ctx.redirect(`${ctx._.root()}/error`);
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

    // API GET REQUEST
    if (ctx._.path.includes(ctx._.service.apiVersion) || ctx._.service.apiVersion) {
        console.log(logging.head(`unProtected GET ${ctx._.service.apiVersion}`).to().text());
        // decode odata url messages.infoss
        const odataVisitor = await createOdata(ctx);

        if (odataVisitor) {
            ctx._.odata = odataVisitor;
            if (ctx._.odata.returnNull === true) {
                ctx.body = { values: [] };
                return;
            }
            console.log(logging.head(`GET ${ctx._.service.apiVersion}`).to().text());
            // Create api object
            const objectAccess = new apiAccess(ctx);
            if (objectAccess) {
                if (ctx._.odata.entity) {
                    const returnValue = ctx._.odata.single === true ? await objectAccess.getSingle() : await objectAccess.getAll();
                    if (returnValue) {
                        ctx.type = ctx._.odata.returnFormat.type;
                        ctx.body = ctx._.odata.returnFormat.format(returnValue.body || returnValue, ctx);
                        if (returnValue.location) ctx.set("Location", returnValue.location);
                    } else ctx.throw(EHttpCode.notFound);
                } else ctx.throw(EHttpCode.badRequest);
            }
        }
    }
});

// Put only for add decoder from admin
unProtectedRoutes.put("/*path", async (ctx) => {
    if (ctx.request.url.includes("/Decoders")) {
        if (ctx.request.type.startsWith("application/json") && Object.keys(ctx.body).length > 0) {
            const odataVisitor = await createOdata(ctx);
            if (odataVisitor) {
                ctx._.odata = odataVisitor;
                const objectAccess = new apiAccess(ctx);
                const returnValue: IreturnResult | undefined | void = await objectAccess.put();
                if (returnValue) {
                    returnFormats.json.type;
                    if (returnValue.location) ctx.set("Location", returnValue.location);
                    ctx.status = EHttpCode.created;
                    ctx.body = returnValue.body;
                }
            } else ctx.throw(EHttpCode.badRequest);
        }
    }

    if (ctx.request.url.includes("/synonyms")) {
        if (ctx.request.type.startsWith("application/json") && Object.keys(ctx.body).length > 0) {
            ctx._.service.synonyms = ctx.body;
            ctx.body = await config.updateConfig(ctx._.service);
        }
    }

    if (ctx.request.url.includes("/options")) {
        ctx._.service.options = ctx.body;
        config.updateConfig(ctx._.service);
    }
});
