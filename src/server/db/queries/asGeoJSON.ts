/**
 * asDataArray.
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { asJson } from ".";
import { PgVisitor } from "../../odata/visitor";

export const asGeoJSON = (input: PgVisitor): string =>  
`SELECT JSONB_BUILD_OBJECT(
    'type', 
    'FeatureCollection', 
    'features', 
    (${asJson({
      query: input.toString(),
      singular: false,
      strip: false,
      count: false,
    })}));`;
