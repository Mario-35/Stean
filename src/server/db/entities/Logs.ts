/**
 * Logs entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Logs entity. -----------------------------------!");
import { log } from "../../log";
import { koaContext } from "../../types";
import { Common } from "./common";

export class Logs extends Common {
  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    super(ctx);
  }
}
