/**
 * entity User.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity User -----------------------------------!");

import { Ientity } from "../../types";
import { createEntity } from ".";
import { _idBig, _text } from "./constants";

  export const User:Ientity  = createEntity("Users", {
    createOrder: -1,
    order: 21,
    orderBy: `"name"`,
    columns: {
      id: {
        create: _idBig,
        alias() {},
        type: "bigint"
      },
      username: {
        create: "text NOT NULL UNIQUE",
        alias() {},
        type: "string"
      },
      email: {
        create: _text(), 
        alias() {},
        type: "string"
      },
      password: {
        create: _text(), 
        alias() {},
        type: "string"
      },
      database: {
        create: _text(), 
        alias() {},
        type: "string"
      },
      canPost: {
        create: "bool NULL",
        alias() {},
        type: "boolean"
      },
      canDelete: {
        create: "bool NULL",
        alias() {},
        type: "boolean"
      },
      canCreateUser: {
        create: "bool NULL",
        alias() {},
        type: "boolean"
      },
      canCreateDb: {
        create: "bool NULL",
        alias() {},
        type: "boolean"
      },
      admin: {
        create: "bool NULL",
        alias() {},
        type: "boolean"
      },
      superAdmin: {
        create: "bool NULL",
        alias() {},
        type: "boolean"
      },
    },
    relations: {},
  });