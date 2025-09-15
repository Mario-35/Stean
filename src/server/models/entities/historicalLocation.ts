/**
 * entity HistoricalLocation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, EentityType } from "../../enums";
import { Ientity } from "../../types";
import { Bigint, Timestamp } from "../types";

export const HISTORICALLOCATION: Ientity = new Entity("HistoricalLocations", {
    createOrder: -1,
    order: 5,
    type: EentityType.table,
    columns: {
        id: new Bigint().generated().column(),
        time: new Timestamp("tz").column(),
        thing_id: new Bigint().notNull().column()
    },
    relations: {
        Thing: {
            type: ERelations.belongsTo
        },
        Locations: {
            type: ERelations.belongsTo,
            entityRelation: "LocationsHistoricalLocations"
        }
    }
});
