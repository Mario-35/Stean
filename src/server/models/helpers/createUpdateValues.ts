/**
 * createUpdateValues
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EDataType } from "../../enums";
import { doubleQuotes, escapeSimpleQuotes, simpleQuotes } from "../../helpers";
import { logging } from "../../log";
import { Ientity } from "../../types";

export function createUpdateValues(entity: Ientity, input: Record<string, any>): string {
    console.log(logging.whereIam(new Error().stack));
    return Object.keys(input)
        .map(
            (elem: string) =>
                `${doubleQuotes(elem)} = ${
                    input[elem][0] === "{"
                        ? `${entity.columns[elem].dataType === EDataType.any || EDataType.jsonb ? "" : `COALESCE(${doubleQuotes(elem)}, '{}'::jsonb) ||`} ${simpleQuotes(
                              escapeSimpleQuotes(input[elem])
                          )}`
                        : simpleQuotes(escapeSimpleQuotes(input[elem]))
                }`
        )
        .join();
}
