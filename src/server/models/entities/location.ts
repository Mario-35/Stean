/**
 * entity Location
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
export const Location:Ientity  = new Entity("Locations", {
    createOrder: 2,
    type: ETable.table,
    order: 6,
    columns: {
      id: new Bigint().generated("id").type(),
      name: new Text().notNull().default(info.noName).unique().type(),
      description: new Text().notNull().default(info.noDescription).type(),
      encodingType: new Text().notNull().default("application/vnd.geo+json").type(),
      location: new Jsonb().notNull().type(),
    },
    relations: {
      Things: {
        type: ERelations.belongsToMany,
        entityRelation: "ThingsLocations"
      },
      HistoricalLocations: {
        type: ERelations.belongsToMany,
      },
    },
  });