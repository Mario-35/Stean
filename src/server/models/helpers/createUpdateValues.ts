/**
 * createUpdateValues
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { ESCAPE_SIMPLE_QUOTE } from "../../constants";
import { EDataType } from "../../enums";
import { doubleQuotesString, simpleQuotesString } from "../../helpers";
import { log } from "../../log";
import { Ientity } from "../../types";

export function createUpdateValues(entity: Ientity, input: Record<string, any>): string  {
  console.log(log.whereIam());
   return  Object.keys(input).map((elem: string) => `${doubleQuotesString(elem)} = ${
    input[elem][0] === "{" 
    ? `${entity.columns[elem].dataType === EDataType.result ||  EDataType.jsonb ? '' : `COALESCE(${doubleQuotesString(elem)}, '{}'::jsonb) ||`} ${simpleQuotesString(ESCAPE_SIMPLE_QUOTE(input[elem]))}::jsonb`
    : simpleQuotesString(ESCAPE_SIMPLE_QUOTE(input[elem]))
  }`).join();
};