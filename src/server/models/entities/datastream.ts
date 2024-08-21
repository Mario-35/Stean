/**
 * entity Datastream
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity Datastream -----------------------------------!");

import { createEntity } from ".";
import { EDatesType, EObservationType, ERelations } from "../../enums";
import { IconfigFile, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _idRel, _text, _tz } from "./constants";
import { addDoubleQuotes } from "../../helpers";
import { _ID } from "../../db/constants";

export const Datastream:Ientity  = createEntity("Datastreams", {
  createOrder: 7,
    order: 1,
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
      _default_foi: {
        create: "BIGINT NOT NULL DEFAULT 1",
        alias() {},
        type: "relation:FeaturesOfInterest",
      },
    },
    relations: {
      Thing: {
        type: ERelations.belongsTo,
        expand: `"thing"."id" = "datastream"."thing_id"`,
        link: `"thing"."id" = (SELECT "datastream"."thing_id" from "datastream" WHERE "datastream"."id" =$ID)`,
        entityName: "Things",
        tableName: "datastream",
        relationKey: "id",
        entityColumn: "thing_id",
        tableKey: "id",
      },
      Sensor: {
        type: ERelations.belongsTo,
        expand: `"sensor"."id" = "datastream"."sensor_id"`,
        link: `"sensor"."id" = (SELECT "datastream"."sensor_id" from "datastream" WHERE "datastream"."id" =$ID)`,        
        entityName: "Sensors",
        tableName: "datastream",
        relationKey: "id",
        entityColumn: "sensor_id",
        tableKey: "id",
      },
      ObservedProperty: {
        type: ERelations.belongsTo,
        expand: `"observedproperty"."id" = "datastream"."observedproperty_id"`,
        link: `"observedproperty"."id" = (SELECT "datastream"."observedproperty_id" from "datastream" WHERE "datastream"."id" =$ID)`,
        entityName: "ObservedProperties",
        tableName: "datastream",
        relationKey: "id",
        entityColumn: "observedproperty_id",
        tableKey: "id",
      },
      Observations: {
        type: ERelations.hasMany,
        expand: `"observation"."id" in (SELECT "observation"."id" from "observation" WHERE "observation"."datastream_id" = "datastream"."id" ORDER BY "observation"."resultTime" ASC)`,
        link: `"observation"."id" in (SELECT "observation"."id" from "observation" WHERE "observation"."datastream_id" = $ID ORDER BY "observation"."resultTime" ASC)`,
        entityName: "Observations",
        tableName: "observation",
        relationKey: "datastream_id",
        entityColumn: "id",
        tableKey: "id",
      },
      Lora: {
        type: ERelations.belongsTo,
        expand: `"lora"."id" = (SELECT "lora"."id" from "lora" WHERE "lora"."datastream_id" = "datastream"."id")`,
        link: `"lora"."id" = (SELECT "lora"."id" from "lora" WHERE "lora"."datastream_id" = $ID)`,
        entityName: "Loras",
        tableName: "lora",
        relationKey: "datastream_id",
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
      datastream_pkey: 'PRIMARY KEY ("id")',
      datastream_unik_name: 'UNIQUE ("name")',
      datastream_observedproperty_id_fkey:
        'FOREIGN KEY ("observedproperty_id") REFERENCES "observedproperty"("id") ON UPDATE CASCADE ON DELETE CASCADE',
      datastream_sensor_id_fkey:
        'FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON UPDATE CASCADE ON DELETE CASCADE',
      datastream_thing_id_fkey:
        'FOREIGN KEY ("thing_id") REFERENCES "thing"("id") ON UPDATE CASCADE ON DELETE CASCADE',
      datastream_featureofinterest_id_fkey:
        'FOREIGN KEY ("_default_foi") REFERENCES "featureofinterest"("id") ON UPDATE CASCADE ON DELETE CASCADE',
    },
    indexes: {
      datastream_observedproperty_id:
        'ON public."datastream" USING btree ("observedproperty_id")',
      datastream_sensor_id: 'ON public."datastream" USING btree ("sensor_id")',
      datastream_thing_id: 'ON public."datastream" USING btree ("thing_id")',
    },
  });