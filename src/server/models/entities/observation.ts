/**
 * entity Observation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity Observation -----------------------------------!");

import { createEntity } from ".";
import { ERelations } from "../../enums";
import { IconfigFile, Ientity, IKeyBoolean } from "../../types";
import { addDoubleQuotes } from "../../helpers";
import { _idBig } from "./constants";
import { _ID } from "../../db/constants";

  export const Observation:Ientity  = createEntity("Observations", {
    createOrder: 12,
    order: 7,
    orderBy: `"phenomenonTime"`,
    columns: {
      id: {
        create: _idBig,
        alias(config: IconfigFile, test: IKeyBoolean) {
           return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${addDoubleQuotes(_ID)}`: ''}` ;
        },
        type: "number",
      },
      phenomenonTime: {
        create: "timestamptz NOT NULL",
        alias() {},
        type: "date",
      },
      result: {
        create: "JSONB NULL",
        alias(config: IconfigFile, test: IKeyBoolean | undefined) {
          if (!test) return "result";  
          if (test["valueskeys"] && test["valueskeys"] === true) 
            return `COALESCE("result"-> 'valueskeys', "result"-> 'value')${test && test["as"] === true ? ` AS "result"`: ''}`;
          if (test["numeric"] && test["numeric"] === true)
            return`CASE 
            WHEN jsonb_typeof("result"-> 'value') = 'number' THEN ("result"->>'value')::numeric 
            WHEN jsonb_typeof("result"-> 'value') = 'array' THEN ("result"->>'value')[0]::numeric 
            END${test && test["as"] === true ? ` AS "result"`: ''}`;
          return `"result"->'value'${test && test["as"] === true ? ` AS "result"`: ''}`;
        },
        type: "result",
      },
      resultTime: {
        create: "timestamptz NOT NULL",
        alias() {},
        type: "date",
      },
      resultQuality: {
        create: "JSONB NULL",
        alias() {},
        type: "json",
      },
      validTime: {
        create: "timestamptz DEFAULT CURRENT_TIMESTAMP",
        alias() {},
        type: "date",
      },
      parameters: {
        create: "JSONB NULL",
        alias() {},
        type: "json",
      },
      datastream_id: {
        create: "BIGINT NULL",
        alias() {},
        type: "relation:Datastreams",
      },
      multidatastream_id: {
        create: "BIGINT NULL",
        alias() {},
        type: "relation:MultiDatastreams",
      },
      featureofinterest_id: {
        create: "BIGINT NOT NULL DEFAULT 1",
        alias() {},
        type: "relation:FeaturesOfInterest",
      },
    },
    constraints: {
      observation_pkey: 'PRIMARY KEY ("id")',
      observation_unik_datastream_result:
        'UNIQUE ("phenomenonTime", "resultTime", "datastream_id", "featureofinterest_id", "result")',
      observation_unik_multidatastream_result:
        'UNIQUE ("phenomenonTime", "resultTime", "multidatastream_id", "featureofinterest_id", "result")',
      observation_datastream_id_fkey:
        'FOREIGN KEY ("datastream_id") REFERENCES "datastream"("id") ON UPDATE CASCADE ON DELETE CASCADE',
      observation_multidatastream_id_fkey:
        'FOREIGN KEY ("multidatastream_id") REFERENCES "multidatastream"("id") ON UPDATE CASCADE ON DELETE CASCADE',
      observation_featureofinterest_id_fkey:
        'FOREIGN KEY ("featureofinterest_id") REFERENCES "featureofinterest"("id") ON UPDATE CASCADE ON DELETE CASCADE',
    },
    indexes: {
      observation_datastream_id:
        'ON public."observation" USING btree ("datastream_id")',
      observation_multidatastream_id:
        'ON public."observation" USING btree ("multidatastream_id")',
      observation_featureofinterest_id:
        'ON public."observation" USING btree ("featureofinterest_id")',
    },
    relations: {
      Datastream: {
        type: ERelations.belongsTo,
        expand: `"datastream"."id" = "observation"."datastream_id"`,
        link: `"datastream"."id" = (SELECT "observation"."datastream_id" FROM "observation" WHERE "observation"."id" = $ID)`,
        entityName: "Datastreams",
        tableName: "observation",
        relationKey: "id",
        entityColumn: "datastream_id",
        tableKey: "id",
      },
      MultiDatastream: {
        type: ERelations.belongsTo,
        expand: `"multidatastream"."id" = "observation"."multidatastream_id"`,
        link: `"multidatastream"."id" = (SELECT "observation"."multidatastream_id" FROM "observation" WHERE "observation"."id" = $ID)`,
        entityName: "MultiDatastreams",
        tableName: "observation",
        relationKey: "id",
        entityColumn: "multidatastream_id",
        tableKey: "id",
      },
      FeatureOfInterest: {
        type: ERelations.belongsTo,
        expand: `"featureofinterest"."id" = "observation"."featureofinterest_id"`,
        // link: "err: 501 : Not Implemented.",
        link: `"featureofinterest"."id" = (SELECT "observation"."featureofinterest_id" FROM "observation" WHERE "observation"."id" = $ID)`,        
        entityName: "FeaturesOfInterest",
        tableName: "featureofinterest",
        relationKey: "id",
        entityColumn: "featureofinterest_id",
        tableKey: "id",
      },
    },
  });