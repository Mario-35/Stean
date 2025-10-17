/**
 * entity Lora
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, EentityType } from "../../enums";
import { Ientity } from "../../types";
import { SmallInt, Jsonb, Relation, Text } from "../types";
import { messages } from "../../messages";
export const LORA: Ientity = new Entity("Loras", {
    createOrder: 11,
    type: EentityType.table,
    order: 11,
    columns: {
        id: new SmallInt().generated().column(),
        name: new Text().notNull().default(messages.infos.noName).unique().column(),
        description: new Text().notNull().default(messages.infos.noDescription).column(),
        properties: new Jsonb().column(),
        deveui: new Text().unique().column(),
        decoder_id: new Relation("Decoders").notNull().column(),
        datastream_id: new Relation("Datastreams").unique().column(),
        multidatastream_id: new Relation("MultiDatastreams").unique().column()
    },
    relations: {
        Datastream: {
            type: ERelations.hasOne
        },
        MultiDatastream: {
            type: ERelations.hasOne
        },
        Decoder: {
            type: ERelations.belongsTo
        }
    }
}).toEntity();
