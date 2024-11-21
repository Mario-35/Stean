/**
 * entity MultiDatastreamObservedProperty
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { ETable } from "../../enums";
import { Ientity } from "../../types";
import { Bigint } from "../types";

export const MultiDatastreamObservedProperty:Ientity  = new Entity("MultiDatastreamObservedProperties", {
    createOrder: 9,
    type: ETable.link,
    order: -1,
    orderBy: "",
    columns: {
      multidatastream_id: new Bigint().notNull().type(),
      observedproperty_id: new Bigint().notNull().type(),
    },
    relations: {}
  });