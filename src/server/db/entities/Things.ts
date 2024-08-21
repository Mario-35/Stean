/**
 * Things entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Things entity. -----------------------------------!");
import { log } from "../../log";
import { koaContext } from "../../types";
import { Common } from "./common";
// http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#25
export class Things extends Common {
  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    super(ctx);
  }
}
