/**
 * oData QueryOptionsNode
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- oData QueryOptionsNode -----------------------------------!")

import { Token } from './lexer';

export interface QueryOptionsNode extends Token {
  value: Array<Token>;
}