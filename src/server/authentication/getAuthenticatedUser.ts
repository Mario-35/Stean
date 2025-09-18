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
import { blankUser } from "../views/helpers/";

/**
 * return Iuser from koa context
 * @param ctx koaContext
 * @returns Iuser
 */

export const getAuthenticatedUser = async (ctx: koaContext): Promise<Iuser | undefined> => {
    console.log(logging.whereIam(new Error().stack).toString());
    if (!ctx.service.extensions.includes(EExtensions.users)) return blankUser(ctx.service);
    const token = decodeToken(ctx);
    if (token && token.id > 0) {
        const user = await userAccess.getSingle(ctx.service.name, token.id);
        if (user && token.password.match(decrypt(user["password"])) !== null) return Object.freeze(user);
    }
    return undefined;
};
