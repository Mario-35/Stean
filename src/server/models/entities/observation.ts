/**
 * entity Observation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { EDataType, ERelations, EentityType } from "../../enums";
import { Ientity } from "../../types";
import { Bigint, Jsonb, Period, Relation, Any, Timestamp } from "../types";
export const OBSERVATION: Ientity = new Entity("Observations", {
    createOrder: 12,
    type: EentityType.table,
    order: 7,
    columns: {
        id: new Bigint().generated().column(),
        phenomenonTime: new Timestamp("tz").notNull().defaultOrder("asc").column(),
        result: new Any().column(),
        resultTime: new Timestamp("tz").notNull().column(),
        resultQuality: new Jsonb().column(),
        validTime: new Period("tz").column(),
        parameters: new Jsonb().column(),
        datastream_id: new Relation("Datastreams", EDataType.smallint).addIndexes(["phenomenonTime", "resultTime"]).partition().column(),
        multidatastream_id: new Relation("MultiDatastreams", EDataType.smallint).addIndexes(["phenomenonTime", "resultTime"]).partition().column(),
        featureofinterest_id: new Relation("FeaturesOfInterest", EDataType.smallint).addIndexes(["phenomenonTime", "resultTime"]).notNull().default(1).column()
    },
    relations: {
        Datastream: {
            type: ERelations.belongsTo,
            unique: ["phenomenonTime", "resultTime", "datastream_id", "featureofinterest_id"]
        },
        MultiDatastream: {
            type: ERelations.belongsTo,
            unique: ["phenomenonTime", "resultTime", "multidatastream_id", "featureofinterest_id"]
        },
        FeatureOfInterest: {
            type: ERelations.belongsTo
        }
    }
});
