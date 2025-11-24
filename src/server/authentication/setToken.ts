/**
 * setToken
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant } from "../enums";
import { koaContext } from "../types";


export function setToken(ctx: koaContext, token: string): void {
    ctx.cookies.set(EConstant.appName, token, { httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'lax' });
    // @ts-ignore
    ctx.request["token"] = token;
};
