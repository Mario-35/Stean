/**
 * entity Datastream
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EInfos, EObservationType, ERelations, EentityType } from "../../enums";
import { Entity } from "../entity";
import { SmallInt, Geometry, Jsonb, Period, Relation, Text } from "../types";

export const DATASTREAM = new Entity("Datastreams", {
    createOrder: 7,
    type: EentityType.table,
    order: 1,
    columns: {
        id: new SmallInt().generated().column(),
        name: new Text().notNull().column(),
        description: new Text().notNull().default(EInfos.noDescription).column(),
        observationType: new Text().notNull().default("http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement").verify(Object.keys(EObservationType)).column(),
        unitOfMeasurement: new Jsonb().notNull().column(),
        observedArea: new Geometry().column(),
        phenomenonTime: new Period("tz").relation("Observations").column(),
        resultTime: new Period("tz").relation("Observations").column(),
        thing_id: new Relation("Things").column(),
        observedproperty_id: new Relation("ObservedProperties").column(),
        sensor_id: new Relation("Sensors").column(),
        _default_featureofinterest: new SmallInt().column()
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
        }
    }
}).toEntity();
