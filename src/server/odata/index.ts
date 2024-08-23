/**
 * pgVisitor index.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- pgVisitor index. -----------------------------------!");
import { query, resourcePath } from "./parser/parser";
import { Token } from "./parser/lexer";
import { cleanUrl, returnFormats } from "../helpers";
import { config } from "../configuration";
import { SqlOptions } from "./parser/sqlOptions";
import { multiDatastreamKeys } from "../db/queries";
import { RootPgVisitor } from "./visitor";
import { koaContext } from "../types";
import { errors } from "../messages";
import { EHttpCode } from "../enums";

const doSomeWarkAfterCreateAst = async (input: RootPgVisitor, ctx: koaContext) => {
  if (
    (input.returnFormat === returnFormats.csv && input.entity === "Observations" &&  input.parentEntity?.endsWith('atastreams') && input.parentId && <bigint>input.parentId > 0) ||
    (input.splitResult && input.splitResult[0].toUpperCase() == "ALL" && input.parentId && <bigint>input.parentId > 0) ) {
    const temp = await config.connection(ctx.config.name).unsafe(`${multiDatastreamKeys(input.parentId)}`);
    input.splitResult = temp[0]["keys"];
  }
};

const escapesOdata = (input: string) : string => {
  const codes = { "/" : "%252F", "\\" : "%255C" };
  if (input.includes("%27")) {
    const pop:string[] = [];
    input.split("%27").forEach((v: string, i: number) => {
      if (i === 1) Object.keys(codes).forEach((code: string) => v = v.split(code).join(codes[code as keyof object]));      
      pop.push(v);
    });
    return pop.join("%27");
  }
  return input;
};

export const createOdata = async (ctx: koaContext): Promise<RootPgVisitor | undefined> => {
  // blank url if not defined
  // init Ressource wich have to be tested first
  const options: SqlOptions = {
    onlyValue: false,
    onlyRef: false,
    valueskeys: false,
  };

  // normalize href
  let urlSrc = `${ctx.decodedUrl.path}${ctx.decodedUrl.search}`;  
  
  if (urlSrc && urlSrc.trim() != "") urlSrc = escapesOdata(urlSrc);
  
  // replace element  
  const clean = (replaceThis: string, by?: string) => urlSrc = urlSrc.split(replaceThis).join(by ? by : "");

  // function to remove element in url
  const removeElement = (input: string) => {
    clean(`&${input}`);
    clean(input);
  };
  
  clean("geography%27", "%27");
  clean("@iot.");
  
  // clean id in url
  urlSrc = cleanUrl(clean("@iot.id", "id"));

  if (urlSrc === "/") return;

  if (urlSrc.includes("$"))
    urlSrc.split("$").forEach((element: string) => {
      switch (element) {
        case "value?":
        case "value":
          options.onlyValue = true;
          removeElement(`/$${element}`);
          break;
        case "ref":
          options.onlyRef = true;
          removeElement(`/$${element}`);
          break;
        case "valuesKeys=true":
          options.valueskeys = true;
          removeElement(`$${element}`);
          break;
      }
    });
    
  const urlSrcSplit = cleanUrl(urlSrc).split("?");

  if (!urlSrcSplit[1]) urlSrcSplit.push(`$top=${ctx.config.nb_page ? ctx.config.nb_page : 200}`);

  if (urlSrcSplit[0].split("(").length != urlSrcSplit[0].split(")").length) urlSrcSplit[0] += ")";
  let astRessources: Token;
  
  try {
    astRessources = <Token>resourcePath(<string>urlSrcSplit[0]);    
  } catch (error) {
    console.log(error);
    
    ctx.throw(EHttpCode.notFound, { code: EHttpCode.badRequest, detail: errors.notValid  });
  }

  const astQuery: Token = <Token>query(decodeURIComponent(urlSrcSplit[1]));

  const temp = new RootPgVisitor(ctx, options, astRessources).start(astQuery);

  await doSomeWarkAfterCreateAst(temp, ctx);

  return temp;
};
