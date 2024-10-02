/**
 * observationResultCsv.
*
* @copyright 2020-present Inrae
* @author mario.adam@inrae.fr
*
*/
// onsole.log("!----------------------------------- observationResultCsv -----------------------------------!\n");

export const observationResultCsv = (column: string): string => `SELECT
    concat_ws(
        ' ',
        e'SELECT *,',
        string_agg(
            distinct concat(
                e'${column.replace(/[']+/g, "@")}->@', k,e'@ AS ',k
            ), ', '
        ), ' FROM "observation"'
    ) as query
from (
    SELECT jsonb_object_keys(${column}) AS k
    FROM "observation"
    WHERE jsonb_typeof(${column}) LIKE 'object'
) as generate`;