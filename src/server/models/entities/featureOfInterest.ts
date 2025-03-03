/**
 * entity FeatureOfInterest
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, ETable } from "../../enums";
import { Ientity } from "../../types";
import { Bigint, Jsonb, Text } from "../types";

export const FEATUREOFINTEREST: Ientity = new Entity("FeaturesOfInterest", {
    createOrder: 4,
    type: ETable.table,
    order: 4,
    columns: {
        id: new Bigint().generated("id").type(),
        name: new Text().notNull().type(),
        description: new Text().notNull().type(),
        encodingType: new Text().type(),
        feature: new Jsonb().notNull().type()
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
    after: "INSERT INTO featureofinterest (name, description, \"encodingType\", feature) VALUES ('Default Feature of Interest', 'Default Feature of Interest', 'application/vnd.geo+json', '{}');"
});
