/**
 * createInsertValues
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { formatColumnValue, relationInfos } from ".";
import { models } from "..";
import { ESCAPE_SIMPLE_QUOTE } from "../../constants";
import { doubleQuotesString, simpleQuotesString, removeFirstEndDoubleQuotes } from "../../helpers";
import { log } from "../../log";
import { koaContext } from "../../types";
/**
 * 
 * @param service Service
 * @param input JSON
 * @param entityName string
 * @returns string
*/
export function createInsertValues(ctx: koaContext | undefined, input: Record<string, any>, entityName?: string): string  {
    console.log(log.whereIam());
    if (input) {
        const keys:string[] = [];
        const values:string[] = [];            
        if (ctx && entityName) {
            const entity = models.getEntity(ctx.service, entityName);
            if (!entity) return "";
            Object.keys(input).forEach((elem: string ) => {
                if (input[elem] && entity.columns[elem]) {
                  const temp = formatColumnValue(elem, input[elem], entity.columns[elem]);
                  if (temp) {
                    keys.push(doubleQuotesString(elem));
                    values.push(temp);
                  }
                } else if (input[elem] && entity.relations[elem]) {
                  const relation = relationInfos(ctx, entity.name, elem);
                  if (entity.columns[relation.column]) {
                    const temp = formatColumnValue(relation.column, input[elem], entity.columns[relation.column]);
                    if (temp) {
                      keys.push(doubleQuotesString(relation.column));
                      values.push(temp);
                    }  
                  }                  
                }
              });
            } else {
              Object.keys(input).forEach((elem: string) => {
                
                if (input[elem]) {
                  if (input[elem].startsWith && input[elem].startsWith('"{') && input[elem].endsWith('}"')) 
                    {                      
                      input[elem] = removeFirstEndDoubleQuotes(input[elem].replace(/\\"+/g, ""));
                    } else if (input[elem].startsWith && input[elem].startsWith('{"@iot.name"')) {
                      input[elem] = `(SELECT "id" FROM "${elem.split("_")[0]}" WHERE "name" = '${JSON.parse(removeFirstEndDoubleQuotes(input[elem]))["@iot.name"]}')`;
                    }
                  keys.push(doubleQuotesString(elem));
                  values.push(typeof input[elem] === "string" 
                    ? input[elem].startsWith("(SELECT")
                    ? input[elem]
                    : simpleQuotesString(ESCAPE_SIMPLE_QUOTE(input[elem].trim())) 
                    : elem === "result" ? `'{"value": ${input[elem]}}'::jsonb`: ESCAPE_SIMPLE_QUOTE(input[elem].trim()));
              }
          });
        }          
        return `(${keys.join()}) VALUES (${values.join()})`;  
    }
    return "";
};