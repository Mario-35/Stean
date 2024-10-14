/**
 * file File
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createEntity } from ".";
import { EConstant, ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _idRel, _text, _tz } from "./constants";
import { doubleQuotesString } from "../../helpers";
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
      },
      name: {
        create: _text('no name'),
        alias() {},
        type: "text",
      },
      description: {
        create: _text('no description'),
        alias() {},
        type: "text",
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