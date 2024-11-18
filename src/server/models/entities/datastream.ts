/**
 * entity Datastream
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
import { info } from "../../messages";
export const Datastream:Ientity  = createEntity("Datastreams", {
    createOrder: 7,
    type: ETable.table,
    order: 1,
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
        create: _text(info.noName),
        alias() {},
        type: "text",
        dataType: EDataType.text
      },
      description: {
        create: _text(info.noDescription),
        alias() {},
        type: "text",
        dataType: EDataType.text
      },
      observationType: {
        create:
        _text('http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement'),
        alias() {},
        type: "list",
        dataType: EDataType._text,
        verify: {
          list: Object.keys(EObservationType),
          default:
            "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
        },
      },
      unitOfMeasurement: {
        create: "jsonb NOT NULL",
        alias() {},
        type: "json",
        dataType: EDataType.jsonb
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
      observedproperty_id: {
        create: _idRel,
        alias() {},
        dataType: EDataType.link,
        type: "relation:ObservedProperties",
      },
      sensor_id: {
        create: _idRel,
        alias() {},
        dataType: EDataType.link,
        type: "relation:Sensor",
      },
      _default_featureofinterest: {
        create: "BIGINT NOT NULL DEFAULT 1",
        alias() {},
        dataType: EDataType.link,
        type: "relation:FeaturesOfInterest",
      },
    },
    relations: {
      Thing: {
        type: ERelations.belongsTo        
      },
      Sensor: {
        type: ERelations.belongsTo
      },
      ObservedProperty: {
        type: ERelations.belongsTo      
      },
      Observations: {
        type: ERelations.hasMany
      },
      Lora: {
        type: ERelations.belongsTo
      },
      FeatureOfInterest: {
        type: ERelations.defaultUnique
      },
    },
    constraints: {
      datastream_pkey: 'PRIMARY KEY ("id")',
      datastream_unik_name: 'UNIQUE ("name")',
      datastream_observedproperty_id_fkey:
        'FOREIGN KEY ("observedproperty_id") REFERENCES "observedproperty"("id") ON UPDATE CASCADE ON DELETE CASCADE',
      datastream_sensor_id_fkey:
        'FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON UPDATE CASCADE ON DELETE CASCADE',
      datastream_thing_id_fkey:
        'FOREIGN KEY ("thing_id") REFERENCES "thing"("id") ON UPDATE CASCADE ON DELETE CASCADE',
      datastream_featureofinterest_id_fkey:
        'FOREIGN KEY ("_default_featureofinterest") REFERENCES "featureofinterest"("id") ON UPDATE CASCADE ON DELETE CASCADE',
    },
    indexes: {
      datastream_observedproperty_id:
        'ON public."datastream" USING btree ("observedproperty_id")',
      datastream_sensor_id: 'ON public."datastream" USING btree ("sensor_id")',
      datastream_thing_id: 'ON public."datastream" USING btree ("thing_id")',
    },
    clean: [`WITH datastreams AS (
      SELECT DISTINCT "datastream_id" AS id FROM observation
      ),
      datas AS (SELECT 
        "datastream_id" AS id,
        MIN("phenomenonTime") AS pmin ,
        MAX("phenomenonTime") AS pmax,
        MIN("resultTime") AS rmin,
        MAX("resultTime") AS rmax
        FROM observation, datastreams where "datastream_id" = datastreams.id group by "datastream_id"
      )
      UPDATE "datastream" SET 
        "_phenomenonTimeStart" =  datas.pmin ,
        "_phenomenonTimeEnd" = datas.pmax,
        "_resultTimeStart" = datas.rmin,
        "_resultTimeEnd" = datas.rmax
      FROM datas WHERE "datastream".id = datas.id`]
  });