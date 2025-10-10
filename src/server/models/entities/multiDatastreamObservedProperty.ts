/**
 * entity MultiDatastreamObservedProperty
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { EentityType } from "../../enums";
import { Ientity } from "../../types";
import { SmallInt } from "../types";

export const MULTIDATASTREAMOBSERVEDPROPERTY: Ientity = new Entity("MultiDatastreamObservedProperties", {
    createOrder: 9,
    type: EentityType.link,
    order: -1,
    columns: {
        multidatastream_id: new SmallInt().notNull().column(),
        observedproperty_id: new SmallInt().notNull().column()
    },
    relations: {}
});
