/**
 * createUpdateValues
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- createUpdateValues -----------------------------------!\n");

import { ESCAPE_SIMPLE_QUOTE } from "../../constants";
import { doubleQuotesString, simpleQuotesString } from "../../helpers";
import { log } from "../../log";

export function createUpdateValues(input: Record<string, any> ): string  {
  console.log(log.whereIam());
  return  Object.keys(input).map((elem: string) => `${doubleQuotesString(elem)} = ${simpleQuotesString(ESCAPE_SIMPLE_QUOTE(input[elem]))}`).join();
};