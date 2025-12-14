/**
 * pgVisitor index.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { query, resourcePath } from "./parser/parser";
import { Token } from "./parser/lexer";
import { betweenParentheses, cleanUrl } from "../helpers";
import { SqlOptions } from "./parser/sqlOptions";
import { RootPgVisitor } from "./visitor";
import { koaContext } from "../types";
import { EConstant, EErrors, EHttpCode } from "../enums";
import { doSomeWorkAfterCreateAst, escapesOdata } from "./visitor/helper";
import { logging } from "../log";

export const createOdata = async (ctx: koaContext): Promise<RootPgVisitor | undefined> => {
    // init Ressource wich have to be tested first
    const options: SqlOptions = {
        onlyValue: false,
        onlyRef: false,
        valueskeys: false,
        nowInterval: undefined
    };
    // normalize href
    let urlSrc = `${ctx._.path}${ctx._.search}`;
    if (urlSrc && urlSrc.trim() != "") urlSrc = escapesOdata(urlSrc);

    // replace element
    const replaceElement = (replaceThis: string, by?: string) => (urlSrc = urlSrc.split(replaceThis).join(by ? by : ""));

    // function to remove element in url
    const removeElement = (input: string) => {
        replaceElement(`&${input}`);
        replaceElement(input);
    };

    replaceElement("geography%27", "%27");
    replaceElement("@iot.");
    if (urlSrc.includes('now(') && !urlSrc.includes('now()')) {
        options.nowInterval = betweenParentheses(urlSrc);
        logging.debug("####################################")
        logging.debug(options.nowInterval)
        logging.debug("####################################")
        replaceElement(options.nowInterval);
    }

    // clean id in url
    urlSrc = cleanUrl(replaceElement(EConstant.id, "id"));
    // if nothing to do return
    if (urlSrc === "/") return;
    // If params after ? in loras post delete them to not be catch by odata
    if (ctx.request.method === "POST" && ctx._.href.includes(`/Loras`)) urlSrc = urlSrc.split("?")[0];
    // Remove actions that are not odata
    if (urlSrc.includes("$"))
        urlSrc.split("$").forEach((element: string) => {
            switch (element) {
                case "value?":
                case "value":
                    options.onlyValue = true;
                    removeElement(`/$${element}`);
                    break;
                case "ref?":
                case "ref":
                    options.onlyRef = true;
                    break;
                case "valuesKeys=true":
                    options.valueskeys = true;
                    removeElement(`$${element}`);
                    break;
            }
        });

    const urlSrcSplit = cleanUrl(urlSrc).split("?");
    if (!urlSrcSplit[1]) urlSrcSplit.push(`$top=${ctx._.service.nb_page || 200}`);
    if (urlSrcSplit[0].split("(").length != urlSrcSplit[0].split(")").length) urlSrcSplit[0] += ")";
    // INIT ressource
    let astRessources: Token;
    const src = urlSrcSplit[0].split("/");
    try {
        astRessources = src.length > 1 ? <Token>resourcePath(<string>[src.shift(), src.shift()].filter((e) => e !== "").join("/")) : <Token>resourcePath(<string>urlSrcSplit[0]);
    } catch (error) {
        ctx.throw(EHttpCode.notFound, logging.error(error).return({ code: EHttpCode.badRequest, detail: EErrors.notValid }));
    }
    // INIT query
    const astQuery: Token = <Token>query(decodeURIComponent(urlSrcSplit[1]));
    const temp = new RootPgVisitor(ctx, options, astRessources, src).start(astQuery);
    await doSomeWorkAfterCreateAst(temp, ctx);
    return temp;
};