/**
 * entity FeatureOfInterest
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, EentityType } from "../../enums";
import { Ientity } from "../../types";
import { SmallInt, Jsonb, Text } from "../types";

export const FEATUREOFINTEREST: Ientity = new Entity("FeaturesOfInterest", {
    createOrder: 4,
    type: EentityType.table,
    order: 4,
    columns: {
        id: new SmallInt().generated().column(),
        name: new Text().notNull().column(),
        description: new Text().notNull().column(),
        encodingType: new Text().column(),
        feature: new Jsonb().notNull().column()
    },
    relations: {
        Observations: {
            type: ERelations.hasMany
        },
        Datastreams: {
            type: ERelations.hasMany
        },
        MultiDatastreams: {
            type: ERelations.hasMany
        }
    },
    after: ["INSERT INTO featureofinterest (name, description, \"encodingType\", feature) VALUES ('Default Feature of Interest', 'Default Feature of Interest', 'application/vnd.geo+json', '{}');"]
}).toEntity();
