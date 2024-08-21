/**
 * entity MultiDatastream
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity MultiDatastream -----------------------------------!");

import { createEntity } from ".";
import { EDatesType, EObservationType, ERelations } from "../../enums";
import { IconfigFile, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _idRel, _text, _tz } from "./constants";
import { addDoubleQuotes } from "../../helpers";
import { _ID } from "../../db/constants";

export const MultiDatastream:Ientity  = createEntity("MultiDatastreams", {
    createOrder: 8,
    order: 2,
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
        alias(config: IconfigFile, test: IKeyBoolean | undefined) {  
          return `CONCAT(to_char("_phenomenonTimeStart",'${EDatesType.date}'),'/',to_char("_phenomenonTimeEnd",'${EDatesType.date}')) AS "phenomenonTime"`;
        },
        type: "text",
      },
      resultTime: {
        create: "",
        alias(config: IconfigFile, test: IKeyBoolean | undefined) {  
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
      _default_foi: {
        create: "BIGINT NOT NULL DEFAULT 1",
        alias() {},
        type: "bigint"
      },
    },
    relations: {
      Thing: {
        type: ERelations.belongsTo,
        expand: `"thing"."id" = "multidatastream"."thing_id"`,
        link: `"thing"."id" = (SELECT "multidatastream"."thing_id" from "multidatastream" WHERE "multidatastream"."id" =$ID)`,        
        entityName: "Things",
        tableName: "multidatastream",
        relationKey: "id",
        entityColumn: "thing_id",
        tableKey: "id",
      },
      Sensor: {
        type: ERelations.belongsTo,
        expand: `"sensor"."id" = "multidatastream"."sensor_id"`,
        link: `"sensor"."id" = (SELECT "multidatastream"."sensor_id" from "multidatastream" WHERE "multidatastream"."id" =$ID)`,
        entityName: "Sensors",
        tableName: "multidatastream",
        relationKey: "id",
        entityColumn: "sensor_id",
        tableKey: "id",
      },
      Observations: {
        type: ERelations.hasMany,
        expand: `"observation"."id" in (SELECT "observation"."id" from "observation" WHERE "observation"."multidatastream_id" = "multidatastream"."id")`,
        link: `"observation"."id" in (SELECT "observation"."id" from "observation" WHERE "observation"."multidatastream_id" = $ID)`,

        entityName: "Observations",
        tableName: "observation",
        relationKey: "multidatastream_id",
        entityColumn: "id",
        tableKey: "id",
      },
      ObservedProperties: {
        type: ERelations.belongsTo,
        expand: `"observedproperty"."id" in (SELECT "multidatastreamobservedproperty"."observedproperty_id" FROM "multidatastreamobservedproperty" WHERE "multidatastreamobservedproperty"."multidatastream_id" = "multidatastream"."id")`,
        link: `"observedproperty"."id" in (SELECT "multidatastreamobservedproperty"."observedproperty_id" FROM "multidatastreamobservedproperty" WHERE "multidatastreamobservedproperty"."multidatastream_id" = $ID)`,
        entityName: "ObservedProperties",
        tableName: "multidatastreamobservedproperty",
        relationKey: "observedproperty_id",
        entityColumn: "multidatastream_id",
        tableKey: "multidatastream_id",
      },
      Lora: {
        type: ERelations.belongsTo,
        expand: `"lora"."id" = (SELECT "lora"."id" from "lora" WHERE "lora"."multidatastream_id" = "multidatastream"."id")`,
        link: `"lora"."id" = (SELECT "lora"."id" from "lora" WHERE "lora"."multidatastream_id" = $ID)`,
        entityName: "loras",
        tableName: "lora",
        relationKey: "multidatastream_id",
        entityColumn: "id",
        tableKey: "id",
      },
      FeatureOfInterest: {
        type: ERelations.belongsTo,
        expand: "",
        link: "",
        entityName: "FeaturesOfInterest",
        tableName: "featureofinterest",
        relationKey: "_default_foi",
        entityColumn: "id",
        tableKey: "id",
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
        'FOREIGN KEY ("_default_foi") REFERENCES "featureofinterest"("id") ON UPDATE CASCADE ON DELETE CASCADE',
    },
    indexes: {
      multidatastream_sensor_id:
        'ON public."multidatastream" USING btree ("sensor_id")',
      multidatastream_thing_id:
        'ON public."multidatastream" USING btree ("thing_id")',
    },
});