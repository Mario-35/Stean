/**
 * entity ObservedProperty
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, EentityType } from "../../enums";
import { Ientity } from "../../types";
import { SmallInt, Text } from "../types";
export const OBSERVEDPROPERTY: Ientity = new Entity("ObservedProperties", {
    createOrder: 5,
    type: EentityType.table,
    order: 8,
    columns: {
        id: new SmallInt().generated().column(),
        name: new Text().notNull().column(),
        description: new Text().notNull().column(),
        definition: new Text().notNull().default("no definition").column()
    },
    relations: {
        Datastreams: {
            type: ERelations.hasMany
        },
        MultiDatastreams: {
            type: ERelations.hasMany,
            entityRelation: "MultiDatastreamObservedProperties"
        }
    }
});
