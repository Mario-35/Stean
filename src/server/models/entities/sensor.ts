/**
 * entity Sensor
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
import { info } from "../../messages";
  export const Sensor:Ientity  = createEntity("Sensors", {
    createOrder: 6,
    type: ETable.table,
    order: 9,
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
      encodingType: {
        create: _text('application/pdf'),
        alias() {},
        dataList: {
          PDF: "application/pdf",
          SensorML: "http://www.opengis.net/doc/IS/SensorML/2.0",
        },
        type: "list",
        dataType: EDataType._text
      },
      metadata: {
        create: _text('none.pdf'),
        alias() {},
        type: "text",
        dataType: EDataType.text
      },
    },
    constraints: {
      sensor_pkey: 'PRIMARY KEY ("id")',
      sensor_unik_name: 'UNIQUE ("name")',
    },
    relations: {
      Datastreams: {
        type: ERelations.hasMany
      },
      MultiDatastreams: {
        type: ERelations.hasMany
      }
    },
  });