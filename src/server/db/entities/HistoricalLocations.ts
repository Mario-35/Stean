/**
 * HistoricalLocations entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { _DEBUG } from "../../constants";
import { logging } from "../../log";
import { koaContext } from "../../types";
import { Common } from "./common";

/**
 * HistoricalLocations Class
 */

export class HistoricalLocations extends Common {
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }
}
