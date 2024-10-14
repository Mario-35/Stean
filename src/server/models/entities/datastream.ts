/**
 * entity Datastream
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createEntity } from ".";
import { EConstant, EDatesType, EObservationType, ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _idRel, _text, _tz } from "./constants";
import { doubleQuotesString } from "../../helpers";
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
      observationType: {
        create:
        _text('http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement'),
        alias() {},
        type: "list",
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
      },
      observedArea: {
        create: "geometry NULL",
        alias() {},
        type: "json",
      },
      phenomenonTime: {
        create: "",
        alias(service: Iservice , test: IKeyBoolean | undefined) {          
          return `CONCAT(to_char("_phenomenonTimeStart",'${EDatesType.date}'),'/',to_char("_phenomenonTimeEnd",'${EDatesType.date}')) AS "phenomenonTime"`;
        },
        type: "text",
      },
      resultTime: {
        create: "",
        alias(service: Iservice , test: IKeyBoolean | undefined) {
          return `CONCAT(to_char("_resultTimeStart",'${EDatesType.date}'),'/',to_char("_resultTimeEnd",'${EDatesType.date}')) AS "resultTime"`;
        },
        type: "text",
      },
      _phenomenonTimeStart: {
        create: _tz,
        alias() {},
        type: "date",
      },
      _phenomenonTimeEnd: {
        create: _tz,
        alias() {},
        type: "date",
      },
      _resultTimeStart: {
        create: _tz,
        alias() {},
        type: "date",
      },
      _resultTimeEnd: {
        create: _tz,
        alias() {},
        type: "date",
      },
      thing_id: {
        create: _idRel,
        alias() {},
        type: "relation:Things",
      },
      observedproperty_id: {
        create: _idRel,
        alias() {},
        type: "relation:ObservedProperties",
      },
      sensor_id: {
        create: _idRel,
        alias() {},
        type: "relation:Sensor",
      },
      _default_featureofinterest: {
        create: "BIGINT NOT NULL DEFAULT 1",
        alias() {},
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
  });