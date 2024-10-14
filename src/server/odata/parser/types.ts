/**
 * oData QueryOptionsNode
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Token } from './lexer';
export interface QueryOptionsNode extends Token {
  value: Array<Token>;
}