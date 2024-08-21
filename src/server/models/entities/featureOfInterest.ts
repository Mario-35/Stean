/**
 * entity FeatureOfInterest
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity FeatureOfInterest -----------------------------------!");

import { createEntity } from ".";
import { ERelations } from "../../enums";
import { IconfigFile, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _text } from "./constants";
import { addDoubleQuotes } from "../../helpers";
import { _ID } from "../../db/constants";

export const FeatureOfInterest:Ientity  = createEntity("FeaturesOfInterest", {
            createOrder: 4,
            order: 4,
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
                type: ERelations.hasMany,
                expand: `"observation"."id" in (SELECT "observation"."id" from "observation" WHERE "observation"."featureofinterest_id" = "featureofinterest"."id")`,
                link: `"observation"."id" in (SELECT "observation"."id" from "observation" WHERE "observation"."featureofinterest_id" = $ID)`,
                entityName: "Observations",
                tableName: "observation",
                relationKey: "featureofinterest_id",
                entityColumn: "id",
                tableKey: "id",
              },
              Datastreams: {
                type: ERelations.hasMany,
                expand: `"datastream"."id" in (SELECT "datastream"."id" from "datastream" WHERE "datastream"."_default_foi" = "featureofinterest"."id")`,
                link: `"datastream"."id" in (SELECT "datastream"."id" from "datastream" WHERE "datastream"."_default_foi" = $ID)`,
                entityName: "Datastreams",
                tableName: "datastream",
                relationKey: "_default_foi",
                entityColumn: "id",
                tableKey: "id",
              },
            },
            constraints: {
              featureofinterest_pkey: 'PRIMARY KEY ("id")',
              featureofinterest_unik_name: 'UNIQUE ("name")',
            },
            after:
              "INSERT INTO featureofinterest (name, description, \"encodingType\", feature) VALUES ('Default Feature of Interest', 'Default Feature of Interest', 'application/vnd.geo+json', '{}');",
          });