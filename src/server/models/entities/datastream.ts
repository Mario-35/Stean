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
import { Bigint, Geometry, Jsonb, Relation, Text, Timestamp } from "../types";

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
      phenomenonTime: new Timestamp().alias("phenomenonTime").type(),
      resultTime: new Timestamp().alias("resultTime").type(),
      _phenomenonTimeStart: new Timestamp().tz().type(),
      _phenomenonTimeEnd: new Timestamp().tz().type(),
      _resultTimeStart: new Timestamp().tz().type(),
      _resultTimeEnd: new Timestamp().tz().type(),
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
    },
    clean: [`WITH datastreams AS (
      SELECT DISTINCT "datastream_id" AS id FROM observation
      ),
      datas AS (SELECT 
        "datastream_id" AS id,
        MIN("phenomenonTime") AS pmin ,
        MAX("phenomenonTime") AS pmax,
        MIN("resultTime") AS rmin,
        MAX("resultTime") AS rmax
        FROM observation, datastreams where "datastream_id" = datastreams.id group by "datastream_id"
      )
      UPDATE "datastream" SET 
        "_phenomenonTimeStart" =  datas.pmin ,
        "_phenomenonTimeEnd" = datas.pmax,
        "_resultTimeStart" = datas.rmin,
        "_resultTimeEnd" = datas.rmax
      FROM datas WHERE "datastream".id = datas.id`]
  });
