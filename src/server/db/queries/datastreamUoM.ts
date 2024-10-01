/**
 * datastreamUnitOfMeasurements
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- datastreamUnitOfMeasurements -----------------------------------!\n");

import { RootPgVisitor } from "../../odata/visitor";

export const datastreamUoM = (input: RootPgVisitor) => `SELECT 
"unitOfMeasurement"->'name' AS keys
  FROM 
    "datastream" 
  WHERE id = ${input.parentId}
`;