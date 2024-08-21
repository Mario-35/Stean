/**
 * interval.
*
* @copyright 2020-present Inrae
* @author mario.adam@inrae.fr
*
*/
// onsole.log("!----------------------------------- interval. -----------------------------------!");
import { PgVisitor } from "../../odata/visitor";


export const interval = (input: PgVisitor): string => 
    input.interval 
        ? 
`WITH src as (${input.toString()}), 
range_values AS (
    SELECT 
        min(srcdate) as minval, 
        max(srcdate) as maxval 
    FROM 
        src
), 
time_range AS (
    SELECT 
        generate_series( minval :: timestamp, maxval :: timestamp, '${input.interval || "1 day"}' :: interval ):: TIMESTAMP WITHOUT TIME ZONE as step 
    FROM 
        range_values
) 
SELECT 
    ${input.intervalColumns ? input.intervalColumns.join(", ") : '' } 
FROM 
    src RIGHT JOIN time_range on srcdate = step`
        : input.toString();


