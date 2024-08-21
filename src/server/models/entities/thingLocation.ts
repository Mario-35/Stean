/**
 * entity ThingLocation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity ThingLocation -----------------------------------!");

import { createEntity } from ".";
import { Ientity } from "../../types";
import { _idRel } from "./constants";


  export const ThingLocation:Ientity  = createEntity("ThingsLocations", {
    createOrder: 3,
    order: -1,
    orderBy: `"thing_id"`,
    columns: {
      thing_id: {
        create: _idRel,
        alias() {},
        type: "bigint"
      },
      location_id: {
        create: _idRel,
        alias() {},
        type: "bigint"
      },
    },
    relations: {},
    constraints: {
      thinglocation_pkey: 'PRIMARY KEY ("thing_id", "location_id")',
      thinglocation_location_id_fkey: 'FOREIGN KEY ("location_id") REFERENCES "location"("id") ON UPDATE CASCADE ON DELETE CASCADE',
      thinglocation_thing_id_fkey: 'FOREIGN KEY ("thing_id") REFERENCES "thing"("id") ON UPDATE CASCADE ON DELETE CASCADE',
    },
    indexes: {
      thinglocation_location_id: 'ON public."thinglocation" USING btree ("location_id")',
      thinglocation_thing_id: 'ON public."thinglocation" USING btree ("thing_id")',
    },
  });