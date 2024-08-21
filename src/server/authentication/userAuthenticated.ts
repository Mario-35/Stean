/**
 * userAuthenticated
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- userAuthenticated -----------------------------------!");

import { decodeToken } from ".";
import { EExtensions } from "../enums";
import { koaContext } from "../types";

export const userAuthenticated = (ctx: koaContext): boolean => {      
  if (ctx.config.extensions.includes(EExtensions.users)) {
    const token = decodeToken(ctx);
    return (token && +token.id > 0);
  } else return true;
};
