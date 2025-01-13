/**
 * Files entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { koaContext } from "../../types";
import { log } from "../../log";

/**
 * Files Class
 */
export class Files extends Common {
    constructor(ctx: koaContext) {
        console.log(log.whereIam());
        super(ctx);
    }
}
