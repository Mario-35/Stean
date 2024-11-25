/**
 * entity HistoricalLocation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, ETable } from "../../enums";
import { Ientity } from "../../types";
import { Bigint, Timestamp } from "../types";

export const HistoricalLocation:Ientity  = new Entity("HistoricalLocations", {
  createOrder: -1,
  order: 5,
  type: ETable.table,
  columns: {
    id: new Bigint().generated("id").type(),
    time: new Timestamp("tz").type(),
    thing_id: new Bigint().notNull().type(),
  },
  relations: {
    Thing: {
      type: ERelations.belongsTo
    },
    Locations: {
      type: ERelations.belongsTo,
      entityRelation: "LocationsHistoricalLocations"
    },
  },
});