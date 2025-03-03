/**
 * entity Thing
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, ETable } from "../../enums";
import { Ientity } from "../../types";
import { Bigint, Jsonb, Text } from "../types";
export const THING: Ientity = new Entity("Things", {
    createOrder: 1,
    type: ETable.table,
    order: 10,
    columns: {
        id: new Bigint().generated("id").type(),
        name: new Text().notNull().type(),
        description: new Text().notNull().type(),
        properties: new Jsonb().type()
    },
    relations: {
        Locations: {
            type: ERelations.belongsToMany,
            entityRelation: "ThingsLocations"
        },
        HistoricalLocations: {
            type: ERelations.hasMany
        },
        Datastreams: {
            type: ERelations.hasMany
        },
        MultiDatastreams: {
            type: ERelations.hasMany
        }
    }
});
