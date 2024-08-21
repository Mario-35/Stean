/**
 * entity Location
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity Location -----------------------------------!");
import { createEntity } from ".";
import { ERelations } from "../../enums";
import { IconfigFile, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _text } from "./constants";
import { addDoubleQuotes } from "../../helpers";
import { _ID } from "../../db/constants";

export const Location:Ientity  = createEntity("Locations", {
    createOrder: 2,
    order: 6,
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
        create: _text(), 
        alias() {},
        dataList: {
          GeoJSON: "application/vnd.geo+json",
        },
        type: "list",
      },
      location: {
        create: "jsonb NOT NULL",
        alias() {},

        type: "json",
        test: "encodingType",
      }
    },
    constraints: {
      location_pkey: 'PRIMARY KEY ("id")',
      location_unik_name: 'UNIQUE ("name")',
    },
    relations: {
      Things: {
        type: ERelations.belongsToMany,
        expand: `"thing"."id" in (SELECT "thinglocation"."thing_id" from "thinglocation" WHERE "thinglocation"."location_id" = "location"."id")`,
        link: `"thing"."id" in (SELECT "thinglocation"."thing_id" from "thinglocation" WHERE "thinglocation"."location_id" = $ID)`,
        entityName: "Things",
        tableName: "thinglocation",
        relationKey: "location_id",
        entityColumn: "thing_id",
        tableKey: "thing_id",
      },
      HistoricalLocations: {
        type: ERelations.belongsToMany,
        expand: `"historicallocation"."id" in (SELECT "historicallocation"."id" from "historicallocation" WHERE "historicallocation"."thing_id" in (SELECT "thinglocation"."thing_id" from "thinglocation" WHERE "thinglocation"."location_id" = "location"."id"))`,
        link: `"historicallocation"."id" in (SELECT "historicallocation"."id" from "historicallocation" WHERE "historicallocation"."thing_id" in (SELECT "thinglocation"."thing_id" from "thinglocation" WHERE "thinglocation"."location_id" = $ID))`,
        entityName: "HistoricalLocations",
        tableName: "locationhistoricallocation",
        relationKey: "location_id",
        entityColumn: "id",
        tableKey: "id",
      },
    },
  });