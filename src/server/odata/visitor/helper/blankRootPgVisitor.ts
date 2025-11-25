/**
 * blankRootPgVisitor
 *
 * @copyright 2022-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { RootPgVisitor } from "..";
import { Ientity, koaContext } from "../../../types";
import { Token } from "../../parser";
import { query, resourcePath } from "../../parser/parser";

export const blankRootPgVisitor = (ctx: koaContext, entity: Ientity): RootPgVisitor | undefined => {
    const astRessources: Token = <Token>resourcePath(entity.name);
    const astQuery: Token = <Token>query(decodeURIComponent(`$top=${ctx._.service.nb_page ? ctx._.service.nb_page : 200}`));
    try {
        return new RootPgVisitor(
            ctx,
            {
                onlyValue: false,
                onlyRef: false,
                valueskeys: false
            },
            astRessources
        ).start(astQuery);
    } catch (error) {
        console.log(error);
        return undefined;
    }
};
