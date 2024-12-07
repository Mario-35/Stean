/**
 * entity Lora
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import {  ERelations, ETable } from "../../enums";
import { Ientity } from "../../types";
import { info } from "../../messages";
import { Bigint, Jsonb, Relation, Text } from "../types";
export const LORA:Ientity  = new Entity("Loras", {
  createOrder: 11,
  type: ETable.table,
  order: 11,
  columns: {
    id: new Bigint().generated("id").type(),
    name: new Text().notNull().default(info.noName).unique().type(),
    description: new Text().notNull().default(info.noDescription).type(),
    properties: new Jsonb().type(),
    deveui: new Text().unique().type(),
    decoder_id:  new Relation().notNull().relation("Decoders").type(),
    datastream_id:  new Relation().relation("Datastreams").unique().type(),
    multidatastream_id:  new Relation().relation("MultiDatastreams").unique().type()
  },
  relations: {
    Datastream: {
      type: ERelations.belongsTo
    },
    MultiDatastream: {
      type: ERelations.belongsTo
    },
    Decoder: {
      type: ERelations.belongsTo
    },
  },
});