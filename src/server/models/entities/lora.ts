/**
 * entity Lora
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity Lora -----------------------------------!");

import { createEntity } from ".";
import { ERelations } from "../../enums";
import { IconfigFile, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _idRel, _text } from "./constants";
import { addDoubleQuotes } from "../../helpers";
import { _ID } from "../../db/constants";

export const Lora:Ientity  = createEntity("Loras", {
  createOrder: 11,
  order: 11,
  orderBy: `"id"`,
  columns: {
    id: {
      create: _idBig,
      alias(config: IconfigFile, test: IKeyBoolean) {
          return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${addDoubleQuotes(_ID)}`: ''}` ;
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
      type: ERelations.belongsTo,
      expand: `"datastream"."id" = "lora"."datastream_id"`,
      link: `"datastream"."id" = (SELECT "lora"."datastream_id" FROM "lora" WHERE "lora"."id" = $ID)`,
      entityName: "Datastreams",
      tableName: "lora",
      relationKey: "id",
      entityColumn: "datastream_id",
      tableKey: "id",
    },
    MultiDatastream: {
      type: ERelations.belongsTo,
      expand: `"multidatastream"."id" = "lora"."multidatastream_id"`,
      link: `"multidatastream"."id" = (SELECT "lora"."multidatastream_id" FROM "lora" WHERE "lora"."id" = $ID)`,
      entityName: "MultiDatastreams",
      tableName: "lora",
      relationKey: "id",
      entityColumn: "multidatastream_id",
      tableKey: "id",
    },
    Decoder: {
      type: ERelations.belongsTo,
      expand: `"decoder"."id" = "lora"."decoder_id"`,
      link: `"decoder"."id" = (SELECT "lora"."decoder_id" FROM "lora" WHERE "lora"."id" = $ID)`,
      entityName: "Decoders",
      tableName: "lora",
      relationKey: "id",
      entityColumn: "decoder_id",
      tableKey: "id",
    },
  },
});