/**
 * datastreamUnitOfMeasurements
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { RootPgVisitor } from "../../odata/visitor";
export const datastreamUoM = (input: RootPgVisitor) => `SELECT\n\t "unitOfMeasurement"->'name' AS keys\n FROM\n\t"datastream" \nWHERE id = ${input.parentId} `;