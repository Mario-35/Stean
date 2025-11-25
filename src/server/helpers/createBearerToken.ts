/**
 * createBearerToken
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

// import cookieParser from "cookie-parser";
import { koaContext } from "../types";
import { EConstant, EErrors, EHttpCode } from "../enums";
import { paths } from "../paths";

export const createBearerToken = (ctx: koaContext) => {
    const queryKey = "access_token";
    const bodyKey = "access_token";
    const headerKey = "Bearer";
    const cookiePresent = true;

    if (cookiePresent && !paths.key) {
        throw new Error(EErrors.tokenMissing);
    }

    const { body, header, query } = ctx.request;

    let count = 0;
    let token: string | string[] | undefined = undefined;

    if (query && query[queryKey]) {
        token = query[queryKey];
        count += 1;
    }
    
    if (body && body[bodyKey as keyof object]) {
        token = body[bodyKey as keyof object];
        count += 1;
    }
    
    if (header) {
        if (header.authorization) {
            const parts = header.authorization.split(" ");
            if (parts.length === 2 && parts[0] === headerKey) {
                [, token] = parts;
                count += 1;
            }
        }

        // cookie
        if (cookiePresent && header.cookie) {
            const plainCookie = ctx.cookies.get(EConstant.appName); // seeks the key
            if (plainCookie) {
                token = plainCookie;
                count += 1;                
            }
        }
    }

    // RFC6750 states the access_token MUST NOT be provided
    // in more than one place in a single request.
    if (count > 1) {
        ctx.throw(EHttpCode.badRequest, "token_invalid", {
            message: EErrors.tokenInvalid
        });
    }
    // @ts-ignore
    if (token) ctx.request["token"] = token;
};
