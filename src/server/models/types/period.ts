/**
 * Type Period
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EDataType, EDatesType, EQuery } from "../../enums";
import { doubleQuotes } from "../../helpers";
import { IentityColumnAliasOptions } from "../../types";
import { as } from "../helpers";
import { Core } from "./core";

export class Period extends Core {
    constructor(tz?: "tz" | "TZ") {
        super(tz ? EDataType.tstzrange : EDataType.tsrange);
        this._.alias = function (options: IentityColumnAliasOptions) {
            if (options.context && (options.context.target === EQuery.Where || options.context.target === EQuery.Select)) {
                return `NULLIF (CONCAT_WS('/', to_char(lower(${doubleQuotes(options.columnName)}), '${tz ? EDatesType.dateTz : EDatesType.date}'), to_char(upper(${doubleQuotes(
                    options.columnName
                )}), '${tz ? EDatesType.dateTz : EDatesType.date}')), '')${as(options)}`;
            } else return doubleQuotes(options.columnName);
        };
    }
}
