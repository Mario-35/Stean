/**
 * asDataArray.
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author formatPgString.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- asDataArray. -----------------------------------!");
import { asJson } from ".";
import { ESCAPE_SIMPLE_QUOTE, _COLUMNSEPARATOR, _NEWLINE } from "../../constants";
import { doubleQuotesString, simpleQuotesString, formatPgString } from "../../helpers";
import { PgVisitor } from "../../odata/visitor";

export const asDataArray = (input: PgVisitor): string => {  
  
  const names:string[] = input.toPgQuery()?.keys.map((e: string) => formatPgString(e)) || [];
  // create names
  if (input.includes) input.includes.forEach((include: PgVisitor) => { names.push(include.entity); });
  // Return SQL query  
  return asJson({
    query: `SELECT (ARRAY[${_NEWLINE}\t${names
      .map((e: string) => simpleQuotesString(ESCAPE_SIMPLE_QUOTE(e)))
      .join( `,${_NEWLINE}\t`)}]) AS "component", count(*) AS "dataArray@iot.count", jsonb_agg(allkeys) AS "dataArray" FROM (SELECT json_build_array(${_NEWLINE}\t${names.map((e: string) => doubleQuotesString(e)).join(`,${_NEWLINE}\t`)}) AS allkeys \n\tFROM (${input.toString()}) AS p) AS l`,
    singular: false,
    strip: false,
    count: false,
  });
}
