/**
 * exportToJson
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- exportToJson -----------------------------------!");

import { serverConfig } from "../../configuration";
import { addDoubleQuotes, asyncForEach, getUrlKey, hidePassword, removeEmpty } from "../../helpers";
import { koaContext } from "../../types";

export const exportToJson = async (ctx: koaContext) => {
  // get config with hidden password
  const result: Record<string, any> = { "create": hidePassword(serverConfig.getConfig(ctx.config.name))};
  // get entites list
  const entities = Object.keys(ctx.model).filter((e: string) => ctx.model[e].createOrder > 0);
  // add ThingsLocations
  entities.push(ctx.model.ThingsLocations.name);
  // async loop
  await asyncForEach(
    // Entities list
    entities,
    // Action
    async (entity: string) => {
      if (Object.keys(ctx.model[entity].columns) && ctx.model[entity].table != "") {
        // Create columns list
        const columnList = Object.keys(ctx.model[entity].columns).filter((e: string) => e != "id" && !e.endsWith('_id') && e[0] != '_' && ctx.model[entity].columns[e].create != "");
        // Create relations list
        const rels = [""];
        Object.keys(ctx.model[entity].columns).filter((e: string) => e.endsWith('_id')).forEach((e: string) => {
          const table = e.split("_")[0];
          rels.push(`CASE WHEN "${e}" ISNULL THEN NULL ELSE JSON_BUILD_OBJECT('@iot.name', (SELECT REPLACE (name, '''', '''''') FROM "${table}" WHERE "${table}"."id" = ${e} LIMIT 1)) END AS "${e}"`);          
        });   
        const columnListWithQuotes = columnList.map(e => addDoubleQuotes(e)).join();        
        if (columnListWithQuotes.length <= 1) rels.shift();
        // Execute query        
        const tempResult = await serverConfig.connection(ctx.config.name).unsafe(`select ${columnListWithQuotes}${rels.length > 1 ? rels.join() : ""}\n FROM "${ctx.model[entity].table}" LIMIT ${getUrlKey(ctx.request.url, "limit") || ctx.config.nb_page}`);  
        // remove null and store datas result 
        result[entity] = removeEmpty(tempResult);        
      }  
  });
  delete result["FeaturesOfInterest"][0];
  return result;
};