/**
 * entity Sensor
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ERelations, ESensorEncodingType, EentityType } from "../../enums";
import { Ientity } from "../../types";
import { SmallInt, Text } from "../types";

export const SENSOR: Ientity = new Entity("Sensors", {
    createOrder: 6,
    type: EentityType.table,
    order: 9,
    columns: {
        id: new SmallInt().generated().column(),
        name: new Text().notNull().column(),
        description: new Text().notNull().column(),
        encodingType: new Text().verify(Object.keys(ESensorEncodingType)).column(),
        metadata: new Text().column()
    },
    relations: {
        Datastreams: {
            type: ERelations.hasMany
        },
        MultiDatastreams: {
            type: ERelations.hasMany
        }
    }
}).toEntity();
