/**
 * entity Observation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createEntity } from ".";
import { EConstant, EDataType, ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { doubleQuotesString } from "../../helpers";
import { _idBig, _result } from "./constants";
export const Observation:Ientity  = createEntity("Observations", {
    createOrder: 12,
    type: ETable.table,
    order: 7,
    orderBy: `"phenomenonTime"`,
    columns: {
      id: {
        create: _idBig,
        alias(service: Iservice , test: IKeyBoolean) {
           return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${doubleQuotesString(EConstant.id)}`: ''}` ;
        },
        type: "number",
        dataType: EDataType.bigint
      },
      phenomenonTime: {
        create: "timestamptz NOT NULL",
        alias() {},
        type: "date",
        dataType: EDataType.timestamptz
      },
      result: {
        create: "JSONB NULL",
        alias: _result,
        type: "result",
        dataType: EDataType.result
      },
      resultTime: {
        create: "timestamptz NOT NULL",
        alias() {},
        type: "date",
        dataType: EDataType.timestamptz
      },
      resultQuality: {
        create: "JSONB NULL",
        alias() {},
        type: "json",
        dataType: EDataType.jsonb
      },
      validTime: {
        create: "timestamptz DEFAULT CURRENT_TIMESTAMP",
        alias() {},
        type: "date",
        dataType: EDataType.timestamptz
      },
      parameters: {
        create: "JSONB NULL",
        alias() {},
        type: "json",
        dataType: EDataType.jsonb
      },
      datastream_id: {
        create: "BIGINT NULL",
        alias() {},
        dataType: EDataType.link,
        type: "relation:Datastreams",
      },
      multidatastream_id: {
        create: "BIGINT NULL",
        alias() {},
        dataType: EDataType.link,
        type: "relation:MultiDatastreams",
      },
      featureofinterest_id: {
        create: "BIGINT NOT NULL DEFAULT 1",
        alias() {},
        dataType: EDataType.link,
        type: "relation:FeaturesOfInterest",
      },
    },
    constraints: {
      observation_pkey: 'PRIMARY KEY ("id")',
      observation_unik_datastream:
        'UNIQUE ("phenomenonTime", "resultTime", "datastream_id", "featureofinterest_id")',
      observation_unik_multidatastream:
        'UNIQUE ("phenomenonTime", "resultTime", "multidatastream_id", "featureofinterest_id")',
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
        type: ERelations.belongsTo
      },
      MultiDatastream: {
        type: ERelations.belongsTo
      },
      FeatureOfInterest: {
        type: ERelations.belongsTo
      },
    },
});