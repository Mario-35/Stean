/**
 * Protected Routes for API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Protected Routes for API -----------------------------------!");

import Router from "koa-router";
import { apiAccess, userAccess } from "../db/dataAccess";
import { isAllowedTo, returnFormats, upload } from "../helpers";
import fs from "fs";
import { IKeyString, IreturnResult, Iuser, koaContext } from "../types";
import { DefaultState, Context } from "koa";
import { createOdata } from "../odata";
import { errors, infos, msg } from "../messages";
import { EExtensions, EHttpCode, EUserRights } from "../enums";
import { loginUser } from "../authentication";
import { ADMIN } from "../constants";
import { executeSqlValues } from "../db/helpers";
import { config } from "../configuration";
import { checkPassword, emailIsValid } from "./helper";
import { Login, Query } from "../views";
import { createQueryParams } from "../views/helpers";
import { log } from "../log";

export const protectedRoutes = new Router<DefaultState, Context>();

protectedRoutes.post("/(.*)", async (ctx: koaContext, next) => {  
  switch (ctx.decodedUrl.path.toUpperCase()) {
    // login html page or connection login
    case "LOGIN":
      if (ctx.request["token" as keyof object]) ctx.redirect(`${ctx.decodedUrl.root}/status`);
      await loginUser(ctx).then((user: Iuser | undefined) => {
        if (user) {
          ctx.status = EHttpCode.ok;
          if ( ctx.request.header.accept && ctx.request.header.accept.includes("text/html") )
            ctx.redirect(`${ctx.decodedUrl.root}/Status`);
          else
            ctx.body = {
              message: infos.loginOk,
              user: user.username,
              token: user.token,
            };
        } else {
          ctx.throw(EHttpCode.Unauthorized);
        }
      });
      return;
    case "REGISTER":
      const why: IKeyString = {};
      // Username
      if (ctx.body["username"].trim() === "") {
        why["username"] = msg(errors.empty, "username");
      } else {
        const user = await executeSqlValues(config.getConfig(ADMIN), `SELECT "username" FROM "user" WHERE username = '${ctx.body["username"]}' LIMIT 1`);
        if (user) why["username"] = errors.alreadyPresent;
      }
      // Email
      if (ctx.body["email"].trim() === "") {
        why["email"] = msg(errors.empty, "email");
      } else {
        if (emailIsValid(ctx.body["email"]) === false)
          why["email"] = msg(errors.invalid, "email");
      }
      // Password
      if (ctx.body["password"].trim() === "") {
        why["password"] = msg(errors.empty, "password");
      }
      // Repeat password
      if ((ctx.body["repeat"] as string).trim() === "") {
        why["repeat"] = msg(errors.empty, "repeat password");
      } else {
        if (ctx.body["password"] != ctx.body.repeat) {
          why["repeat"] = errors.passowrdDifferent;
        } else {
          if (checkPassword(ctx.body["password"]) === false)
            why["password"] = msg(errors.invalid, "password");
        }
      }

      if (Object.keys(why).length === 0) {
        try {
          await userAccess.post(ctx.config.name, ctx.body);
        } catch (error) {
          ctx.redirect(`${ctx.decodedUrl.root}/error`);
        }
      } else {
        const createHtml = new Login(ctx, {
          login: false,
          body: ctx.request.body,
          why: why,
        });
        ctx.type = returnFormats.html.type;
        ctx.body = createHtml.toString();
      }
      return;
  }

  if(!ctx.decodedUrl.version && ctx.decodedUrl.path === "/" &&ctx.decodedUrl.service.toUpperCase() ==="CREATE") {
    // intercept create
    return;
  }
  
  // Add new lora observation this is a special route without ahtorisatiaon to post (deveui and correct payload limit risks)
  console.log(ctx.request.headers["authorization"] );
  if ((ctx.user && ctx.user.id > 0) || !ctx.config.extensions.includes(EExtensions.users) || ctx.request.url.includes("/Lora") || (ctx.request.headers["authorization"] && ctx.request.headers["authorization"] === config.getBrokerId() )) {
    if (ctx.request.type.startsWith("application/json") && Object.keys(ctx.body).length > 0) {
      const odataVisitor = await createOdata(ctx);
      if (odataVisitor) ctx.odata = odataVisitor;
      if (ctx.odata) {
        const objectAccess = new apiAccess(ctx);
        const returnValue: IreturnResult | undefined | void = await objectAccess.post();
        if (returnValue) {
          returnFormats.json.type;
          ctx.status = EHttpCode.created;
          ctx.body = returnValue.body;
        }
      } else ctx.throw(400);
    } else if (ctx.request.type.startsWith("multipart/")) {      
      // If upload datas
      const getDatas = async (): Promise<object> => {
        console.log(log.debug_head("getDatas ..."));
        return new Promise(async (resolve, reject) => {
          await upload(ctx)
            .then((data) => {
              resolve(data);
            })
            .catch((data) => {
              reject(data["state"] = "ERROR");
            });
        });
      };
      ctx.datas = await getDatas();
      
      const odataVisitor = await createOdata(ctx);
      if (odataVisitor) ctx.odata = odataVisitor;
      if (ctx.odata) {
        console.log(log.debug_head("POST FORM"));
        const objectAccess = new apiAccess(ctx);
        const returnValue = await objectAccess.post();
        if (ctx.datas) fs.unlinkSync(ctx.datas["file" as keyof object]);
        if (returnValue) {
          if (ctx.datas["source" as keyof object] == "query") {
            const tempContext = await createQueryParams(ctx);
            if (tempContext) {
              const bodyQuery= new Query(ctx, {
                ...tempContext,
                results: JSON.stringify({
                  added: returnValue.total,
                  value: returnValue.body,
                }),
              });
              ctx.set("script-src", "self");
              ctx.set("Content-Security-Policy", "self");
              ctx.type = returnFormats.html.type;
              ctx.body = bodyQuery.toString();
            }
          } else {
            returnFormats.json.type;
            ctx.status = EHttpCode.created;
            ctx.body = returnValue.body;
          }
        } else {
          ctx.throw(400);
        }
      }
    } else {
      // payload is malformed
      ctx.throw(400, { details: errors.payloadIsMalformed });
    }
  } else ctx.throw(EHttpCode.Unauthorized);
});

protectedRoutes.patch("/(.*)", async (ctx) => {
  if (
    isAllowedTo(ctx, EUserRights.Post) === true &&
    Object.keys(ctx.body).length > 0
  ) {
    const odataVisitor = await createOdata(ctx);
    if (odataVisitor) ctx.odata = odataVisitor;
    if (ctx.odata) {
      console.log(log.debug_head("PATCH"));
      const objectAccess = new apiAccess(ctx);
      if (ctx.odata.id) {
        const returnValue: IreturnResult | undefined | void =
          await objectAccess.update(ctx.odata.id);
        if (returnValue) {
          returnFormats.json.type;
          ctx.status = EHttpCode.ok;
          ctx.body = returnValue.body;
        }
      } else {
        ctx.throw(EHttpCode.badRequest, { detail: errors.idRequired });
      }
    } else {
      ctx.throw(EHttpCode.notFound);
    }
  } else {
    ctx.throw(EHttpCode.Unauthorized);
  }
});

protectedRoutes.delete("/(.*)", async (ctx) => {
  if (isAllowedTo(ctx, EUserRights.Delete) === true) {
    const odataVisitor = await createOdata(ctx);
    if (odataVisitor) ctx.odata = odataVisitor;
    if (ctx.odata) {
      console.log(log.debug_head("DELETE"));
      const objectAccess = new apiAccess(ctx);
      if (!ctx.odata.id) ctx.throw(400, { detail: errors.idRequired });
      const returnValue = await objectAccess.delete(ctx.odata.id);
      if (returnValue && returnValue.id && returnValue.id > 0) {
        returnFormats.json.type;
        ctx.status = EHttpCode.noContent;
      } else ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: errors.noId + ctx.odata.id });
    } else {
      ctx.throw(EHttpCode.notFound);
    }
  } else {
    ctx.throw(EHttpCode.Unauthorized);
  }
});