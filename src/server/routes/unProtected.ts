/**
* Unprotected Routes for API
*
* @copyright 2020-present Inrae
* @author mario.adam@inrae.fr
*
*/
// onsole.log("!----------------------------------- Unprotected Routes for API -----------------------------------!");

import Router from "koa-router";
import { userAuthenticated, getAuthenticatedUser, } from "../authentication";
import { ADMIN, _READY } from "../constants";
import { simpleQuotesString, getUrlKey, returnFormats } from "../helpers";
import { apiAccess } from "../db/dataAccess";
import { IreturnResult } from "../types";
import { DefaultState, Context } from "koa";
import { createOdata } from "../odata";
import { info } from "../messages";
import { config } from "../configuration";
import { createDatabase, testDatas } from "../db/createDb";
import { executeAdmin, executeSql, exportService } from "../db/helpers";
import { models } from "../models";
import { getTest, sqlStopDbName } from "./helper";
import { createService } from "../db/helpers";
import { HtmlError, Login, Status, Query } from "../views/";
import { createQueryParams } from "../views/helpers";
import { EFileName, EOptions, EHttpCode } from "../enums";
import { getMetrics } from "../db/monitoring";
import { HtmlLogs } from "../views/class/logs";
import { log } from "../log";

export const unProtectedRoutes = new Router<DefaultState, Context>();
// ALl others
unProtectedRoutes.get("/(.*)", async (ctx) => {
  switch (ctx.decodedUrl.path.toUpperCase()) {  
    // Root path
    case `/`:
      ctx.body = models.getRoot(ctx);
      ctx.type = returnFormats.json.type;
      return;    
    // tests only for testing wip features
    case "TEST":
      ctx.type = returnFormats.json.type;
      ctx.body = await getTest(ctx);
      return;
    // metrics for moinoring
    case "METRICS":
      ctx.type = returnFormats.json.type;
      ctx.body = await getMetrics(ctx);
      return;
    // error show in html if query call
    case "ERROR":
      const bodyError = new HtmlError(ctx, "what ?");
      ctx.type = returnFormats.html.type;
      ctx.body = bodyError.toString();
      return;
    // logs
    case "LOGGING":;
      ctx.redirect(`${ctx.decodedUrl.origin}/logging`);
      return;
    case "LOGSBAK":
      const bodyLogsBak = new HtmlLogs(ctx, "../../../" + EFileName.logsBak);
      ctx.type = returnFormats.html.type;
      ctx.body = bodyLogsBak.toString();
      return;
    // export service
    case "EXPORT":
      ctx.type = returnFormats.json.type;
      ctx.body = await exportService(ctx);
      return;
    // User login
    case "SERVICE":
      ctx.redirect(`${ctx.decodedUrl.origin}/service`);
      return;
    case "LOGIN":
      if (userAuthenticated(ctx)) ctx.redirect(`${ctx.decodedUrl.root}/status`);
      else {
        const bodyLogin = new Login(ctx,{ login: true });
        ctx.type = returnFormats.html.type;
        ctx.body = bodyLogin.toString();
      }
      return;
    // Status user 
    case "STATUS":      
      if (userAuthenticated(ctx)) {
        const user = await getAuthenticatedUser(ctx);
        if (user) {
          const bodyStatus = new Status(ctx, user);
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
      const bodyLogin = new Login(ctx, { login: false });
      ctx.type = returnFormats.html.type;
      ctx.body = bodyLogin.toString();
      return;
    // Logout user
    case "LOGOUT":
      ctx.cookies.set("jwt-session");
      if ( ctx.request.header.accept && ctx.request.header.accept.includes("text/html") )
        ctx.redirect(`${ctx.decodedUrl.root}/login`);
      else ctx.status = EHttpCode.ok;
      ctx.body = {
        message: info.logoutOk,
      };
      return; 
    // Execute Sql query pass in url 
    case "SQL":
      let sql = getUrlKey(ctx.request.url, "query");
      if (sql) {
        sql = atob(sql);
        const resultSql = await executeSql(sql.includes("log_request") ? config.getService(ADMIN) : ctx.config, sql);
        ctx.status = EHttpCode.created;
        ctx.body = [resultSql];
      }
      return;
    // Show draw.io model
    case "DRAW":
      ctx.type = returnFormats.xml.type;
      ctx.body = models.getDraw(ctx);
      return;
    // Infos and link of a services
    case "INFOS":
      ctx.type = returnFormats.json.type;
      ctx.body = await models.getInfos(ctx);
      return;
    case "INDEXES":
      process.exit(110);
    case "DROP":
      console.log(log.debug_head("drop database"));
      if (ctx.config.options.includes(EOptions.canDrop)) {        
        await executeAdmin(sqlStopDbName(simpleQuotesString(ctx.config.pg.database))).then(async () => {
            await executeAdmin(`DROP DATABASE IF EXISTS ${ctx.config.pg.database}`);
            try {
              ctx.status = EHttpCode.created;
              ctx.body = await createDatabase(ctx.config.pg.database);              
            } catch (error) {
              ctx.status = EHttpCode.badRequest;
              ctx.redirect(`${ctx.decodedUrl.root}/error`);
            }
          });
      }
      return;
    // Create DB test
    case "CREATEDBTEST":
      console.log(log.debug_head("GET createDB"));
      try {
        await config.connection(ADMIN)`DROP DATABASE IF EXISTS test`;
        ctx.body = await createService(testDatas),    
        ctx.status = EHttpCode.created;
      } catch (error) {
        ctx.status = EHttpCode.badRequest;
        ctx.redirect(`${ctx.decodedUrl.root}/error`);
      }
      return;
    // Drop DB test
    case "REMOVEDBTEST":
      console.log(log.debug_head("GET remove DB test"));
      const returnDel = await config
        .connection(ADMIN)`${sqlStopDbName('test')}`
        .then(async () => {
          await config.connection(ADMIN)`DROP DATABASE IF EXISTS test`;
          return true;
        });
      if (returnDel) {
        ctx.status = EHttpCode.noContent;
        ctx.body = returnDel;
      } else {
        ctx.status = EHttpCode.badRequest;
        ctx.redirect(`${ctx.decodedUrl.root}/error`);
      }
      return;
    // Return Query HTML Page Tool 
    case "QUERY":
      const tempContext = await createQueryParams(ctx);  
      if (tempContext) {
        const bodyQuery= new Query(ctx, tempContext);
        ctx.set("script-src", "self");
        ctx.set("Content-Security-Policy", "self");
        ctx.type = returnFormats.html.type;
        ctx.body = bodyQuery.toString();
      }
      return;
    } // END Switch

  // API GET REQUEST  
  if (ctx.decodedUrl.path.includes(`/${ctx.config.apiVersion}`) || ctx.decodedUrl.version) {
    console.log(log.debug_head(`unProtected GET ${ctx.config.apiVersion}`));
    // decode odata url infos
    const odataVisitor = await createOdata(ctx);    
    
    if (odataVisitor) {
      ctx.odata = odataVisitor;
      if (ctx.odata.returnNull === true) { 
        ctx.body = { values: [] }; 
        return;
      }
      console.log(log.debug_head(`GET ${ctx.config.apiVersion}`));
      // Create api object
      const objectAccess = new apiAccess(ctx);
      if (objectAccess) {
        // Get all
        if (ctx.odata.entity && ctx.odata.single === false) {
          const returnValue = await objectAccess.getAll();
          if (returnValue) {
            const datas = ctx.odata.returnFormat === returnFormats.json
                ? ({  "@iot.count": returnValue.id,
                      "@iot.nextLink": returnValue.nextLink,
                      "@iot.prevLink": returnValue.prevLink,
                      value: returnValue.body} as object)
                : returnValue.body;
            ctx.type = ctx.odata.returnFormat.type;
            ctx.body = ctx.odata.returnFormat.format(datas as object, ctx);
          } else ctx.throw(EHttpCode.notFound);
        // Get One
        } else if (ctx.odata.single === true) {
          const returnValue: IreturnResult | undefined = await objectAccess.getSingle();
          if (returnValue && returnValue.body) {
            ctx.type = ctx.odata.returnFormat.type;
            ctx.body = ctx.odata.returnFormat.format(returnValue.body);
          } else ctx.throw(EHttpCode.notFound, { detail: `id : ${ctx.odata.id} not found` });
        } else ctx.throw(EHttpCode.badRequest);
      }
    }
  }  
});

