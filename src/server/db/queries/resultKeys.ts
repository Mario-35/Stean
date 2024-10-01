// export const resultKeys = (column: string, inputID: bigint | string): string => `SELECT
//     concat_ws(
//         ' ',
//         e'SELECT *,',
//         string_agg(
//             distinct concat(
//                 e'${column.replace(/[']+/g, "@")}->@', k,e'@ AS ',k
//             ), ', '
//         ), ' FROM "observation"'
//     ) as query
// from (
//     SELECT jsonb_object_keys(${column}) AS k
//     FROM "observation"
//     WHERE jsonb_typeof(${column}) LIKE 'object'
//     AND "observation"."id" IN (SELECT "observation"."id" FROM "observation" WHERE "observation"."datastream_id" = ${inputID})
// ) as generate`;

import { RootPgVisitor } from "../../odata/visitor";


export const resultKeys = (column: string, input: RootPgVisitor): string => `SELECT 
  DISTINCT JSONB_OBJECT_KEYS(${column}) AS k 
FROM 
  "observation" 
WHERE 
  JSONB_TYPEOF(${column}) LIKE 'object' 
  AND "observation"."id" IN (
    SELECT 
      "observation"."id" 
    FROM 
      "observation" 
    WHERE 
      "observation"."${input.parentEntity?.table}_id" = ${input.parentId}
  )`;