/**
 * Loras entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { _DEBUG } from "../../constants";
import { koaContext } from "../../types";
import { logging } from "../../log";

/**
 * Logs Loras
 */

export class Loras extends Common {
    synonym: Record<string, any> = {};
    stean: Record<string, any> = {};
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }
}
