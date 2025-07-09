/**
 * asDataArray.
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { asJson } from ".";
import { ESCAPE_SIMPLE_QUOTE } from "../../constants";
import { EConstant } from "../../enums";
import { doubleQuotesString, simpleQuotesString, formatPgString } from "../../helpers";
import { PgVisitor } from "../../odata/visitor";

export const asDataArray = (input: PgVisitor): string => {
    // create names
    const names: string[] = input.onlyRef === true ? ["@iot.selfLink"] : input.toPgQuery()?.keys.map((e: string) => formatPgString(e)) || [];
    // loop subQuery
    if (input.includes)
        input.includes.forEach((include: PgVisitor) => {
            if (include.entity) names.push(include.entity.singular);
        });
    // Return SQL query
    return asJson({
        query: `SELECT (ARRAY[${EConstant.newline}\t${names
            .map((e: string) => simpleQuotesString(ESCAPE_SIMPLE_QUOTE(e)))
            .join(`,${EConstant.newline}\t`)}]) AS "components", JSONB_AGG(allkeys) AS "dataArray" FROM (SELECT JSON_BUILD_ARRAY(${EConstant.newline}\t${names
            .map((e: string) => doubleQuotesString(e))
            .join(`,${EConstant.newline}\t`)}) AS allkeys ${EConstant.return}${EConstant.tab}FROM (${input.toString()}) AS p) AS l`,
        singular: false,
        strip: false,
        count: true
    });
};
