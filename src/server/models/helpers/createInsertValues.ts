/**
 * createInsertValues
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- createInsertValues -----------------------------------!\n");

import { formatColumnValue, relationInfos } from ".";
import { models } from "..";
import { ESCAPE_SIMPLE_QUOTE } from "../../constants";
import { doubleQuotesString, simpleQuotesString, removeFirstEndDoubleQuotes } from "../../helpers";
import { log } from "../../log";
import { Iservice } from "../../types";

// create postgresSql 
export function createInsertValues(service: Iservice , input: Record<string, any>, entityName?: string): string  {
    console.log(log.whereIam());
    if (service && input) {
        const keys:string[] = [];
        const values:string[] = [];            
        if (entityName) {
            const entity = models.getEntity(service, entityName);
            if (!entity) return "";
            Object.keys(input).forEach((e: string ) => {
                if (input[e] && entity.columns[e]) {
                  const temp = formatColumnValue(e, input[e], entity.columns[e].type);
                  if (temp) {
                    keys.push(doubleQuotesString(e));
                    values.push(temp);
                  }
                } else if (input[e] && entity.relations[e]) {
                    const relation = relationInfos(service, entity.name, e);
                    
                  if (entity.columns[relation.column]) {
                    const temp = formatColumnValue(relation.column, input[e], entity.columns[relation.column].type);
                    if (temp) {
                      keys.push(doubleQuotesString(relation.column));
                      values.push(temp);
                    }  
                  }                  
                }
              });
            } else {
              Object.keys(input).forEach((e: string) => {
                if (input[e]) {
                  if (input[e].startsWith && input[e].startsWith('"{') && input[e].endsWith('}"')) input[e] = removeFirstEndDoubleQuotes(input[e]);
                  else if (input[e].startsWith && input[e].startsWith('{"@iot.name"')) input[e] = `(SELECT "id" FROM "${e.split("_")[0]}" WHERE "name" = '${JSON.parse(removeFirstEndDoubleQuotes(input[e]))["@iot.name"]}')`;
                  keys.push(doubleQuotesString(e));
                  values.push(typeof input[e] === "string" 
                                              ? input[e].startsWith("(SELECT")
                                              ? input[e]
                                              : simpleQuotesString(ESCAPE_SIMPLE_QUOTE(input[e].trim())) 
                                              : e === "result" ? `'{"value": ${input[e]}}'::jsonb`: ESCAPE_SIMPLE_QUOTE(input[e].trim()));
              }
          });
        }          
        return `(${keys.join()}) VALUES (${values.join()})`;  
    }
    return "";
};