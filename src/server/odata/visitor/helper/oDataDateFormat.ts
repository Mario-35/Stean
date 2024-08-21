/**
 * oDataDateFormat
 *
 * @copyright 2022-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- oDataDateFormat -----------------------------------!");
import { Token } from "../../parser";

export function oDataDateFormat(node: Token, test: string): string | undefined {
    const input = node.value.right.raw.replace(/\//g, "-").replace(/'/g, "").replace(/%27/g, "");
    const regexDateStartDay = /^[0-9]{2}[-][0-9]{2}[-][0-9]{4}$/g;
    const regexDateStartYear = /^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/g;
    const regexHour = /^[0-9]{2}[:][0-9]{2}[:][0-9]{2}$/g;
    const regexHourMin = /^[0-9]{2}[:][0-9]{2}$/g;
    const regexDateHourStartDay = /^[0-9]{2}[-][0-9]{2}[-][0-9]{4} [0-9]{2}[:][0-9]{2}$/g;
    const regexDateHourStartYear = /^[0-9]{4}[-][0-9]{2}[-][0-9]{2} [0-9]{2}[:][0-9]{2}$/g;
    if (regexDateStartDay.test(input) == true) return `::date ${test} TO_DATE('${input}','DD-MM-YYYY')`;
    if (regexDateStartYear.test(input) == true) return `::date ${test} TO_DATE('${input}','YYYY-MM-DD')`;
    if (regexHour.test(input) == true) return `::time ${test} TO_TIME('${input}','HH24:MI:SS')`;
    if (regexHourMin.test(input) == true) return (test === "=")   
        ? `::time >= TO_TIMESTAMP('${input}:00', 'HH24:MI:SS')::TIME AND "${node.value.left.raw}"::time <= TO_TIMESTAMP('${input}:59', 'HH24:MI:SS')::TIME`
        : `::time ${test} TO_TIMESTAMP('${input}:00', 'HH24:MI:SS')::TIME`;
    if (regexDateHourStartDay.test(input) == true) return `'${input}','DD-MM-YYYY HH24:MI:SS'`;
    if (regexDateHourStartYear.test(input) == true) return `'${input}','YYYY-MM-DDHH24:MI:SS'`;
}
