/**
 * formatColumnValue
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- formatColumnValue -----------------------------------!");

import { ESCAPE_ARRAY_JSON, ESCAPE_SIMPLE_QUOTE } from "../../constants";
import { addDoubleQuotes, addSimpleQuotes, removeSimpleQuotes } from "../../helpers";
import { log } from "../../log";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function formatColumnValue(columnName: string, value: any, type: string): string | undefined {
    console.log(log.debug_head(`${columnName} [${type}] ==> ${value}`));
    switch (typeof value ) {
      case "object" :        
        return value.hasOwnProperty("@iot.name") 
        ? `(SELECT "id" FROM "${columnName.split("_")[0]}" WHERE "name" = '${ESCAPE_SIMPLE_QUOTE(value["@iot.name"])}')`
        : value.hasOwnProperty("@iot.id") 
        ? value["@iot.id"]
        : type === 'text[]' 
          ? addSimpleQuotes(`{${value.map((e: string) => addDoubleQuotes(removeSimpleQuotes(e))).join(",")}}`) 
          : `'${ESCAPE_SIMPLE_QUOTE(JSON.stringify(value))}'`;
      default:        
        if (value) switch (value) {
          case void 0:
            return '';
          case null:
            return 'null';
            case value.isRawInstance:
              return value.toQuery();
          default:
            switch (type) {
              case 'number':
                return value;
              case 'bool':
                if (value === 'false') value = 0;
                return `'${value ? 1 : 0}'`;
              case 'json':
              case 'jsonb':
                 return addSimpleQuotes(ESCAPE_SIMPLE_QUOTE(JSON.stringify(value)));
              case 'text[]':
                const temp = ESCAPE_ARRAY_JSON(String(value));
                if (temp) return addSimpleQuotes(temp);
                return "ARRAY ERROR";
              case 'result':
                return addSimpleQuotes(ESCAPE_SIMPLE_QUOTE(JSON.stringify(value)));
              default:
                break;
            }
            if (String(value).startsWith("(SELECT")) return `${value}`;
            try {
                return value.includes("'") ? addSimpleQuotes(ESCAPE_SIMPLE_QUOTE(value)): addSimpleQuotes(value);
            } catch (error) {            
                return addSimpleQuotes(value);
            }
        }
    } 
  }