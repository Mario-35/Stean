/**
 * Helpers for user admin.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Helpers for user admin. -----------------------------------!");

import { config } from "../../configuration";
import { ADMIN, setDebug } from "../../constants";
import { EFrom, EVersion } from "../../enums";
import { cleanUrl } from "../../helpers";
import { log } from "../../log";
import { errors } from "../../messages";
import { IdecodedUrl, koaContext  } from "../../types";

//   service root URI       resource path       query options
// __________|_________________ __|________________ ___|______________
//                             \                   \                  \
// http://example.org:8029/v1.1/Things(1)/Locations?$orderby=ID&$top=10
// _____/________________/____/___________________/___________________/
//   |           |         |              |                |
// protocol     host    version        pathname          search

export const decodeUrl = (ctx: koaContext, input?: string): IdecodedUrl | undefined => {
  // get input
  input = input || ctx.href; 
  input = input;
  // debug mode
  setDebug(input.includes("?$debug=true") || input.includes("&$debug=true"));
  console.log(log.whereIam());
  // decode url
  const url = new URL(cleanUrl(input.replace("$debug=true", "").normalize("NFD") .replace(/[\u0300-\u036f]/g, ""))); 
  // get configName from port    
  let configName:  string | undefined = undefined;
  // split path
  // path[0] : service
  // path[1] : version
  // path[...] : path
  const paths = url.pathname.split('/').filter(e => e != "");  
  // no service
  if (paths[0]) 
    configName = configName || config.getConfigNameFromName(paths[0].toLowerCase());
    else throw new Error(errors.noNameIdentified);
  // get getLinkBase from service
  if (configName) {
    const LinkBase = config.getInfos(ctx, configName);
    let idStr: string | undefined = undefined;
    let id: string | 0 = 0;
    // if nothing ===> root
    let path = "/";
    // id string or number
    if (paths[2]) {
      id = (paths[2].includes("(")) ?  paths[2].split("(")[1].split(")")[0] : 0;
      idStr = (isNaN(+id)) ? String(id).toLocaleUpperCase() : undefined;
      path = paths.slice(2).join("/");
    }  
    // result
    return  {
      search: url.search,
      service: paths[0],
      version: paths[0] === ADMIN ? EVersion.v1_0 : paths[1],
      path: idStr ? path.replace(String(id), '0') : path,
      id: (isNaN(+id)) ? BigInt(0) : BigInt(id),
      idStr: idStr,
      configName: configName,
      linkbase: LinkBase.linkBase,
      root: LinkBase.root,
      from: ctx.request.headers.host === "mqtt" ? EFrom.mqtt : EFrom.unknown
    }  
  }
  
}