/**
 * Lines entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { koaContext } from "../../types";
import { logging } from "../../log";

/**
 * Lines Class
 */

export class Lines extends Common {
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack).toString());
        super(ctx);
    }
}
