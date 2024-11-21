/**
 * entity Thing
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
export const Thing: Ientity = new Entity("Things", {
    createOrder: 1,
    type: ETable.table,
    order: 10,
    orderBy: `"id"`,
    columns: {
      id: new Bigint().generated("id").type(),
      name: new Text().notNull().default(info.noName).unique().type(),
      description: new Text().notNull().default(info.noDescription).type(),
    },
    relations: {
      Locations: {
        type: ERelations.belongsToMany,
        entityRelation: "ThingsLocations",
      },
      HistoricalLocations: {
        type: ERelations.hasMany
      },
      Datastreams: {
        type: ERelations.hasMany
      },
      MultiDatastreams: {
        type: ERelations.hasMany
      },
    },
  });