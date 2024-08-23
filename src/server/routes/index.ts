/**
 * Index Routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Index Routes -----------------------------------!");

import { decodeToken } from "../authentication";
import { _DEBUG } from "../constants";
import { log } from "../log";
import { EExtensions, EHttpCode } from "../enums";
import { createBearerToken, getUserId } from "../helpers";
import { decodeUrl, firstInstall } from "./helper";
import { errors } from "../messages";
import { config } from "../configuration";
import { models } from "../models";
export { unProtectedRoutes } from "./unProtected";
export { protectedRoutes } from "./protected";
import querystring from "querystring";
import { koaContext } from "../types";
import { writeLogToDb } from "../log/writeLogToDb";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const routerHandle = async (ctx: koaContext, next: any) => { 
  // First Install 
  await firstInstall(ctx);  
  // create token
  createBearerToken(ctx);
  // decode url
  const decodedUrl = decodeUrl(ctx);
 
  if (!decodedUrl) {
    // Get all infos services
    if (ctx.path.toLocaleUpperCase() === "/INFOS") ctx.body = config.getInfosForAll(ctx);
    return;
  };
  
  // set decodedUrl context
  ctx.decodedUrl = decodedUrl;
  if (_DEBUG) console.log(log.object("decodedUrl", decodedUrl));

  if (!decodedUrl.service) throw new Error(errors.noNameIdentified);
  if (decodedUrl.service && decodedUrl.configName) 
    ctx.config = config.getConfig(decodedUrl.configName);
    else return;

  // forcing post loras with different version IT'S POSSIBLE BECAUSE COLUMN ARE THE SAME FOR ALL VERSION
  if (decodedUrl.version != ctx.config.apiVersion) {    
    if (!(ctx.request.method === "POST" && ctx.originalUrl.includes(`${decodedUrl.version}/Loras`)))
    ctx.redirect(ctx.request.method === "GET" 
      ? ctx.originalUrl.replace(decodedUrl.version, ctx.config.apiVersion)
      : `${ctx.decodedUrl.linkbase}/v${ctx.config.apiVersion}/`);
  }
  
  // try to clean query string
  ctx.querystring = decodeURIComponent(querystring.unescape(ctx.querystring));
  // prepare logs object
  try {
    if (ctx.config.extensions.includes(EExtensions.logs))
      ctx.log = {
        datas: { ... ctx.body},
        code: -999,
        method: ctx.method,
        url: ctx.url,
        database: ctx.config.pg.database,
        user_id: getUserId(ctx).toString(),
      };
  } catch (error: any) { 
    ctx.log = undefined;
  }
  // get model
  ctx.model = models.filteredModelFromConfig(ctx.config);
  try {
    // Init config context
    if (!ctx.config) return;    
    ctx.user = decodeToken(ctx);
    // Write in logs
    await next().then(async () => {  
      if (ctx.config.extensions.includes(EExtensions.logs)) await writeLogToDb(ctx);
    });
  } catch (error: any) {
    console.log(error);
    if (ctx.config && ctx.config.extensions.includes(EExtensions.logs))
    writeLogToDb(ctx, error);      
      const tempError = {
        code: error.statusCode,
        message: error.message,
        detail: error.detail,
      };
    ctx.status = error.statusCode || error.status || EHttpCode.internalServerError;
    ctx.body = error.link ? { ...tempError, link: error.link, } : tempError ;
  }
};
