/**
 * formatColumnValue
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { ESCAPE_SIMPLE_QUOTE } from "../../constants";
import { EConstant, EDataType } from "../../enums";
import { doubleQuotesString, simpleQuotesString, removeFirstEndSimpleQuotes, removeFirstAndEnd, isString } from "../../helpers";
import { log } from "../../log";
import { IentityColumn } from "../../types";
/**
 *
 * @param columnName string
 * @param value
 * @param type
 * @returns string or undefined
 */

export function formatColumnValue(columnName: string, value: any, column: IentityColumn): string | undefined {
    const idLink = (value: any) => {
        return value.hasOwnProperty(EConstant.name)
            ? `(SELECT "id" FROM "${columnName.split("_")[0]}" WHERE "name" = '${ESCAPE_SIMPLE_QUOTE(value[EConstant.name])}')`
            : value.hasOwnProperty(EConstant.id)
            ? value[EConstant.id]
            : removeFirstAndEnd(value, "@");
    };
    console.log(log.debug_head(`${columnName} [${column.dataType}] ==> ${value}`));
    if (value)
        switch (value) {
            case void 0:
                return "";
            case null:
                return "null";
            case value.isRawInstance:
                return value.toQuery();
            default:
                switch (column.dataType) {
                    case EDataType.bigint:
                        return isNaN(value) ? idLink(value) : value;
                    case EDataType.boolean:
                        if (value === "false") value = 0;
                        return `'${value ? 1 : 0}'`;
                    case EDataType.json:
                    case EDataType.jsonb:
                        return simpleQuotesString(ESCAPE_SIMPLE_QUOTE(JSON.stringify(value)));
                    case EDataType._text:
                        return isString(value) ? simpleQuotesString(value) : simpleQuotesString(`{${value.map((e: string) => doubleQuotesString(removeFirstEndSimpleQuotes(e))).join(",")}}`);
                    case EDataType.result:
                        return simpleQuotesString(ESCAPE_SIMPLE_QUOTE(JSON.stringify(value)));
                    case EDataType.date:
                    case EDataType.time:
                    case EDataType.timestamp:
                    case EDataType.timestamptz:
                        return simpleQuotesString(value);
                    case EDataType.link:
                        return idLink(value);
                    case EDataType.text:
                        try {
                            return value.includes("'") ? simpleQuotesString(ESCAPE_SIMPLE_QUOTE(value)) : simpleQuotesString(value);
                        } catch (error) {
                            return simpleQuotesString(typeof value === "object" ? JSON.stringify(value) : value);
                        }
                    default:
                        process.stdout.write(`====[ERROR]=========${column.dataType}] ===============` + EConstant.return);
                        break;
                }
                if (String(value).startsWith("(SELECT")) return `${value}`;
                try {
                    return value.includes("'") ? simpleQuotesString(ESCAPE_SIMPLE_QUOTE(value)) : simpleQuotesString(value);
                } catch (error) {
                    return simpleQuotesString(value);
                }
        }
}
