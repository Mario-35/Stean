/**
 * entity User.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Ientity } from "../../types";
import { createEntity } from ".";
import { _idBig, _text } from "./constants";
import { EDataType, ETable } from "../../enums";
  export const User:Ientity  = createEntity("Users", {
    createOrder: -1,
    type: ETable.table,
    order: 21,
    orderBy: `"name"`,
    columns: {
      id: {
        create: _idBig,
        alias() {},
        type: "bigint",
        dataType: EDataType.bigint
      },
      username: {
        create: "text NOT NULL UNIQUE",
        alias() {},
        type: "string",
        dataType: EDataType.text
      },
      email: {
        create: _text(), 
        alias() {},
        type: "string",
        dataType: EDataType.text
      },
      password: {
        create: _text(), 
        alias() {},
        type: "string",
        dataType: EDataType.text
      },
      database: {
        create: _text(), 
        alias() {},
        type: "string",
        dataType: EDataType.text
      },
      canPost: {
        create: "bool NULL",
        alias() {},
        type: "boolean",
        dataType: EDataType.boolean
      },
      canDelete: {
        create: "bool NULL",
        alias() {},
        type: "boolean",
        dataType: EDataType.boolean
      },
      canCreateUser: {
        create: "bool NULL",
        alias() {},
        type: "boolean",
        dataType: EDataType.boolean
      },
      canCreateDb: {
        create: "bool NULL",
        alias() {},
        type: "boolean",
        dataType: EDataType.boolean
      },
      admin: {
        create: "bool NULL",
        alias() {},
        type: "boolean",
        dataType: EDataType.boolean
      },
      superAdmin: {
        create: "bool NULL",
        alias() {},
        type: "boolean",
        dataType: EDataType.boolean
      },
    },
    relations: {},
  });