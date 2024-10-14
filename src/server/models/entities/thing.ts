/**
 * entity Thing
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
export const Thing: Ientity = createEntity("Things", {
    createOrder: 1,
    type: ETable.table,
    order: 10,
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
    constraints: {
      thing_pkey: 'PRIMARY KEY ("id")',
      thing_unik_name: 'UNIQUE ("name")',
    },
    relations: {
      Locations: {
        type: ERelations.belongsToMany,
        entityRelation: "ThingsLocations",
      },
      HistoricalLocations: {
        type: ERelations.hasMany
      },
      Datastreams: {
        type: ERelations.hasMany
      },
      MultiDatastreams: {
        type: ERelations.hasMany
      },
    },
  });