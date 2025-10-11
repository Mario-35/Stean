/**
 * entity MultiDatastream
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { EObservationType, ERelations, EentityType } from "../../enums";
import { Ientity } from "../../types";
import { SmallInt, Geometry, Jsonb, Period, Relation, Text, Texts } from "../types";
export const MULTIDATASTREAM: Ientity = new Entity("MultiDatastreams", {
    createOrder: 8,
    type: EentityType.table,
    order: 2,
    columns: {
        id: new SmallInt().generated().column(),
        name: new Text().notNull().column(),
        description: new Text().notNull().column(),
        unitOfMeasurements: new Jsonb().notNull().column(),
        observationType: new Text().notNull().default("http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement").verify(Object.keys(EObservationType)).column(),
        multiObservationDataTypes: new Texts().column(),
        observedArea: new Geometry().column(),
        phenomenonTime: new Period("tz").relation("Observations").column(),
        resultTime: new Period("tz").relation("Observations").column(),
        thing_id: new Relation("Things").column(),
        sensor_id: new Relation("Sensors").column(),
        _default_featureofinterest: new Relation("FeaturesOfInterest").default(1).column()
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
            entityRelation: "MultiDatastreamObservedProperties"
        },
        Lora: {
            type: ERelations.hasOne
        },
        FeatureOfInterest: {
            type: ERelations.defaultUnique
        }
    }
}).toEntity();
