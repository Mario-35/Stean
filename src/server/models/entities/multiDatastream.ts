/**
 * entity MultiDatastream
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createEntity } from ".";
import { EConstant, EDataType, EDatesType, EObservationType, ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _idRel, _text, _tz } from "./constants";
import { doubleQuotesString } from "../../helpers";
export const MultiDatastream:Ientity  = createEntity("MultiDatastreams", {
    createOrder: 8,
    type: ETable.table,
    order: 2,
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
        create: "TEXT NULL",
        alias() {},
        type: "text",
        dataType: EDataType.text
      },
      unitOfMeasurements: {
        create: "JSONB NOT NULL",
        alias() {},
        type: "json",
        dataType: EDataType.jsonb
      },
      observationType: {
        create: _text('http://www.opengis.net/def/observation-type/ogc-om/2.0/om_complex-observation'),
        alias() {},
        type: "list",
        dataType: EDataType.text,
        verify: {
          list: Object.keys(EObservationType),
          default:
            "http://www.opengis.net/def/observation-type/ogc-om/2.0/om_complex-observation",
        },
      },
      multiObservationDataTypes: {
        create: "TEXT[] NULL",
        alias() {},
        type: "text[]",
        dataType: EDataType._text
      },
      observedArea: {
        create: "geometry NULL",
        alias() {},
        type: "json",
        dataType: EDataType.jsonb
      },
      phenomenonTime: {
        create: "",
        alias(service: Iservice , test: IKeyBoolean | undefined) {  
          return `CONCAT(to_char("_phenomenonTimeStart",'${EDatesType.date}'),'/',to_char("_phenomenonTimeEnd",'${EDatesType.date}')) AS "phenomenonTime"`;
        },
        type: "text",
        dataType: EDataType.text
      },
      resultTime: {
        create: "",
        alias(service: Iservice , test: IKeyBoolean | undefined) {  
          return `CONCAT(to_char("_resultTimeStart",'${EDatesType.date}'),'/',to_char("_resultTimeEnd",'${EDatesType.date}')) AS "resultTime"`;
        },
        type: "text",
        dataType: EDataType.text
      },
      _phenomenonTimeStart: {
        create: _tz,
        alias() {},
        type: "date",
        dataType: EDataType.timestamptz
      },
      _phenomenonTimeEnd: {
        create: _tz,
        alias() {},
        type: "date",
        dataType: EDataType.timestamptz
      },
      _resultTimeStart: {
        create: _tz,
        alias() {},
        type: "date",
        dataType: EDataType.timestamptz
      },
      _resultTimeEnd: {
        create: _tz,
        alias() {},
        type: "date",
        dataType: EDataType.timestamptz
      },
      thing_id: {
        create: _idRel,
        alias() {},
        dataType: EDataType.link,
        type: "relation:Things",
      },
      sensor_id: {
        create: _idRel,
        alias() {},
        dataType: EDataType.link,
        type: "relation:Sensors",
      },
      _default_featureofinterest: {
        create: "BIGINT NOT NULL DEFAULT 1",
        alias() {},
        type: "bigint",
        dataType: EDataType.bigint
      },
    },
    relations: {
      Thing: {
        type: ERelations.belongsTo
      },
      Sensor: {
        type: ERelations.belongsTo
      },
      Observations: {
        type: ERelations.hasMany
      },
      ObservedProperties: {
        type: ERelations.hasMany,
        entityRelation: "MultiDatastreamObservedProperties",
      },
      Lora: {
        type: ERelations.belongsTo
      },
      FeatureOfInterest: {
        type: ERelations.defaultUnique
      },
    },
    constraints: {
      multidatastream_pkey: 'PRIMARY KEY ("id")',
      multidatastream_unik_name: 'UNIQUE ("name")',
      multidatastream_sensor_id_fkey:
        'FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON UPDATE CASCADE ON DELETE CASCADE',
      multidatastream_thing_id_fkey:
        'FOREIGN KEY ("thing_id") REFERENCES "thing"("id") ON UPDATE CASCADE ON DELETE CASCADE',
      multidatastream_featureofinterest_id_fkey:
        'FOREIGN KEY ("_default_featureofinterest") REFERENCES "featureofinterest"("id") ON UPDATE CASCADE ON DELETE CASCADE',
    },
    indexes: {
      multidatastream_sensor_id:
        'ON public."multidatastream" USING btree ("sensor_id")',
      multidatastream_thing_id:
        'ON public."multidatastream" USING btree ("thing_id")',
    },
});