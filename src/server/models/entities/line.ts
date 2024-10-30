/**
 * lines line
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createEntity } from ".";
import { EConstant, EDataType, ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { doubleQuotesString } from "../../helpers";
import { _idBig } from "./constants";
export const Line:Ientity  = createEntity("Lines", {
    createOrder: 2,
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
      result: {
        create: "JSONB NULL",
        alias(service: Iservice , test: IKeyBoolean | undefined) {
          return `"result"->'line'${test && test["as"] === true ? ` AS "result"`: ''}`;
        },
        type: "result",
        dataType: EDataType.result
      },
      file_id: {
        create: "BIGINT NULL",
        alias() {},
        dataType: EDataType.link,
        type: "relation:Files",
      }
    },
    constraints: {
      line_pkey: 'PRIMARY KEY ("id")',
    },
    indexes: {
      line_file_id:
        'ON public."line" USING btree ("file_id")'
    },
    relations: {
      File: {
        type: ERelations.belongsTo
      },
    },
});