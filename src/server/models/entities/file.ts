/**
 * file File
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createEntity } from ".";
import { EConstant, EDataType, ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _idRel, _text, _tz } from "./constants";
import { doubleQuotesString } from "../../helpers";
import { info } from "../../messages";
export const File:Ientity  = createEntity("Files", {
  createOrder: 1,
    type: ETable.table,
    order: 1,
    orderBy: `"id"`,
    columns: {
      id: {
        create: _idBig,
        alias(service: Iservice , test: IKeyBoolean) {
           return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${doubleQuotesString(EConstant.id)}`: ''}` ;
        },
        type: "number",
        dataType: EDataType.bigint
      },
      name: {
        create: _text(info.noName),
        alias() {},
        type: "text",
        dataType: EDataType.text
      },
      description: {
        create: _text(info.noDescription),
        alias() {},
        type: "text",
        dataType: EDataType.text
      },
      properties: {
        create: "JSONB NULL",
        alias() {
          return undefined;
        },
        type: "json",
        dataType: EDataType.jsonb
      }
    },
    relations: {
      Lines: {
        type: ERelations.hasMany
      }
    },
    constraints: {
      file_pkey: 'PRIMARY KEY ("id")',
      file_unik_name: 'UNIQUE ("name")',
    },
    indexes: {},
  });