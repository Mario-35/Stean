/**
 * entity ThingLocation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { EentityType } from "../../enums";
import { Ientity } from "../../types";
import { SmallInt } from "../types";

export const THINGLOCATION: Ientity = new Entity("ThingsLocations", {
    createOrder: 3,
    type: EentityType.link,
    order: -1,
    columns: {
        thing_id: new SmallInt().notNull().unique().column(),
        location_id: new SmallInt().notNull().column()
    },
    relations: {},
    trigger: [
        `CREATE OR REPLACE FUNCTION thing_location_update_insert() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$ DECLARE t_id SmallInt; BEGIN INSERT INTO historicallocation(time, thing_id) VALUES(current_timestamp, new.thing_id) returning id into t_id; INSERT INTO locationhistoricallocation(historicallocation_id, location_id) VALUES(t_id, new.location_id); RETURN NEW; END; $$`,
        `do $$ begin CREATE TRIGGER thing_location_update_insert AFTER INSERT OR UPDATE on "thinglocation" for each row execute procedure thing_location_update_insert(); exception when others then null; end $$;`
    ]
}).toEntity();
