/**
 * entity Lora
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity Lora -----------------------------------!\n");

import { createEntity } from ".";
import { EConstant, ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _idRel, _text } from "./constants";
import { doubleQuotesString } from "../../helpers";

export const Lora:Ientity  = createEntity("Loras", {
  createOrder: 11,
  type: ETable.table,
  order: 11,
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
      alias() {
        return undefined;
      },
      type: "text",
    },
    description: {
      create: _text('no description'),
      alias() {
        return undefined;
      },
      type: "text",
    },
    properties: {
      create: "JSONB NULL",
      alias() {
        return undefined;
      },
      type: "json",
    },
    deveui: {
      create: _text(), 
      alias() {
        return undefined;
      },
      type: "text",
    },
    decoder_id: {
      create: _idRel,
      alias() {
        return undefined;
      },
      type: "relation:Decoders",
    },
    datastream_id: {
      create: "BIGINT NULL",
      alias() {
        return undefined;
      },
      type: "relation:Datastreams",
    },
    multidatastream_id: {
      create: "BIGINT NULL",
      alias() {
        return undefined;
      },
      type: "relation:MultiDatastreams",
    },
  },
  constraints: {
    lora_pkey: 'PRIMARY KEY ("id")',
    lora_unik_deveui: 'UNIQUE ("deveui")',
    lora_datastream_unik_id: 'UNIQUE ("datastream_id")',
    lora_multidatastream_unik_id: 'UNIQUE ("multidatastream_id")',
    lora_datastream_fkey: 'FOREIGN KEY ("datastream_id") REFERENCES "datastream"("id") ON UPDATE CASCADE ON DELETE CASCADE',
    lora_multidatastream_fkey: 'FOREIGN KEY ("multidatastream_id") REFERENCES "multidatastream"("id") ON UPDATE CASCADE ON DELETE CASCADE',
    lora_decoder_fkey: 'FOREIGN KEY ("decoder_id") REFERENCES "decoder"("id") ON UPDATE CASCADE ON DELETE CASCADE',
  },
  indexes: {
    lora_datastream_id: 'ON public."lora" USING btree ("datastream_id")',
    lora_multidatastream_id: 'ON public."lora" USING btree ("multidatastream_id")',
    decoder_id: 'ON public."lora" USING btree ("decoder_id")',
  },
  relations: {
    Datastream: {
      type: ERelations.belongsTo
    },
    MultiDatastream: {
      type: ERelations.belongsTo
    },
    Decoder: {
      type: ERelations.belongsTo
    },
  },
});