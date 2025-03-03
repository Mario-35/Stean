/**
 * userAuthenticated
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { decodeToken } from ".";
import { EExtensions } from "../enums";
import { log } from "../log";
import { koaContext } from "../types";

/**
 * test if user is authenticated
 * @param ctx koaContext
 * @returns boolean
 */

export const userAuthenticated = (ctx: koaContext): boolean => {
    console.log(log.whereIam());
    if (ctx.service && ctx.service.extensions.includes(EExtensions.users)) {
        const token = decodeToken(ctx);
        return token && +token.id > 0;
    } else return true;
};
