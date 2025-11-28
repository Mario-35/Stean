/**
 * Test Helpers.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { logging } from "../../log";
import { koaContext } from "../../types";

/**
 *
 * A route to tests
 *
 * @param ctx koa context
 * @returns result json
 */

export const testRoute = async (ctx: koaContext): Promise<string[] | { [key: string]: any }> => {
    try {
        return { "ready": ctx._.service.ready};
    } catch (error) {
        return logging.error(error).return({ error: error });
    }
};
