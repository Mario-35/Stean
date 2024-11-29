/**
 * entity ThingLocation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ETable } from "../../enums";
import { Ientity } from "../../types";
import { Bigint } from "../types";

  export const ThingLocation:Ientity  = new Entity("ThingsLocations", {
    createOrder: 3,
    type: ETable.link,
    order: -1,
    columns: {
      thing_id: new Bigint().notNull().unique().type(),
      location_id: new Bigint().notNull().type(),
    },
    relations: {}
  });