/**
 * doSomeWorkAfterCreateAst
 *
 * @copyright 2022-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- doSomeWorkAfterCreateAst -----------------------------------!");

import { RootPgVisitor } from "..";
import { config } from "../../../configuration";
import { multiDatastreamKeys, resultKeys, multiDatastreamUoM } from "../../../db/queries";
import { datastreamUoM } from "../../../db/queries/datastreamUoM";
import { EExtensions } from "../../../enums";
import { returnFormats, isObservation } from "../../../helpers";
import { koaContext } from "../../../types";

export const doSomeWorkAfterCreateAst = async (input: RootPgVisitor, ctx: koaContext) => {
  if (input.entity && input.splitResult && input.splitResult[0].toUpperCase() == "ALL" && input.parentId && <bigint>input.parentId > 0) {
    const temp = await config.connection(ctx.config.name).unsafe(`${multiDatastreamKeys(input.parentId)}`);
    input.splitResult = temp[0]["keys"];
    
    const col = input.valueskeys === true ? "result->'valueskeys'" : "result->'value'"; 
    await config.connection(ctx.config.name).unsafe(resultKeys(col, input)).then((res) => {
      if (res.length > 0) input.columnSpecials["result"] = res.map(e => `${col}->'${e.k}' AS "${e.k}"`);
    });
  } else  if (input.returnFormat === returnFormats.csv 
    && input.entity
    && isObservation(input)
    && input.parentEntity?.name?.endsWith('atastreams') 
    && input.parentId 
    && <bigint>input.parentId > 0) {
      if (input.ctx.config.extensions.includes(EExtensions.file)) {
        await config.connection(ctx.config.name).unsafe(datastreamUoM(input)).then((res) => {
          input.columnSpecials["result"] = res[0].keys.split(",").map((e: string) => `("result"->>'value')::json->'${e}' AS "${e}"`);
        });        
      } else if (input.parentEntity.name === "Datastreams") input.columnSpecials["result"]  = [`"result"->'value'`];
      if (input.parentEntity.name === "MultiDatastreams") {
        console.log(multiDatastreamUoM(input));
        
        await config.connection(ctx.config.name).unsafe(multiDatastreamUoM(input)).then((res) => {
          if (res[0] && res[0].keys && res[0].keys.map)
            input.columnSpecials["result"]  =  res[0].keys.map((e: string) => `("result"->>'valueskeys')::json->'${e}' AS "${e}"`);
        });
      }   
  }  
};