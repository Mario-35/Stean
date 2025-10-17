/**
 * Type Any
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant, EDataType, EQuery } from "../../enums";
import { doubleQuotes } from "../../helpers";
import { IentityColumnAliasOptions } from "../../types";
import { as } from "../helpers";

import { Core } from "./core";

export class Any extends Core {
    constructor() {
        super(EDataType.any);
        this._.create = "JSONB NULL";
        this._.alias = function alias(options: IentityColumnAliasOptions) {
            if (options.context && options.context.target === EQuery.Where) {
                const nbs = [1, 2, 3, 4, 5];
                const translate = `TRANSLATE (SUBSTRING (${doubleQuotes(options.columnName)}->>'value' FROM '(([0-9]+.*)*[0-9]+)'), '[]','')`;
                const isOperation = options.operation && options.operation.trim() != "";
                // json path = had to be ==
                // if (options && !options.context.onEachResult && options.context.sign === "=") options.context.sign = "==";
                if (options.forceString === false && !options.context.onEachResult && options.context.sign && options.context.sign === "=") options.context.sign = "==";

                return options.forceString === true
                    ? // operation on string
                      options.context.onEachResult
                        ? `@EXPRESSIONSTRING@ ALL (ARRAY_REMOVE( ARRAY[${EConstant.return}${nbs
                              .map((e) => `${isOperation ? `${options.operation} (` : ""} SPLIT_PART ( ${translate}, ',', ${e}))`)
                              .join(`,${EConstant.return}`)}], null))`
                        : `${doubleQuotes(options.columnName)}->>'value'`
                    : options.context.onEachResult
                    ? // OPERATION ROUND FLOOR CEILING (jsonpath can't process it)
                      `@EXPRESSION@ ALL (ARRAY_REMOVE( ARRAY[${EConstant.return}${nbs
                          .map((e) => `${isOperation ? `${options.operation} (` : ""}NULLIF (SPLIT_PART ( ${translate}, ',', ${e}),'')::numeric${isOperation ? `)` : ""}`)
                          .join(`,${EConstant.return}`)}], null))`
                    : // jsonpath postgres operation
                      `result @? '$.value ? (@EXPRESSION@ @)'`;
            } else {
                return options.valueskeys || options.numeric
                    ? `CASE
                            WHEN JSONB_TYPEOF( ${doubleQuotes(options.columnName)}->'value') = 'number' THEN (${doubleQuotes(options.columnName)}->${options.numeric == true ? "" : ">"}'value')::jsonb
                            WHEN JSONB_TYPEOF( ${doubleQuotes(options.columnName)}->'value') = 'array'  THEN (${doubleQuotes(options.columnName)}->'${
                          options.valueskeys == true ? "valueskeys" : "value"
                      }')::jsonb
                            ELSE (${doubleQuotes(options.columnName)}->'${options.valueskeys == true ? "valueskeys" : "value"}')::jsonb
                        END${as(options)}`
                    : `CASE
                            WHEN JSONB_TYPEOF( ${doubleQuotes(options.columnName)}->'value') = 'number' THEN (${doubleQuotes(options.columnName)}->>'value')::jsonb
                            WHEN JSONB_TYPEOF( ${doubleQuotes(options.columnName)}->'value') = 'array'  THEN (${doubleQuotes(options.columnName)}->'value')::jsonb
                            ELSE (${doubleQuotes(options.columnName)}->'value')::jsonb
                        END${as(options)}`;
            }
        };
    }

    lines() {
        this._.alias = function alias(options: IentityColumnAliasOptions) {
            return `${doubleQuotes(options.columnName)}->'line'`;
        };
        return this;
    }
}
