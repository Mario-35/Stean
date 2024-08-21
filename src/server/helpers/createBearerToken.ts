/**
 * createBearerToken
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- createBearerToken -----------------------------------!");

import cookieParser from "cookie-parser";
import { APP_KEY } from "../constants";
import { errors } from "../messages";
import cookieModule from "cookie";
import { keyobj, koaContext } from "../types";

export const createBearerToken = (ctx: koaContext) => {  
    const getCookie = (serializedCookies: string, key: string) => cookieModule.parse(serializedCookies)[key] ?? false;
    const queryKey = "access_token";
    const bodyKey = "access_token";
    const headerKey = "Bearer";
    const cookie = true;
  
    if (cookie && !APP_KEY) {
      throw new Error(errors.tokenMissing);
    }
  
    const { body, header, query } = ctx.request;
  
    let count = 0;
    let token:string | string[] | undefined = undefined;    
  
    if (query && query[queryKey]) {
      token = query[queryKey];
      count += 1;
    }
    if (body && body[bodyKey as keyobj]) {
      token = body[bodyKey as keyobj];
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
      if (cookie && header.cookie) {
        const plainCookie = getCookie(header.cookie, "jwt-session"); // seeks the key
        if (plainCookie) {
          
          const cookieToken = cookieParser.signedCookie(plainCookie, APP_KEY);
          
          if (cookieToken) {
            token = cookieToken;
            count += 1;
          }
        }
      }
    }
    
    // RFC6750 states the access_token MUST NOT be provided
    // in more than one place in a single request.
    if (count > 1) {
      ctx.throw(400, "token_invalid", {
        message: errors.tokenInvalid,
      });
    }
  // @ts-ignore
  if (token) ctx.request["token"] = token;
};