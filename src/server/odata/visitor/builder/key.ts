/**
 * GroupBy builder
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- GroupBy builder -----------------------------------!");

import { Core } from ".";

export class Key extends Core {
  constructor(input?: string | string[]) {
    super(input);
  }
  add(input: string) {
    super.addKey(input);
  }
}
