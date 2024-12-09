/**
 * generateFields
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { isGraph } from "../../helpers";
import { PgVisitor } from "../../odata/visitor";
export const generateFields = (input: PgVisitor): string[] => {
    let fields: string[] = [];
    if (isGraph(input)) {
      const table = input.parentEntity ? input.parentEntity.table : input.entity ? input.entity.table : undefined;
      fields = table ?  [
        `(SELECT ${table}."description" FROM ${table} WHERE ${table}."id" = ${
          input.parentId ? input.parentId : input.id
        }) AS title, `,
      ] : [];
    }
    return fields;
  };