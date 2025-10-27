/**
 * createInsertValues
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant } from "../../enums";
import { doubleQuotes, removeFirstEndDoubleQuotes } from "../../helpers";
import { logging } from "../../log";
import { Ientity } from "../../types";
import { formatColumnValue } from "./formatColumnValue";
/**
 *
 * @param service Service
 * @param input JSON
 * @param entityName string
 * @returns string
 */
export function createInsertValues(entity: Ientity, input: Record<string, any>): string {
    console.log(logging.whereIam(new Error().stack));
    if (input) {
        const keys: string[] = [];
        const values: string[] = [];
        Object.keys(input).forEach((elem: string) => {
            if (input[elem]) {
                if (input[elem].startsWith && input[elem].startsWith('"{') && input[elem].endsWith('}"')) {
                    input[elem] = removeFirstEndDoubleQuotes(input[elem].replace(/\\"+/g, ""));
                } else if (input[elem].startsWith && input[elem].startsWith(`{"${EConstant.name}"`)) {
                    input[elem] = `(SELECT "id" FROM "${elem.split("_")[0]}" WHERE "name" = '${JSON.parse(removeFirstEndDoubleQuotes(input[elem]))[EConstant.name]}')`;
                }
                const tmp = formatColumnValue(elem, input[elem], entity.columns[elem]);
                if (tmp) {
                    keys.push(doubleQuotes(elem));
                    values.push(tmp);
                } else logging.error(`ERROR createInsertValues : ${elem}`, input[elem]).toLogAndFile();
            }
        });
        return `\n\t(${keys.join(",\n\t")})\n\tVALUES\n\t(${values.join(",\n\t")})`;
    }
    return "";
}
