/**
 * entity Datastream
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EObservationType, ERelations, EentityType } from "../../enums";
import { info } from "../../messages";
import { Entity } from "../entity";
import { Bigint, Geometry, Jsonb, Period, Relation, Text } from "../types";

export const DATASTREAM = new Entity("Datastreams", {
    createOrder: 7,
    type: EentityType.table,
    order: 1,
    columns: {
        id: new Bigint().generated().column(),
        name: new Text().notNull().column(),
        description: new Text().notNull().default(info.noDescription).column(),
        observationType: new Text().notNull().default("http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement").verify(Object.keys(EObservationType)).column(),
        unitOfMeasurement: new Jsonb().notNull().column(),
        observedArea: new Geometry().column(),
        phenomenonTime: new Period("tz").relation("Observations").column(),
        resultTime: new Period("tz").relation("Observations").column(),
        thing_id: new Relation("Things").column(),
        observedproperty_id: new Relation("ObservedProperties").column(),
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
        }
    }
});
