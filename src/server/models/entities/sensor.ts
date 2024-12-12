/**
 * entity Sensor
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import {  ERelations, ETable } from "../../enums";
import { Ientity } from "../../types";
import { Bigint, Text } from "../types";

export const SENSOR:Ientity  = new Entity("Sensors", {
  createOrder: 6,
  type: ETable.table,
  order: 9,
  columns: {
    id: new Bigint().generated("id").type(),
    name: new Text().notNull().type(),
    // name: new Text().notNull().default(info.noName).unique().type(),
    description: new Text().notNull().type(),
    // description: new Text().notNull().default(info.noDescription).type(),
    encodingType: new Text().default('application/pdf').type(),
    metadata: new Text().default('none.pdf').type(),
  },
  relations: {
    Datastreams: {
      type: ERelations.hasMany
    },
    MultiDatastreams: {
      type: ERelations.hasMany
    }
  },
});