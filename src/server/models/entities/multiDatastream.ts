/**
 * entity MultiDatastream
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { EObservationType, ERelations, ETable } from "../../enums";
import { Ientity } from "../../types";
import { info } from "../../messages";
import { Bigint, Geometry, Jsonb, Relation, Text, Texts, Timestamp } from "../types";
export const MultiDatastream:Ientity  = new Entity("MultiDatastreams", {
    createOrder: 8,
    type: ETable.table,
    order: 2,
    orderBy: `"id"`,
    columns: {
      id: new Bigint().generated("id").type(),
      name: new Text().notNull().default(info.noName).unique().type(),
      description: new Text().notNull().default(info.noDescription).type(),
      unitOfMeasurements: new Jsonb().notNull().type(),
      observationType: new Text().notNull().default('http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement').verify(Object.keys(EObservationType)).type(),
      multiObservationDataTypes: new Texts().type(),
      observedArea: new Geometry().type(),
      phenomenonTime: new Timestamp().alias("phenomenonTime").type(),
      resultTime: new Timestamp().alias("resultTime").type(),
      _phenomenonTimeStart: new Timestamp().tz().type(),
      _phenomenonTimeEnd: new Timestamp().tz().type(),
      _resultTimeStart: new Timestamp().tz().type(),
      _resultTimeEnd: new Timestamp().tz().type(),
      thing_id:  new Relation().relation("Things").type(),
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
      Observations: {
        type: ERelations.hasMany
      },
      ObservedProperties: {
        type: ERelations.hasMany,
        entityRelation: "MultiDatastreamObservedProperties",
      },
      Lora: {
        type: ERelations.belongsTo
      },
      FeatureOfInterest: {
        type: ERelations.defaultUnique
      },
    },
    clean: [`WITH multidatastreams AS (
                SELECT DISTINCT "multidatastream_id" AS id FROM observation
            ),
            datas AS (SELECT 
                    "multidatastream_id" AS id,
                    MIN("phenomenonTime") AS pmin,
                    MAX("phenomenonTime") AS pmax,
                    MIN("resultTime") AS rmin,
                    MAX("resultTime") AS rmax
                FROM observation, multidatastreams WHERE "multidatastream_id" = multidatastreams.id GROUP BY "multidatastream_id"
            )
            UPDATE "multidatastream" SET 
                "_phenomenonTimeStart" =  datas.pmin,
                "_phenomenonTimeEnd" = datas.pmax,
                "_resultTimeStart" = datas.rmin,
                "_resultTimeEnd" = datas.rmax
            FROM datas WHERE "multidatastream".id = datas.id`]
});