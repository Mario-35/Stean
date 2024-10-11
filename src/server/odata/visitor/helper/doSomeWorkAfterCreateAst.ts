/**
 * doSomeWorkAfterCreateAst
 *
 * @copyright 2022-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { RootPgVisitor } from "..";
import { config } from "../../../configuration";
import { multiDatastreamKeys, resultKeys, multiDatastreamUoM } from "../../../db/queries";
import { datastreamUoM } from "../../../db/queries/datastreamUoM";
import { returnFormats, isObservation } from "../../../helpers";
import { isFile } from "../../../helpers/tests";
import { log } from "../../../log";
import { koaContext } from "../../../types";
export const doSomeWorkAfterCreateAst = async (input: RootPgVisitor, ctx: koaContext) => {
  console.log(log.whereIam());
  if (isObservation(input) ) {
  }
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
      if (isFile(input.ctx)) {
        await config.connection(ctx.config.name).unsafe(datastreamUoM(input)).then((res) => {
        //  input.columnSpecials["result"] = res[0].keys.split(",").map((e: string) => `("result"->>'value')::json->'${e}' AS "${e}"`);
         input.columnSpecials["result"] = [`("result"->>'value')::json`];
        });        
      } else if (input.parentEntity.name === "Datastreams") input.columnSpecials["result"]  = [`"result"->'value' AS result`];
      if (input.parentEntity.name === "MultiDatastreams") {        
        await config.connection(ctx.config.name).unsafe(multiDatastreamUoM(input)).then((res) => {
          if (res[0] && res[0].keys && res[0].keys.map)
            input.columnSpecials["result"]  =  res[0].keys.map((e: string) => `("result"->>'valueskeys')::json->'${e}' AS "${e}"`);
        });
      }   
  }
};