/**
 * entity Thing
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, EentityType } from "../../enums";
import { Ientity } from "../../types";
import { Bigint, Jsonb, Text } from "../types";
export const THING: Ientity = new Entity("Things", {
    createOrder: 1,
    type: EentityType.table,
    order: 10,
    columns: {
        id: new Bigint().generated().column(),
        name: new Text().notNull().column(),
        description: new Text().notNull().column(),
        properties: new Jsonb().column()
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
