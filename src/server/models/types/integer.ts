/**
 * Type Integer
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EDataType, EQuery } from "../../enums";
import { doubleQuotes } from "../../helpers";
import { IentityColumnAliasOptions } from "../../types";
import { Core } from "./core";

export class Integer extends Core {
    constructor() {
        super(EDataType.integer);
    }

    generated() {
        this._.create = "INT GENERATED ALWAYS AS IDENTITY";
        this._.alias = function alias(options: IentityColumnAliasOptions) {
            return `${doubleQuotes(options.entity.table)}.${doubleQuotes(options.columnName)}${options.context?.target === EQuery.Select ? ` AS ${doubleQuotes(`@iot.${options.columnName}`)}` : ""}`;
        };
        return this;
    }
}
