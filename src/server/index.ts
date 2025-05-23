/**
 * Index of The API
 *
 * @copyright 2020-present Inrae
 * @review 29-01-2024
 * @author mario.adam@inrae.fr
 *
 */
import path from "path";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import helmet from "koa-helmet";
import json from "koa-json";
import cors from "@koa/cors";
import serve from "koa-static";
import favicon from "koa-favicon";
import { log } from "./log";
import { config } from "./configuration";
import { models } from "./models";
import { isTest, logToHtml } from "./helpers";
import { RootPgVisitor } from "./odata/visitor";
import { EChar, EConstant } from "./enums";
import { protectedRoutes, routerHandle, unProtectedRoutes } from "./routes/";
import { Iservice, IdecodedUrl, Ientities, IuserToken } from "./types";
import { appVersion } from "./constants";
import { paths } from "./paths";
import { disconnectDb } from "./db/helpers";

// Extend koa context
declare module "koa" {
    interface DefaultContext {
        decodedUrl: IdecodedUrl;
        traceId: bigint | undefined;
        service: Iservice;
        odata: RootPgVisitor;
        datas: Record<string, any>;
        user: IuserToken;
        model: Ientities;
        body: any;
    }
}

// Initialisation of models
models.initialisation();
// new koa server https://koajs.com/
export const app = new Koa();
app.use(favicon(path.join(__dirname, "/", "favicon.ico")));
// add public folder [static]
app.use(serve(path.join(__dirname, "/", "public")));
// helmet protection https://github.com/venables/koa-helmet
app.use(helmet.contentSecurityPolicy({ directives: EConstant.helmetConfig }));
// bodybarser https://github.com/koajs/bodyparser
app.use(bodyParser({ enableTypes: ["json", "text", "form"] }));
// router
app.use(routerHandle);
// logger https://github.com/koajs/logger
if (!isTest())
    app.use(
        logger((str) => {
            if (str.includes("/logs")) return;
            str = `[39m ${new Date().toLocaleString()}${str}`;
            process.stdout.write(str + EConstant.return);
            paths.logFile.writeStream(logToHtml(str));
        })
    );
// add json capabilities to KOA server
app.use(json());
// add cors capabilities to KOA server
app.use(cors());
// free routes
app.use(unProtectedRoutes.routes());
// authenticated routes
app.use(protectedRoutes.routes());
// Start server initialisaion
export const server = isTest()
    ? // Test-driven development init
      app.listen(config.getService(EConstant.admin).ports?.http || 8029, async () => {
          await disconnectDb(EConstant.test, true);
          console.log(log.message(`${EConstant.appName} version : ${appVersion}`, "ready " + EChar.ok));
      })
    : // Production or dev init
      config.initialisation();
