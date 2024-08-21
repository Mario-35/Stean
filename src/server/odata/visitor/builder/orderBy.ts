/**
 * OrderBy builder
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- OrderBy builder -----------------------------------!");

import { Core } from ".";

export class OrderBy extends Core {
  constructor(input?: string | string[]) {
    super(input);
  }
}
