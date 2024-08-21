/**
 * entity Thing
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity Thing -----------------------------------!");

import { createEntity } from ".";
import { ERelations } from "../../enums";
import { IconfigFile, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _text } from "./constants";
import { addDoubleQuotes } from "../../helpers";
import { _ID } from "../../db/constants";

export const Thing: Ientity = createEntity("Things", {
    createOrder: 1,
    order: 10,
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
      }
    },
    constraints: {
      thing_pkey: 'PRIMARY KEY ("id")',
      thing_unik_name: 'UNIQUE ("name")',
    },
    relations: {
      Locations: {
        type: ERelations.belongsToMany,
        expand: `"location"."id" in (SELECT "thinglocation"."location_id" from "thinglocation" WHERE "thinglocation"."thing_id" = "thing"."id")`,
        link: `"location"."id" in (SELECT "thinglocation"."location_id" from "thinglocation" WHERE "thinglocation"."thing_id" = $ID)`,
        entityName: "Locations",
        tableName: "thinglocation",
        relationKey: "location_id",
        entityColumn: "thing_id",
        tableKey: "thing_id",
      },
      HistoricalLocations: {
        type: ERelations.hasMany,
        expand: `"historicallocation"."id" in (SELECT "historicallocation"."id" from "historicallocation" WHERE "historicallocation"."thing_id" = "thing"."id")`,
        link: `"historicallocation"."id" in (SELECT "historicallocation"."id" from "historicallocation" WHERE "historicallocation"."thing_id" = $ID)`,
        entityName: "HistoricalLocations",
        tableName: "historicalLocation",
        relationKey: "thing_id",
        entityColumn: "id",
        tableKey: "id",
      },
      Datastreams: {
        type: ERelations.hasMany,
        expand: `"datastream"."id" in (SELECT "datastream"."id" from "datastream" WHERE "datastream"."thing_id" = "thing"."id")`,
        link: `"datastream"."id" in (SELECT "datastream"."id" from "datastream" WHERE "datastream"."thing_id" = $ID)`,
        entityName: "Datastreams",
        tableName: "datastream",
        relationKey: "thing_id",
        entityColumn: "id",
        tableKey: "id",
      },
      MultiDatastreams: {
        type: ERelations.hasMany,
        expand: `"multidatastream"."id" in (SELECT "multidatastream"."id" from "multidatastream" WHERE "multidatastream"."thing_id" = "thing"."id")`,
        link: `"multidatastream"."id" in (SELECT "multidatastream"."id" from "multidatastream" WHERE "multidatastream"."thing_id" = $ID)`,
        entityName: "MultiDatastreams",
        tableName: "multidatastream",
        relationKey: "thing_id",
        entityColumn: "id",
        tableKey: "id",
      },
    },
  });