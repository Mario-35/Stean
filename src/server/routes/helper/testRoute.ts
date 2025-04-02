/**
 * Test Helpers.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { koaContext } from "../../types";

export const testRoute = async (ctx: koaContext): Promise<string[] | { [key: string]: any }> => {
    try {
        return { "Test": "No Test" };
    } catch (error) {
        console.log(error);
        return { error: error };
    }
};
