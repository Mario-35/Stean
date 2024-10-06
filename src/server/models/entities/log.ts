/**
 * entity Log
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity Log -----------------------------------!\n");

import { createEntity } from ".";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _text } from "./constants";
import { doubleQuotesString } from "../../helpers";
import { EConstant, ETable } from "../../enums";

export const Log:Ientity = createEntity("Logs", {
    createOrder: -1,
    type: ETable.table,
    order: -1,
    orderBy: `"date DESC"`,
    columns: {
      id: {
        create: _idBig,
        alias(service: Iservice , test: IKeyBoolean) {
           return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${doubleQuotesString(EConstant.id)}`: ''}` ;
        },
        type: "number",
      },
      date: {
        create: "timestamptz DEFAULT CURRENT_TIMESTAMP",
        alias() {},
        type: "date",
      },
      user_id: {
        create: "BIGINT NULL",
        alias() {},
        type: "number",
      },
      method: {
        create: "TEXT NULL",
        alias() {},
        type: "text",
      },
      code: {
        create: "INT NULL",
        alias() {},
        type: "number",
      },
      url: {
        create: _text(), 
        alias() {},
        type: "text",
      },
      datas: {
        create: "JSONB NULL",
        alias() {},
        type: "json",
      },
      database: {
        create: "TEXT NULL",
        alias() {},
        type: "text",
      },
      returnid: {
        create: "TEXT NULL",
        alias() {},
        type: "text",
      },
      error: {
        create: "JSONB NULL",
        alias() {},
        type: "json",
      },
    },
    relations: {},
  });