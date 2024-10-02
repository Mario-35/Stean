/**
 * resultKeys.
*
* @copyright 2020-present Inrae
* @author mario.adam@inrae.fr
*
*/
// onsole.log("!----------------------------------- resultKeys -----------------------------------!\n");

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