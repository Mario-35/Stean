/**
 * lines line
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, ETable } from "../../enums";
import { Ientity } from "../../types";
import { Bigint, Relation, Result } from "../types";
export const Line:Ientity  = new Entity("Lines", {
    createOrder: 2,
    type: ETable.table,
    order: 2,
    orderBy: `"id"`,
    columns: {
      id: new Bigint().generated("id").type(),
      result: new Result().lines().type(),
      file_id: new Relation().relation("Files").type(),

    },
    relations: {
      File: {
        type: ERelations.belongsTo
      },
    },
});