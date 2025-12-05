/**
 * entity LoraStreams
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { EentityType } from "../../enums";
import { Ientity } from "../../types";
import { SmallInt } from "../types";

export const LORASTREAMS: Ientity = new Entity("LoraStreams", {
    createOrder: 12,
    type: EentityType.link,
    order: -1,
    columns: {
        lora_id: new SmallInt().notNull().column(),
        datastream_id: new SmallInt().unique().column(),
        multidatastream_id: new SmallInt().unique().column(),
    },
    relations: {},
    trigger: []
}).toEntity();
