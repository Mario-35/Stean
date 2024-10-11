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
import { returnFormats, unique } from "../../helpers";
import { koaContext, IdecodedUrl, IKeyString } from "../../types";
import { Admin, First, Service } from "../../views";
import { EHttpCode } from "../../enums";
export async function firstInstall(ctx: koaContext): Promise<IdecodedUrl | undefined>  { 
  
  // If Configuration file Not exist first Install
  const why: IKeyString = {};
  const src = JSON.parse(JSON.stringify(ctx.request.body, null, 2));
  function verifyItems(src: any, search: string[]): boolean {
    let error = false;
    function verifyItem(search: string) {
      if (src[search]) return;
      why[search] = `${search.replace("_","")} not define`;
      error = true;
    }
    search.forEach(e => {
      verifyItem(e);
    });
    return error;
  }
  function returnBody(connection: boolean) {
    const bodyFirst = 
      connection === true
        ? new Service(ctx, { login: false , url: ctx.request.url, body: ctx.request.body, why: why})
        : (config.configFileExist() === false) 
          ? new First(ctx, { login: false , url: ctx.request.url, body: ctx.request.body, why: why})
          : new Admin(ctx, { login: false , url: ctx.request.url, body: ctx.request.body, why: why});
    ctx.type = returnFormats.html.type;
    ctx.body = bodyFirst.toString();
    return undefined;
  }  
  if (src["_src"]) {        
    if (src["_host"]) why["_host"] = src["_host"];
    if (src["_username"]) why["_username"] = src["_username"];
    if (src["_password"]) why["_password"] = src["_password"];
    if (src["_src"] === "_admin") {          
      if (verifyItems(src, ["host", "username", "password"]) === false) {
        const testConnection = await postgres( `postgres://${src["username"]}:${src["password"]}@${src["host"]}:5432/postgres`,
          {})`select 1+1 AS result`.then(async () => true)
        .catch((error: Error) => {
          ctx.throw(EHttpCode.Unauthorized);
          // why["_error"] = error.message;
          // return false;
        });
        if (testConnection === true) {
          why["_host"] = src["host"];
          why["_username"] = src["username"];
          why["_password"] = src["password"];
        }
        return returnBody(testConnection);
      } else {
        return returnBody(false);      
      }
    } else if (src["_src"] === "_first") {          
      if (verifyItems(src, ["host", "username", "password", "repeat"]) === false) {
        if (src["password"] === src["repeat"]) {
          const testConnection = await postgres( `postgres://${src["username"]}:${src["password"]}@${src["host"]}:5432/postgres`,
            {})`select 1+1 AS result`.then(async () => true)
          .catch((error: Error) => {
            why["_error"] = error.message;
            return false;
          });
          if (testConnection === true) {
            why["_host"] = src["host"];
            why["_username"] = src["username"];
            why["_password"] = src["password"];
          }
          return returnBody(testConnection);
        } else {
          why["repeat"] = "repeat password HAVE TO be same as pasword";
          return returnBody(false);
        }
      } else {
        return returnBody(false);      
      }
    } else if (src["_src"] === "_createService") {
      const src = JSON.parse(JSON.stringify(ctx.request.body, null, 2));      
      const ext: string[]= ["base"];
      const opt: string[]= [""];
      src["extensions"] = unique(ext);
      src["options"] =  unique(opt);   
      src["version"] = src["version"].startsWith("v") ? src["version"].replace("v","") : src["version"];
      if (verifyItems(src, ["_host", "_username",  "_password", "password", "host", "name", "port", "database", "extensions", "options"]) === false) {
        const confJson: Record<string, any> = {
          "admin": {
              "name": "admin",
              "ports": {
                  "http": 8029,
                  "tcp": 9000,
                  "ws": 1883
              },
              "pg": {
                  "host": src["_host"],
                  "port": 5432,
                  "user": src["_username"],
                  "password": src["_password"],
                  "database": "postgres",
                  "retry": 2
              },
              "apiVersion": src["version"],
              "date_format": "DD/MM/YYYY hh:mi:ss",
              "webSite": "no web site",
              "nb_page": 200,
              "alias": [ "" ],
              "options": [],
              "extensions": ["base"]
          }
        };
        confJson[src["name"]] = {
          "name": src["name"],
          "port": 8029,
          "pg": {
              "host": src["host"],
              "port": 5432,
              "user": src["username"],
              "password": src["password"],
              "database": src["database"] || src["name"],
              "retry": 2
          },
          "apiVersion": src["version"],
          "date_format": "DD/MM/YYYY hh:mi:ss",
          "webSite": "",
          "nb_page": 200,
          "extensions": src["extensions"],
          "options": src["options"]
        }
        await config.init(JSON.stringify(confJson, null, 2));      
      } else {
        returnBody(true);
      }
      return
    } else if (src["_src"] === "_addService") {
      const src = JSON.parse(JSON.stringify(ctx.request.body, null, 2));      
      const ext: string[]= ["base"];
      const opt: string[]= [""];
      src["extensions"] = unique(ext);
      src["options"] =  unique(opt);   
      src["version"] = src["version"].startsWith("v") ? src["version"].replace("v","") : src["version"];
      if (verifyItems(src, ["_host", "_username",  "_password", "password", "host", "name", "port", "database", "extensions", "options"]) === false) {
        const confJson: Record<string, any> = {
          "name": src["name"],
          "port": 8029,
          "pg": {
              "host": src["host"],
              "port": 5432,
              "user": src["username"],
              "password": src["password"],
              "database": src["database"] || src["name"],
              "retry": 2
          },
          "apiVersion": src["version"],
          "date_format": "DD/MM/YYYY hh:mi:ss",
          "webSite": "",
          "nb_page": 200,
          "extensions": src["extensions"],
          "options": src["options"]
        }
        await config.addConfig(confJson);     
        if (ctx.decodedUrl && ctx.decodedUrl.origin) ctx.redirect(`${ctx.decodedUrl.origin}/${src["name"]}/${src["version"]}`);  
      } else {
        returnBody(true);
      }
      return
    }
  }
  returnBody(false);
  return;
}
