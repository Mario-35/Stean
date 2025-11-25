/**
 * setToken
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { espireTime } from "../constants";
import { EConstant } from "../enums";
import { koaContext } from "../types";

/**
 * 
 * @param ctx koaContext 
 * @param token string token
 */
export function setToken(ctx: koaContext, token: string): void {
    ctx.cookies.set(EConstant.appName, token, { httpOnly: false, maxAge: espireTime(), sameSite: 'lax' });
    // @ts-ignore
    ctx.request["token"] = token;
};
