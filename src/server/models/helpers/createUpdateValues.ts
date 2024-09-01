/**
 * createUpdateValues
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- createUpdateValues -----------------------------------!");

import { ESCAPE_SIMPLE_QUOTE } from "../../constants";
import { doubleQuotesString, simpleQuotesString } from "../../helpers";
import { log } from "../../log";

export function createUpdateValues(input: Record<string, any> ): string  {
    console.log(log.whereIam());
    const result:string[] = [];
    Object.keys(input).forEach((e: string) => {
          result.push(`${doubleQuotesString(e)} = ${simpleQuotesString(ESCAPE_SIMPLE_QUOTE(input[e]))}`);
      });
    return result.join();
  };