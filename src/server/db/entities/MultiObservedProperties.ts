/**
 * MultiObservedProperties entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { logging } from "../../log";
import { koaContext } from "../../types";
import { Common } from "./common";
export class MultiObservedProperties extends Common {
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack).toString());
        super(ctx);
    }
}
