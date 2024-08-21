/**
 * cleanStringComma
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- cleanStringComma -----------------------------------!");

/**
 *
 * @param input: string
 * @param list: string[] a list of key to clean outside comma ("DESC" "ASC")
 * @returns clean string without undesired comma(s)
 */

export const cleanStringComma = (input: string, list?: string[]): string => {
    input = input.split(",").filter((word: string) => word.trim() != "").join(", ");
    if (list) list.forEach((e: string) => input = input.split(` ${e}"`).join(`" ${e}`));
    return input;
};