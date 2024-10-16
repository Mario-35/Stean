/**
 * entity Decoder.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createEntity } from ".";
import { EConstant, ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _text } from "./constants";
import { doubleQuotesString } from "../../helpers";
export const Decoder:Ientity  = createEntity("Decoders", {
    createOrder: 10,
    type: ETable.table,
    order: 12,
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
      hash: {
        create: "TEXT NULL",
        alias() {},
        type: "text",
      },
      code: {
        create: _text('const decoded = null; return decoded;'),
        alias() {},
        type: "text",
      },
      nomenclature: {
        create: _text('{}'),
        alias() {},
        type: "jsonb",
      },
      synonym: {
        create: "TEXT NULL",
        alias() {},
        type: "jsonb",
      },
    },
    constraints: {
      decoder_pkey: 'PRIMARY KEY ("id")',
      decoder_unik_name: 'UNIQUE ("name")',
    },
    relations: {
      Loras: {
        type: ERelations.hasMany       
      },
    },
  });