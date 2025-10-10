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
import { SmallInt, Timestamp } from "../types";

export const HISTORICALLOCATION: Ientity = new Entity("HistoricalLocations", {
    createOrder: -1,
    order: 5,
    type: EentityType.table,
    columns: {
        id: new SmallInt().generated().column(),
        time: new Timestamp("tz").column(),
        thing_id: new SmallInt().notNull().column()
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
