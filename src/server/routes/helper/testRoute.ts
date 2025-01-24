/**
 * Test Helpers.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Token } from "../../odata/parser";
import { query } from "../../odata/parser/parser";
import { koaContext } from "../../types";
export const testRoute = async (ctx: koaContext): Promise<string[] | { [key: string]: any }> => {
    const a = `$expand=Products($filter=hour('alfred') eq 'cake')`;

    try {
        return <Token>query(decodeURIComponent(a));
    } catch (error) {
        console.log(error);
        return { error: error };
    }
};
