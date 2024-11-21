/**
 * entity Log
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Entity } from "../entity";
import { Ientity } from "../../types";
import { ETable } from "../../enums";import { Bigint, Jsonb, Text, Timestamp } from "../types";

export const Log:Ientity = new Entity("Logs", {
    createOrder: -1,
    type: ETable.table,
    order: -1,
    orderBy: `"date DESC"`,
    columns: {
      id: new Bigint().generated("id").type(),
      date: new Timestamp().tz().notNull().defaultCurrent().type(),
      user_id: new Bigint().type(),
      method: new Text().type(),
      code: new Bigint().type(),
      url: new Text().type(),
      datas: new Jsonb().type(),
      database: new Text().type(),
      returnid: new Text().type(),
      error: new Jsonb().type(),
    },
    relations: {},
  });