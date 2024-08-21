/**
 * addToService
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
console.log("!----------------------------------- addToService -----------------------------------!");

import { isGraph } from "../../helpers";
import { PgVisitor } from "../../odata/visitor";

export const generateFields = (input: PgVisitor): string[] => {
    let fields: string[] = [];
    if (isGraph(input)) {
      const table = input.ctx.model[input.parentEntity ? input.parentEntity : input.entity].table;
      fields = [
        `(SELECT ${table}."description" FROM ${table} WHERE ${table}."id" = ${
          input.parentId ? input.parentId : input.id
        }) AS title, `,
      ];
    }
    return fields;
  };