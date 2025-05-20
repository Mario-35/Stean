/**
 * createIdList
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author mario.adam@inrae.fr
 *
 */

/**
 * create ids list input `1,2,5` return `1,2,5`
 *                 input `1:5` return `1,2,2,4,5`
 *
 * @param input sting id
 * @returns array of ids
 */
export const createIdList = (input: string): string[] => {
    let result: string[] = [];
    if (input.includes(":")) {
        const f = input.split(":");
        for (let g = +f[0]; g <= +f[1]; g++) {
            result.push(String(g));
        }
    } else if (input.includes(",")) {
        result = input.split(",");
    } else result.push(String(input));
    return result.filter((e) => e.trim() != "");
};
