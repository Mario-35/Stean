/**
 * Protected Routes for API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Router from "koa-router";
import { apiAccess, userAccess } from "../db/dataAccess";
import { isAllowedTo, returnFormats, upload } from "../helpers";
import fs from "fs";
import { IreturnResult, Iuser, koaContext } from "../types";
import { DefaultState, Context } from "koa";
import { createOdata } from "../odata";
import { EConstant, EErrors, EExtensions, EHttpCode, EInfos, EUserRights } from "../enums";
import { loginUser, setToken } from "../authentication";
import { config } from "../configuration";
import { checkPassword, emailIsValid } from "./helper";
import { Login, Query } from "../views";
import { createQueryParams } from "../views/helpers";
import { logging } from "../log";
import { executeSqlValues } from "../db/helpers";
import { _DEBUG, _READY } from "../constants";
import { messages } from "../messages";
import { queries } from "../db/queries";
export const protectedRoutes = new Router<DefaultState, Context>();

protectedRoutes.post("/*path", async (ctx: koaContext, next) => {
    switch (ctx._.path.toUpperCase()) {
        // Restart App
        case "RESTART":
            // login html page or connection login
            logging.head("essai").toLogAndFile();
            process.exit(100);
        case "LOGIN":
            if (ctx.request["token" as keyof object]) ctx.redirect(`${ctx._.root()}/status`);
            await loginUser(ctx).then((user: Iuser | undefined) => {
                if (user) {
                    setToken(ctx, String(user["token" as keyof object]));
                    ctx.status = EHttpCode.ok;
                    if (ctx.request.header.accept && ctx.request.header.accept.includes("text/html")) ctx.redirect(`${ctx._.root()}/Status`);
                    else
                        ctx.body = {
                            message: EInfos.loginOk,
                            user: user.username,
                            token: user.token
                        };
                } else {
                    ctx.throw(EHttpCode.Unauthorized);
                }
            });
            return;
        case "REGISTER":
            const why: Record<string, string> = {};
            // Username
            if (ctx.body["username"].trim() === "") {
                why["username"] = messages.str(EErrors.empty, "username").toString();
            } else {
                const user = await executeSqlValues(config.getService(EConstant.admin), queries.getUser(ctx.body["username"]));
                if (user) why["username"] = EErrors.alreadyPresent;
            }
            // Email
            if (ctx.body["email"].trim() === "") {
                why["email"] = messages.str(EErrors.empty, "email").toString();
            } else {
                if (emailIsValid(ctx.body["email"]) === false) why["email"] = messages.str(EErrors.invalid, "email").toString();
            }
            // Password
            if (ctx.body["password"].trim() === "") {
                why["password"] = messages.str(EErrors.empty, "password").toString();
            }
            // Repeat password
            if ((ctx.body["repeat"] as string).trim() === "") {
                why["repeat"] = messages.str(EErrors.empty, "repeat password").toString();
            } else {
                if (ctx.body["password"] != ctx.body.repeat) {
                    why["repeat"] = EErrors.passowrdDifferent;
                } else {
                    if (checkPassword(ctx.body["password"]) === false) why["password"] = messages.str(EErrors.invalid, "password").toString();
                }
            }
            if (Object.keys(why).length === 0) {
                try {
                    await userAccess.post(ctx._.service.name, ctx.body);
                } catch (error) {
                    logging.error(error);
                    ctx.redirect(`${ctx._.root()}/error`);
                }
            } else {
                const createHtml = new Login(ctx, {
                    url: "",
                    login: false,
                    body: ctx.request.body,
                    why: why
                });
                ctx.type = returnFormats.html.type;
                ctx.body = createHtml.toString();
            }
            return;
    }
    // Add new lora observation this is a special route without ahtorisatiaon to post (deveui and correct payload limit risks)
    if (
        (ctx._.user && ctx._.user.id > 0) ||
        !ctx._.service.extensions.includes(EExtensions.users) ||
        ctx.request.url.includes("/Lora") ||
        (ctx.request.headers["authorization"] && ctx.request.headers["authorization"] === config.getBrokerId())
    ) {
        if (ctx.request.type.startsWith("application/json") && Object.keys(ctx.body).length > 0) {
            const odataVisitor = await createOdata(ctx);
            if (odataVisitor)  {
                ctx._.odata = odataVisitor;
                const objectAccess = new apiAccess(ctx);
                const returnValue: IreturnResult | undefined | void = await objectAccess.post();
                if (returnValue) {
                    returnFormats.json.type;
                    if (returnValue.location) ctx.set("Location", returnValue.location);
                    ctx.status = EHttpCode.created;
                    ctx.body = returnValue.body;
                }
            } else ctx.throw(EHttpCode.badRequest);
        } else if (ctx.request.type.startsWith("multipart/")) {
            // If upload datas
            const getDatas = async (): Promise<object> => {
                console.log(logging.head("getDatas ...").to().text());
                return new Promise(async (resolve, reject) => {
                    await upload(ctx)
                        .then((data) => {
                            resolve(data);
                        })
                        .catch((data) => {
                            reject((data["state"] = "ERROR"));
                        });
                });
            };
            ctx.datas = await getDatas();
            const odataVisitor = await createOdata(ctx);
            if (odataVisitor) {
                ctx._.odata = odataVisitor;
                console.log(logging.head("POST FORM").to().text());
                const objectAccess = new apiAccess(ctx);
                const returnValue = await objectAccess.post();
                if (ctx.datas) fs.unlinkSync(ctx.datas["file" as keyof object]);
                if (returnValue) {
                    if (ctx.datas["source" as keyof object] == "query") {
                        const tempContext = await createQueryParams(ctx);
                        if (tempContext) {
                            const bodyQuery = new Query(ctx, {
                                url: "",
                                queryOptions: {
                                    ...tempContext,
                                    results: JSON.stringify({
                                        added: returnValue.total,
                                        value: returnValue.body
                                    })
                                }
                            });
                            ctx.set("script-src", "self");
                            ctx.set("Content-Security-Policy", "self");
                            ctx.type = returnFormats.html.type;
                            if (returnValue.location) ctx.set("Location ", returnValue.location);
                            ctx.body = bodyQuery.toString();
                        }
                    } else {
                        returnFormats.json.type;
                        ctx.status = EHttpCode.created;
                        if (returnValue.location) ctx.set("Location ", returnValue.location);
                        ctx.body = returnValue.body;
                    }
                } else {
                    ctx.throw(EHttpCode.badRequest);
                }
            }
        } else {
            // payload is malformed
            ctx.throw(EHttpCode.badRequest, { details: EErrors.payloadIsMalformed });
        }
    } else ctx.throw(EHttpCode.Unauthorized);
});

protectedRoutes.patch("/*path", async (ctx) => {
    if ((!ctx._.service.extensions.includes(EExtensions.users) || isAllowedTo(ctx, EUserRights.Post) === true) && Object.keys(ctx.body).length > 0) {
        const odataVisitor = await createOdata(ctx);
        if (odataVisitor) {
            ctx._.odata = odataVisitor;
            console.log(logging.head("PATCH").to().text());
            const objectAccess = new apiAccess(ctx);
            if (ctx._.odata.id) {
                const returnValue: IreturnResult | undefined | void = await objectAccess.update();
                if (returnValue) {
                    returnFormats.json.type;
                    ctx.status = EHttpCode.created;
                    ctx.body = returnValue.body;
                    if (returnValue.location) ctx.set("Location", returnValue.location);
                }
            } else {
                ctx.throw(EHttpCode.badRequest, { detail: EErrors.idRequired });
            }
        } else {
            ctx.throw(EHttpCode.notFound);
        }
    } else {
        ctx.throw(EHttpCode.Unauthorized);
    }
});

protectedRoutes.delete("/*path", async (ctx) => {
    if (!ctx._.service.extensions.includes(EExtensions.users) || isAllowedTo(ctx, EUserRights.Delete) === true) {
        const odataVisitor = await createOdata(ctx);
        if (odataVisitor) {
            ctx._.odata = odataVisitor;
            console.log(logging.head("DELETE").to().text());
            const objectAccess = new apiAccess(ctx);
            if (!ctx._.odata.id) ctx.throw(EHttpCode.badRequest, { detail: EErrors.idRequired });
            const returnValue = await objectAccess.delete(ctx._.odata.id);
            if (returnValue && returnValue.body && +returnValue.body > 0) {
                returnFormats.json.type;
                ctx.status = EHttpCode.noContent;
            } else ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: EErrors.noId + ctx._.odata.id });
        } else {
            ctx.throw(EHttpCode.notFound);
        }
    } else {
        ctx.throw(EHttpCode.Unauthorized);
    }
});
