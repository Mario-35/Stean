/**
 * entity FeatureOfInterest
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createEntity } from ".";
import { EConstant, EDataType, ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _text } from "./constants";
import { doubleQuotesString } from "../../helpers";
export const FeatureOfInterest:Ientity  = createEntity("FeaturesOfInterest", {
            createOrder: 4,
            type: ETable.table,
            order: 4,
            orderBy: `"id"`,
            columns: {
              id: {
                create: _idBig,
                alias(service: Iservice , test: IKeyBoolean) {
                  return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${doubleQuotesString(EConstant.id)}`: ''}` ;
                },
                type: "number",
        dataType: EDataType.bigint
              },
              name: {
                create: _text('no name'),
                alias() {},
                type: "text",
        dataType: EDataType.text
              },
              description: {
                create: _text('no description'), 
                alias() {},
                type: "text",
        dataType: EDataType.text
              },
              encodingType: {
                create: _text(), 
                alias() {},
                type: "text",
                dataType: EDataType.text
              },
              feature: {
                create: "jsonb NOT NULL",
                alias() {},
                type: "json",
                dataType: EDataType.jsonb,
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