/**
 * entity Decoder.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, ETable } from "../../enums";
import { Ientity } from "../../types";
import { info } from "../../messages";
import { Bigint, Text } from "../types";

export const DECODER:Ientity  = new Entity("Decoders", {
  createOrder: 10,
  type: ETable.table,
  order: 12,
  columns: {
    id: new Bigint().generated("id").type(),
    name: new Text().notNull().default(info.noName).unique().type(),
    hash: new Text().type(),
    code: new Text().notNull().default('const decoded = null; return decoded;').type(),
    nomenclature: new Text().notNull().default('{}').type(),
    synonym: new Text().type(),
  },
  relations: {
    Loras: {
      type: ERelations.hasMany       
    },
  },
});