/**
 * entity FeatureOfInterest
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity FeatureOfInterest -----------------------------------!\n");

import { createEntity } from ".";
import { ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _text } from "./constants";
import { doubleQuotesString } from "../../helpers";
import { _ID } from "../../db/constants";

export const FeatureOfInterest:Ientity  = createEntity("FeaturesOfInterest", {
            createOrder: 4,
            type: ETable.table,
            order: 4,
            orderBy: `"id"`,
            columns: {
              id: {
                create: _idBig,
                alias(service: Iservice , test: IKeyBoolean) {
                  return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${doubleQuotesString(_ID)}`: ''}` ;
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
                type: "text",
              },
              feature: {
                create: "jsonb NOT NULL",
                alias() {},
                type: "json",
                test: "encodingType",
              }
            },
            relations: {
              Observations: {
                type: ERelations.hasMany
              },
              Datastreams: {
                type: ERelations.hasMany
              },
              MultiDatastreams: {
                type: ERelations.hasMany
              },
            },
            constraints: {
              featureofinterest_pkey: 'PRIMARY KEY ("id")',
              featureofinterest_unik_name: 'UNIQUE ("name")',
            },
            after:
              "INSERT INTO featureofinterest (name, description, \"encodingType\", feature) VALUES ('Default Feature of Interest', 'Default Feature of Interest', 'application/vnd.geo+json', '{}');",
          });