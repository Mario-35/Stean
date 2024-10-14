/**
 * entity Location
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
export const Location:Ientity  = createEntity("Locations", {
    createOrder: 2,
    type: ETable.table,
    order: 6,
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
        entityRelation: "ThingsLocations"
      },
      HistoricalLocations: {
        type: ERelations.belongsToMany,
        entityRelation: "ThingsLocations"
      },
    },
  });