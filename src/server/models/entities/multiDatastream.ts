/**
 * entity MultiDatastream
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity MultiDatastream -----------------------------------!");

import { createEntity } from ".";
import { EDatesType, EObservationType, ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _idRel, _text, _tz } from "./constants";
import { doubleQuotesString } from "../../helpers";
import { _ID } from "../../db/constants";

export const MultiDatastream:Ientity  = createEntity("MultiDatastreams", {
    createOrder: 8,
    type: ETable.table,
    order: 2,
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
        create: "TEXT NULL",
        alias() {},
        type: "text",
      },
      unitOfMeasurements: {
        create: "JSONB NOT NULL",
        alias() {},
        type: "json",
      },
      observationType: {
        create: _text('http://www.opengis.net/def/observation-type/ogc-om/2.0/om_complex-observation'),
        alias() {},
        type: "list",
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
      sensor_id: {
        create: _idRel,
        alias() {},
        type: "relation:Sensors",
      },
      _default_featureofinterest: {
        create: "BIGINT NOT NULL DEFAULT 1",
        alias() {},
        type: "bigint"
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