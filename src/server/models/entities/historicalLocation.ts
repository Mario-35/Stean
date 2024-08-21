/**
 * entity HistoricalLocation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity HistoricalLocation -----------------------------------!");

import { createEntity } from ".";
import {  ERelations } from "../../enums";
import { IconfigFile, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _idRel, _tz } from "./constants";
import { addDoubleQuotes } from "../../helpers";
import { _ID } from "../../db/constants";

export const HistoricalLocation:Ientity  = createEntity("HistoricalLocations", {
  createOrder: -1,
  order: 5,
  orderBy: `"id"`,
  columns: {
    id: {
      create: _idBig,
      alias(config: IconfigFile, test: IKeyBoolean) {
          return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${addDoubleQuotes(_ID)}`: ''}` ;
      },
      type: "bigint"
    },
    time: {
      create: _tz,
      alias() {},
      type: "date"
    },
    thing_id: {
      create: _idRel,
      alias() {},
      type: "bigint"
    },
  },
  constraints: {
    historicallocation_pkey: 'PRIMARY KEY ("id")',
    historicallocation_thing_id_fkey:
      'FOREIGN KEY ("thing_id") REFERENCES "thing"("id") ON UPDATE CASCADE ON DELETE CASCADE',
  },
  indexes: {
    historicallocation_thing_id:
      'ON public."historicallocation" USING btree ("thing_id")',
  },
  relations: {
    Thing: {
      type: ERelations.belongsTo,
      expand: `"thing"."id" = "historicallocation"."thing_id"`,
      link: `"thing"."id" = (SELECT "historicallocation"."thing_id" from "historicallocation" WHERE "historicallocation"."id" = $ID)`,
      entityName: "Things",
      tableName: "thing",
      relationKey: "thing_id",
      entityColumn: "id",
      tableKey: "id",
    },
    Locations: {
      type: ERelations.belongsToMany,
      expand: `"location"."id" in (SELECT "location"."id" from "location" WHERE "location"."id" in (SELECT "thinglocation"."location_id" from "thinglocation" WHERE "thinglocation"."thing_id" = "historicallocation"."thing_id"))`,
      link: `"location"."id" in (SELECT "location"."id" from "location" WHERE "location"."id" in (SELECT "thinglocation"."location_id" from "thinglocation" WHERE "thinglocation"."thing_id" in (SELECT "historicallocation"."thing_id" from "historicallocation" WHERE "historicallocation"."id" = $ID)))`,
      entityName: "locationsHistoricalLocations",
      tableName: "locationhistoricallocation",
      relationKey: "historicallocation_id",
      entityColumn: "location_id",
      tableKey: "location_id",
    },
  },
});