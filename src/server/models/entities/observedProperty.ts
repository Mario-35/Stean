/**
 * entity ObservedProperty
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, ETable } from "../../enums";
import { Ientity } from "../../types";
import { Bigint, Text } from "../types";
export const OBSERVEDPROPERTY: Ientity = new Entity("ObservedProperties", {
    createOrder: 5,
    type: ETable.table,
    order: 8,
    columns: {
        id: new Bigint().generated("id").type(),
        name: new Text().notNull().type(),
        description: new Text().notNull().type(),
        definition: new Text().notNull().default("no definition").type()
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
