/**
 * entity Lora
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { EInfos, ERelations, EentityType } from "../../enums";
import { Ientity } from "../../types";
import { SmallInt, Jsonb, Relation, Text } from "../types";
import { DECODER } from "./decoder";
export const LORA: Ientity = new Entity("Loras", {
    createOrder: 11,
    type: EentityType.table,
    order: 11,
    columns: {
        id: new SmallInt().generated().column(),
        name: new Text().notNull().default(EInfos.noName).unique().column(),
        description: new Text().notNull().default(EInfos.noDescription).column(),
        properties: new Jsonb().column(),
        deveui: new Text().unique().column(),
        decoder_id: new Relation(DECODER.name).notNull().column()
    },
    relations: {
        Datastreams: {
            type: ERelations.hasMany,
            entityRelation: "LoraStreams"
        },
        MultiDatastreams: {
            type: ERelations.hasMany,
            entityRelation: "LoraStreams"
        },
        Decoder: {
            type: ERelations.belongsTo
        }
    }
}).toEntity();
