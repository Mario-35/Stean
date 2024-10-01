/**
 * multiDatastreamUnitOfMeasurements
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- multiDatastreamUnitOfMeasurements -----------------------------------!\n");

import { RootPgVisitor } from "../../odata/visitor";

export const multiDatastreamUoM = (input: RootPgVisitor) => `SELECT 
jsonb_agg(tmp.units -> 'name') AS keys 
FROM 
(
  SELECT 
    jsonb_array_elements("unitOfMeasurements") AS units 
  FROM 
    "multidatastream" 
  WHERE 
    id = ${input.parentId}
) AS tmp
`;