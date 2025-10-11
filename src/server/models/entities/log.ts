/**
 * entity Log
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { Ientity } from "../../types";
import { EentityType } from "../../enums";
import { Bigint, Jsonb, Text, Timestamp } from "../types";

export const LOG: Ientity = new Entity("Logs", {
    createOrder: 99,
    type: EentityType.blank,
    order: 0,
    columns: {
        id: new Bigint().generated().column(),
        date: new Timestamp("tz").notNull().defaultCurrent().defaultOrder("desc").column(),
        method: new Text().column(),
        url: new Text().column(),
        datas: new Jsonb().column(),
        error: new Jsonb().column()
    },
    relations: {}
}).toEntity();
