/**
 * oData SQLLiteral
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- oData SQLLiteral -----------------------------------!")

import { Literal } from "./literal";

export class SQLLiteral extends Literal {
    static convert(type: string, value: string): any {
        return new SQLLiteral(type, value).valueOf();
    }
    "Edm.String"(value: string) {
        return "'" + decodeURIComponent(value).slice(1, -1).replace(/''/g, "'") + "'";
    }
    "Edm.Guid"(value: string) {
        return "'" + decodeURIComponent(value) + "'";
    }
    "Edm.Date"(value: string) {
        return "'" + value + "'";
    }
    "Edm.DateTimePeriod"(value: string): any {
        return "'" + value.trim() + "'";
    }
    "Edm.DateTimeOffset"(value: string): any {
        return "'" + value.replace("T", " ").replace("Z", " ").trim() + "'";
    }
    "Edm.Boolean"(value: string): any {
        value = value || "";
        switch (value.toLowerCase()) {
            case "true":
                return 1;
            case "false":
                return 0;
            default:
                return "NULL";
        }
    }
    "null"(value: string) {
        return null;
    }
}