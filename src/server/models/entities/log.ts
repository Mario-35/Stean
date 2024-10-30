/**
 * entity Log
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createEntity } from ".";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _text } from "./constants";
import { doubleQuotesString } from "../../helpers";
import { EConstant, EDataType, ETable } from "../../enums";
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
        dataType: EDataType.bigint,
      },
      date: {
        create: "timestamptz DEFAULT CURRENT_TIMESTAMP",
        alias() {},
        type: "date",
        dataType: EDataType.timestamptz
      },
      user_id: {
        create: "BIGINT NULL",
        alias() {},
        type: "number",
        dataType: EDataType.bigint
      },
      method: {
        create: "TEXT NULL",
        alias() {},
        type: "text",
        dataType: EDataType.text
      },
      code: {
        create: "INT NULL",
        alias() {},
        type: "number",
        dataType: EDataType.bigint
      },
      url: {
        create: _text(), 
        alias() {},
        type: "text",
        dataType: EDataType.text
      },
      datas: {
        create: "JSONB NULL",
        alias() {},
        type: "json",
        dataType: EDataType.jsonb
      },
      database: {
        create: "TEXT NULL",
        alias() {},
        type: "text",
        dataType: EDataType.text
      },
      returnid: {
        create: "TEXT NULL",
        alias() {},
        type: "text",
        dataType: EDataType.text
      },
      error: {
        create: "JSONB NULL",
        alias() {},
        type: "json",
        dataType: EDataType.jsonb
      },
    },
    relations: {},
  });