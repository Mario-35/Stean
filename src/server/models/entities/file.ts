/**
 * file File
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, ETable } from "../../enums";
import { Ientity } from "../../types";
import { info } from "../../messages";
import { Bigint, Jsonb, Text } from "../types";
export const File:Ientity  = new Entity("Files", {
  createOrder: 1,
    type: ETable.table,
    order: 1,
    columns: {
      id: new Bigint().generated("id").type(),
      name: new Text().notNull().default(info.noName).unique().type(),
      description: new Text().notNull().default(info.noDescription).type(),
      properties: new Jsonb().type(),
    },
    relations: {
      Lines: {
        type: ERelations.hasMany
      }
    }
  });