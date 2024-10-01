/**
 * entity HistoricalLocation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity HistoricalLocation -----------------------------------!\n");

import { createEntity } from ".";
import {  ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _idRel, _tz } from "./constants";
import { doubleQuotesString } from "../../helpers";
import { _ID } from "../../db/constants";

export const HistoricalLocation:Ientity  = createEntity("HistoricalLocations", {
  createOrder: -1,
  order: 5,
  type: ETable.table,
  orderBy: `"id"`,
  columns: {
    id: {
      create: _idBig,
      alias(service: Iservice , test: IKeyBoolean) {
          return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${doubleQuotesString(_ID)}`: ''}` ;
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
      type: ERelations.belongsTo
    },
    Locations: {
      type: ERelations.belongsTo,
      entityRelation: "ThingsLocations"
    },
  },
});