/**
 * decodeToken
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import jsonwebtoken from "jsonwebtoken";
import { IuserToken, koaContext } from "../types";
import { blankUserToken } from "../types/userToken";
import { logging } from "../log";
import { _DEBUG } from "../constants";

/**
 * decode token from koa context
 * @param ctx koaContext
 * @returns IuserToken
 */

export const decodeToken = (ctx: koaContext): IuserToken => {
    console.log(logging.whereIam(new Error().stack));
    if (ctx.request.hasOwnProperty("token")) {
        const token = jsonwebtoken.decode(ctx.request["token" as keyof object]);
        if (token && token["data" as keyof object]["id"] > 0)
            return Object.freeze({
                id: +token["data" as keyof object]["id"],
                username: token["data" as keyof object]["username"],
                password: token["data" as keyof object]["password"],
                PDCUAS: token["data" as keyof object]["PDCUAS"]
            });
    }
    return blankUserToken;
};
