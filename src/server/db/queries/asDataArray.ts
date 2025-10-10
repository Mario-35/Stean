/**
 * asDataArray.
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { asJson } from ".";
import { EConstant, EDataType } from "../../enums";
import { doubleQuotes, simpleQuotes, formatPgString, escapeSimpleQuotes } from "../../helpers";
import { PgVisitor } from "../../odata/visitor";

export const asDataArray = (input: PgVisitor): string => {
    function castToText(colName: string) {
        colName = colName === "@iot.id" ? "id" : colName;
        if (input.entity?.columns[colName])
            switch (input.entity.columns[colName].dataType) {
                case EDataType.bigint:
                case EDataType.smallint:
                case EDataType.integer:
                case EDataType.any:
                    return "";
                default:
                    return "::text";
            }
        return "";
    }
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
            .map((e: string) => simpleQuotes(escapeSimpleQuotes(e)))
            .join(`,${EConstant.newline}\t`)}]) AS "components", JSONB_AGG(allkeys) AS "dataArray" FROM (SELECT JSON_BUILD_ARRAY(${EConstant.newline}\t${names
            // .map((e: string) => doubleQuotes(e))
            .map((e: string) => `${doubleQuotes(e)}${castToText(e)}`)
            .join(`,${EConstant.newline}\t`)}) AS allkeys ${EConstant.return}${EConstant.tab}FROM (${input.toString()}) AS p) AS l`,
        singular: false,
        strip: false,
        count: true
    });
};
