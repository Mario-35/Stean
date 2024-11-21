/**
 * entity User.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Ientity } from "../../types";
import { Entity } from "../entity";
import {  ETable } from "../../enums";
import { Bigint, Bool, Text } from "../types";

  export const User:Ientity  = new Entity("Users", {
    createOrder: -1,
    type: ETable.table,
    order: 21,
    orderBy: `"name"`,
    columns: {
      id: new Bigint().generated("id").type(),
      username: new Text().notNull().unique().type(),
      email: new Text().type(),
      password: new Text().type(),
      database: new Text().type(),
      canPost: new Bool().type(),
      canDelete: new Bool().type(),
      canCreateUser: new Bool().type(),
      canCreateDb: new Bool().type(),
      admin: new Bool().type(),
      superAdmin: new Bool().type(),
    },
    relations: {},
  });