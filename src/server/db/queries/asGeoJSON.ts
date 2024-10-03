/**
 * asDataArray.
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author formatPgString.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- asDataArray -----------------------------------!\n");

import { asJson } from ".";
import { PgVisitor } from "../../odata/visitor";

export const asGeoJSON = (input: PgVisitor): string =>  `SELECT jsonb_build_object(
    'type', 'FeatureCollection', 'features', (${asJson({
      query: input.toString(),
      singular: false,
      strip: false,
      count: false,
    })}));`;
