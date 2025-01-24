/**
 * entity Log
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { Ientity } from "../../types";
import { ETable } from "../../enums";
import { Bigint, Jsonb, Text, Timestamp } from "../types";

export const LOG: Ientity = new Entity("Logs", {
    createOrder: 99,
    type: ETable.blank,
    order: 0,
    columns: {
        id: new Bigint().generated("id").type(),
        date: new Timestamp("tz").notNull().defaultCurrent().defaultOrder("desc").type(),
        method: new Text().type(),
        url: new Text().type(),
        datas: new Jsonb().type(),
        error: new Jsonb().type()
    },
    relations: {}
});
