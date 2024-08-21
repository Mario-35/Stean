/**
 * decodeToken
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- decodeToken -----------------------------------!");

import jsonwebtoken from "jsonwebtoken";
import { IuserToken, keyobj, koaContext } from "../types";
import { blankUserToken } from "../types/userToken";

export const decodeToken = (ctx: koaContext): IuserToken => {
  if (ctx.request.hasOwnProperty("token")) {
    const token = jsonwebtoken.decode(ctx.request["token" as keyobj]);    
    if (token && token["data" as keyobj]["id"] > 0)
      return Object.freeze({
         id: +token["data" as keyobj]["id"], 
         username: token["data" as keyobj]["username"], 
         password: token["data" as keyobj]["password"], 
         PDCUAS: token["data" as keyobj]["PDCUAS"], });
  }
  return blankUserToken;
};
