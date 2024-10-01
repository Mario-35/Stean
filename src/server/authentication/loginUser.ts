/**
 * loginUser
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- loginUser -----------------------------------!\n");

import { createToken } from ".";
import { config } from "../configuration";
import { EHttpCode } from "../enums";
import { decrypt } from "../helpers";
import { Iuser, koaContext } from "../types";

const getUser = async (configName: string, username: string,  password: string): Promise<Iuser | undefined> => {
  const query = await config.connection(configName)<Iuser[]>`SELECT * FROM "user" WHERE username = ${username} LIMIT 1`;
  if (query.length === 1) {  
    const user:Iuser = { ... query[0] } 
    if ( user && password.trim() === decrypt(user.password) ) {
      const token = createToken(user, password);
      user.token = token;      
      return Object.freeze(user);
    }
  }
};

// ctx for koa connection and set undefined for mqtt
export const loginUser = async ( ctx: koaContext | undefined, login?: {configName: string, username: string,  password: string} ): Promise<Iuser | undefined> => {
  if (login) {    
    return await getUser(login.configName, login.username, login.password);
  } else if (ctx) {
    const body: Record<string, any> = ctx.request.body as Record<string, any>;    
    if (body["username"] && body["password"]) {   
      const user = await getUser(ctx.config.name, body["username"], body["password"]);
      if (user) {
        ctx.cookies.set("jwt-session", user["token" as keyof object]);
        return user;
      } else ctx.throw(EHttpCode.Unauthorized);
    } else ctx.throw(EHttpCode.Unauthorized);
  }
};
