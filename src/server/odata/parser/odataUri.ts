/**
 * oData ODataUri
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- oData ODataUri -----------------------------------!");

import Utils from "./utils";
import Lexer from "./lexer";
import Query from "./query";
import ResourcePath from "./resourcePath";

namespace ODataUri {
    export function odataUri(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token | undefined {
        let resource = ResourcePath.resourcePath(value, index, metadataContext);

        while (!resource && index < value.length) {
            while (value[++index] !== 0x2f && index < value.length);
            resource = ResourcePath.resourcePath(value, index, metadataContext);
        }
        if (!resource) return;
        const start = index;
        index = resource.next;
        metadataContext = resource.metadata;

        let query;
        if (value[index] === 0x3f) {
            query = Query.queryOptions(value, index + 1, metadataContext);
            if (!query) return;
            index = query.next;
            delete resource.metadata;
        }

        return Lexer.tokenize(value, start, index, { resource, query }, Lexer.TokenType.ODataUri, <any>{ metadata: metadataContext });
    }
}

export default ODataUri;
