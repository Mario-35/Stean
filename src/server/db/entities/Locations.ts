/**
 * Locations entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { log } from "../../log";
import { koaContext } from "../../types";
import { Common } from "./common";

/**
 * Locations Class
 */

export class Locations extends Common {
    constructor(ctx: koaContext) {
        console.log(log.whereIam());
        super(ctx);
    }
}
