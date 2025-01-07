/**
 * adminConnection connection page.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import postgres from "postgres";
import { IKeyString, koaContext } from "../../types";
import { formatConfig } from ".";
import { config } from "../../configuration";
import { encrypt } from "../../helpers";

export async function adminConnectPg(ctx: koaContext): Promise<string | undefined> {
  const why: IKeyString = {};
  // test if connection is in context  
  if (ctx.request.body && ctx.request.body["_connection" as keyof object]) return ctx.request.body["_connection" as keyof object];

  const src = JSON.parse(JSON.stringify(ctx.request.body, null, 2));

  function verifyItems(src: any, search: string[]): boolean {
    let error = false;
    function verifyItem(search: string) {
      if (src.hasOwnProperty(search)) return;
      why[search] = `${search} not define`;
      error = true;
    }
    search.forEach(e => {
      verifyItem(e);
    });
    return error;
  }   

  if (verifyItems(src, ["optName", "optVersion", "optPassword", "optRepeat","datas"]) === false) {
    if (await config.addConfig(JSON.parse(src["datas"]))) ctx.redirect(`${ctx.request.origin}/admin`);
  } if (verifyItems(src, ["host", "adminname", "port", "adminpassword"]) === true) return;
    return await postgres( `postgres://${src["adminname"]}:${src["adminpassword"]}@${src["host"]}:${src["port"]}/postgres`, {})`select 1+1 AS result`.then(async () => {
      if (config.configFileExist() === false) 
        if (await config.initConfig(JSON.stringify({ "admin": formatConfig(src, true) }, null, 2))) ctx.redirect(`${ctx.request.origin}/admin`);
          return encrypt(JSON.stringify({login: true, "host": src["host"], "adminname": src["adminname"], "port": src["port"], "adminpassword": src["adminpassword"]}));
  }).catch((error: Error) => {
    return `[error]${error.message}`;
  });
}