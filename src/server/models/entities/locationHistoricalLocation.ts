/**
 * entity LocationHistoricalLocation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ETable } from "../../enums";
import { Ientity } from "../../types";
import { Bigint } from "../types";

export const LOCATIONHISTORICALLOCATION: Ientity = new Entity("LocationsHistoricalLocations", {
    createOrder: -1,
    type: ETable.link,
    order: -1,
    columns: {
        location_id: new Bigint().notNull().type(),
        historicallocation_id: new Bigint().notNull().type()
    },
    relations: {}
});
