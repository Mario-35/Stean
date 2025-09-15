/**
 * entity Location
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, EentityType } from "../../enums";
import { Ientity } from "../../types";
import { Bigint, Jsonb, Text } from "../types";
export const LOCATION: Ientity = new Entity("Locations", {
    createOrder: 2,
    type: EentityType.table,
    order: 6,
    columns: {
        id: new Bigint().generated().column(),
        name: new Text().notNull().column(),
        description: new Text().notNull().column(),
        encodingType: new Text().notNull().default("application/vnd.geo+json").column(),
        location: new Jsonb().notNull().column()
    },
    relations: {
        Things: {
            type: ERelations.belongsToMany,
            entityRelation: "ThingsLocations"
        },
        HistoricalLocations: {
            type: ERelations.belongsToMany
        }
    }
});
