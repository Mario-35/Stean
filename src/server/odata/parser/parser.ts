/**
 * oData parser
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- oData parser -----------------------------------!");

import Lexer from "./lexer";
import PrimitiveLiteral from "./primitiveLiteral";
import Expressions from "./expressions";
import Query from "./query";
import ResourcePath from "./resourcePath";
import ODataUri from "./odataUri";

// Odata Main parser
export const parserFactory = function(fn: any) {
    return function (source: any, options: any) {
        options = options || {};
        const raw = new Uint16Array(source.length);
        const pos = 0;
        for (let i = 0; i < source.length; i++) {
            raw[i] = source.charCodeAt(i);
        }
        const result = fn(raw, pos, options.metadata);
        if (!result) throw new Error("Fail at " + pos);        
        if (result.next < raw.length) throw new Error(`Unexpected character at [${source}]` + result.next);
        return result;
    };
};

export function odataUri(source: string, options?: any): Lexer.Token {
    return parserFactory(ODataUri.odataUri)(source, options);
}
export function resourcePath(source: string, options?: any): Lexer.Token {
    return parserFactory(ResourcePath.resourcePath)(source, options);
}
export function query(source: string, options?: any): Lexer.Token {
    return parserFactory(Query.queryOptions)(source, options);
}
export function filter(source: string, options?: any): Lexer.Token {
    return parserFactory(Expressions.boolCommonExpr)(source, options);
}
export function keys(source: string, options?: any): Lexer.Token {
    return parserFactory(Expressions.keyPredicate)(source, options);
}
export function literal(source: string, options?: any): Lexer.Token {
    return parserFactory(PrimitiveLiteral.primitiveLiteral)(source, options);
}

export * from './types';
