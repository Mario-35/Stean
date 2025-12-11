/**
 * getAuthenticatedUser
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { decodeToken } from ".";
import { userAccess } from "../db/dataAccess";
import { EExtensions } from "../enums";
import { decrypt } from "../helpers";
import { logging } from "../log";
import { Iuser, koaContext } from "../types";

/**
 * return Iuser from koa context
 * @param ctx koaContext
 * @returns Iuser
 */

export const getAuthenticatedUser = async (ctx: koaContext): Promise<Iuser | undefined> => {
    console.log(logging.whereIam(new Error().stack));
    if (!ctx._.inExtension(EExtensions.users)) return ctx._.blankUser();
    const token = decodeToken(ctx);
    if (token && token.id > 0) {
        const user = await userAccess.getSingle(ctx._.service.name, token.id);
        if (user && token.password.match(decrypt(user["password"])) !== null) return Object.freeze(user);
    }
    return undefined;
};
