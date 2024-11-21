/**
 * entity Datastream
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EObservationType, ERelations, ETable } from "../../enums";
import { info } from "../../messages";
import { Entity } from "../entity";
import { Bigint, Geometry, Jsonb, Relation, Text, Tmperiod } from "../types";

export const Datastream = new Entity("Datastreams", {
    createOrder: 7,
    type: ETable.table,
    order: 1,
    orderBy: `"id"`,
    columns: {
      id: new Bigint().generated("id").type(),
      name: new Text().notNull().default(info.noName).unique().type(),
      description: new Text().notNull().default(info.noDescription).type(),
      observationType: new Text().notNull().default('http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement').verify(Object.keys(EObservationType)).type(),
      unitOfMeasurement: new Jsonb().notNull().type(),
      observedArea: new Geometry().type(),
      phenomenonTime: new Tmperiod().source("Observations").type(),
      resultTime: new Tmperiod().source("Observations").type(),
      thing_id:  new Relation().relation("Things").type(),
      observedproperty_id: new Relation().relation("ObservedProperties").type(),
      sensor_id: new Relation().relation("Sensors").type(),
      _default_featureofinterest:  new Relation().relation("FeaturesOfInterest").default(1).type()
    },
    relations: {
      Thing: {
        type: ERelations.belongsTo        
      },
      Sensor: {
        type: ERelations.belongsTo
      },
      ObservedProperty: {
        type: ERelations.belongsTo      
      },
      Observations: {
        type: ERelations.hasMany
      },
      Lora: {
        type: ERelations.belongsTo
      },
      FeatureOfInterest: {
        type: ERelations.defaultUnique
      },
    }
  });
