/**
 * entity Sensor
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity Sensor -----------------------------------!");

import { createEntity } from ".";
import { ERelations } from "../../enums";
import { IconfigFile, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _text } from "./constants";
import { addDoubleQuotes } from "../../helpers";
import { _ID } from "../../db/constants";

  export const Sensor:Ientity  = createEntity("Sensors", {
    createOrder: 6,
    order: 9,
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
        alias() {},
        type: "text",
      },
      description: {
        create: _text('no description'),
        alias() {},
        type: "text",
      },
      encodingType: {
        create: _text('application/pdf'),
        alias() {},
        dataList: {
          PDF: "application/pdf",
          SensorML: "http://www.opengis.net/doc/IS/SensorML/2.0",
        },
        type: "list",
      },
      metadata: {
        create: _text('none.pdf'),
        alias() {},
        type: "text",
      },
    },
    constraints: {
      sensor_pkey: 'PRIMARY KEY ("id")',
      sensor_unik_name: 'UNIQUE ("name")',
    },
    relations: {
      Datastreams: {
        type: ERelations.hasMany,
        expand: `"datastream"."id" in (SELECT "datastream"."id" from "datastream" WHERE "datastream"."sensor_id" = "sensor"."id")`,
        link: `"datastream"."id" in (SELECT "datastream"."id" from "datastream" WHERE "datastream"."sensor_id" = $ID)`,
        entityName: "Datastreams",
        tableName: "datastream",
        relationKey: "sensor_id",
        entityColumn: "id",
        tableKey: "id",
      },
      MultiDatastreams: {
        type: ERelations.hasMany,
        expand: `"multidatastream"."id" in (SELECT "multidatastream"."id" from "multidatastream" WHERE "multidatastream"."sensor_id" = "sensor"."id")`,
        link: `"multidatastream"."id" in (SELECT "multidatastream"."id" from "multidatastream" WHERE "multidatastream"."sensor_id" = $ID)`,
        entityName: "MultiDatastreams",
        tableName: "multidatastream",
        relationKey: "sensor_id",
        entityColumn: "id",
        tableKey: "id",
      }
    },
  });