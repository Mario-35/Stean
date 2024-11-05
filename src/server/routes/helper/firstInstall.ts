/**
 * firstInstall
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import postgres from "postgres";
import { config } from "../../configuration";
import { returnFormats } from "../../helpers";
import { koaContext, IdecodedUrl, IKeyString } from "../../types";
import { Admin, First, Service } from "../../views";
import { EHttpCode } from "../../enums";

function formatConfig(input: Record<string, any>, admin?: boolean): Record<string, any> {
  console.log("-----------------------------------formatConfig----------------------------------------------");
  console.log(input);
  const name = admin ? "admin" : input.name.toLowerCase();
  return {
      "name": name,
      "ports": admin ?  {
        "http": 8029,
        "tcp": 9000,
        "ws": 1883
    } : 8029,
      "pg": {
          "host": input["host"],
          "port": input["port"],
          "user": admin ? input["adminname"] : name,
          "password": admin ? input["adminpassword"] :  input["password"],
          "database": admin ? "postgres" : input["database"].toLowerCase(),
          "retry": 2
      },
      "apiVersion": input["version"],
      "date_format": "DD/MM/YYYY hh:mi:ss",
      "webSite": "no web site",
      "nb_page": 200,
      "alias": [ "" ],
      "extensions": admin ? ["base"] : `base,${input["extensions"] ? String(input["extensions"]) : ''}`.split(","),
      "options": admin ? [] : input["options"] ? String(input["options"]).split(",") : []
  };
} 

export async function firstInstall(ctx: koaContext): Promise<IdecodedUrl | undefined>  {
  
  // If Configuration file Not exist first Install
  const why: IKeyString = {};
  console.log(ctx.request.body);
  console.log("-----------------------------------firstInstall----------------------------------------------");
  const src = JSON.parse(JSON.stringify(ctx.request.body, null, 2));
  console.log(src);

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

  function returnBody(connection: boolean) {
    const obj = { login: false, url: ctx.request.url, body: ctx.request.body, why: why };
    const bodyFirst = connection === true
        ? new Service(ctx, obj)
        : (config.configFileExist() === false) 
          ? new First(ctx, obj)
          : new Admin(ctx, obj);
    ctx.type = returnFormats.html.type;
    ctx.body = bodyFirst.toString();
    return undefined;
  } 

  if (src["_src"]) {
    ["host", "port", "adminname", "adminpassword", "database", "extensions", "options"].forEach(e => { if (src[e]) why[e] = src[e]; });
    if (src["name"]) why["name"] = src["name"].toLowerCase();

    switch (src["_src"]) {
      case "_admin":       
        if (verifyItems(src, ["host", "adminname", "port", "adminpassword"]) === false) {
          const testConnection = await postgres( `postgres://${src["adminname"]}:${src["adminpassword"]}@${src["host"]}:${src["port"]}/postgres`,
            {})`select 1+1 AS result`.then(async () => true)
          .catch((error: Error) => {
            ctx.throw(EHttpCode.Unauthorized);
          });
          if (testConnection === true) return returnBody(testConnection);
        } else {
          return returnBody(false);      
        }

      case "_first":
        console.log("avant ____________________________");
        console.log(src);
        if (verifyItems(src, ["host", "adminname", "port", "adminpassword", "repeat"]) === false) {
          console.log("apres ____________________________");
          console.log(src);
          if (src["adminpassword"] === src["repeat"]) {
            const testConnection = await postgres( `postgres://${src["adminname"]}:${src["adminpassword"]}@${src["host"]}:${src["port"]}/postgres`,
              {})`select 1+1 AS result`.then(async () => true)
            .catch((error: Error) => {
              why["_error"] = error.message;
              return false;
            });
            if (testConnection === true) 
              return returnBody(testConnection);
            
          } else {
            why["repeat"] = "repeat password HAVE TO be same as pasword";
            return returnBody(false);
          }
        } else {
          return returnBody(false);      
        }

      case "_createService":      
        if (verifyItems(src, ["host", "port", "adminname", "adminpassword", "name", "database", "version", "password", "repeat"]) === false) {
          if (src["name"].toUpperCase() === "POSTGRES") {
            why["name"] = "name must not be postgres";
            return returnBody(false);
          }
          const confJson: Record<string, any> = {
            "admin": formatConfig(src, true)
          }
          confJson[src["name"].toLowerCase()] = formatConfig(src);
          const returnUrl = `${ctx.request.origin}/${src["name"].toLowerCase()}/${src["version"]}`;          
          if (await config.init(JSON.stringify(confJson, null, 2))) ctx.redirect(returnUrl);
          return returnBody(true);
        } else {
          return returnBody(true);
        }
         
      case "_addService":
        if (verifyItems(src, ["name", "database", "version", "password", "repeat"]) === false) {
          if (src["name"].toUpperCase() === "POSTGRES") {
            why["name"] = "name must not be postgres";
            return returnBody(false);
          }      
        const returnUrl = `${ctx.request.origin}/${src["name"].toLowerCase()}/${src["version"]}`;
        if (await config.addConfig(formatConfig(src))) ctx.redirect(returnUrl);
        return returnBody(true);
      } else {
        return returnBody(true);
      }
    }
  }

  return returnBody(false);
}
