/**
 * entity Decoder.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, EentityType } from "../../enums";
import { Ientity } from "../../types";
import { SmallInt, Text } from "../types";

export const DECODER: Ientity = new Entity("Decoders", {
    createOrder: 10,
    type: EentityType.table,
    order: 12,
    columns: {
        id: new SmallInt().generated().column(),
        name: new Text().notNull().column(),
        hash: new Text().column(),
        code: new Text().notNull().default("const decoded = null; return decoded;").column(),
        nomenclature: new Text().notNull().default("{}").column(),
        synonym: new Text().column()
    },
    relations: {
        Loras: {
            type: ERelations.hasMany
        }
    }
});
