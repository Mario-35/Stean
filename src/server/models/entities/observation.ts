/**
 * entity Observation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, ETable } from "../../enums";
import { Ientity } from "../../types";
import { Bigint, Jsonb, Relation, Result, Timestamp } from "../types";
export const OBSERVATION:Ientity  = new Entity("Observations", {
    createOrder: 12,
    type: ETable.table,
    order: 7,
    columns: {
      id: new Bigint().generated("id").type(),
      phenomenonTime: new Timestamp("tz").notNull().defaultOrder("asc").type(),
      result: new Result().type(),
      resultTime: new Timestamp("tz").notNull().type(),
      resultQuality: new Jsonb().type(),
      validTime: new Timestamp("tz").notNull().defaultCurrent().type(),
      parameters: new Jsonb().type(),
      datastream_id:  new Relation().relation("Datastreams").type(),
      multidatastream_id:  new Relation().relation("MultiDatastreams").type(),
      featureofinterest_id:  new Relation().relation("FeaturesOfInterest").notNull().default(1).type()
    },
    relations: {
      Datastream: {
        type: ERelations.belongsTo,
        unique: ["phenomenonTime", "resultTime", "datastream_id", "featureofinterest_id"],
      },
      MultiDatastream: {
        type: ERelations.belongsTo,
        unique: ["phenomenonTime", "resultTime", "multidatastream_id", "featureofinterest_id"],
      },
      FeatureOfInterest: {
        type: ERelations.belongsTo
      },
    },
});