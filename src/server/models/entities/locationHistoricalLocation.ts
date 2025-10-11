/**
 * entity LocationHistoricalLocation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { EentityType } from "../../enums";
import { Ientity } from "../../types";
import { SmallInt } from "../types";

export const LOCATIONHISTORICALLOCATION: Ientity = new Entity("LocationsHistoricalLocations", {
    createOrder: -1,
    type: EentityType.link,
    order: -1,
    columns: {
        location_id: new SmallInt().notNull().column(),
        historicallocation_id: new SmallInt().notNull().column()
    },
    relations: {}
}).toEntity();
