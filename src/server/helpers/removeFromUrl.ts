/**
 * removeFromUrl
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

/**
 *
 * @param input: string
 * @param remove: string or string[] to remove
 * @returns clean url
 */
export const removeFromUrl = (input: string, remove: string | string[]): string => {
    if (typeof remove == 'string') remove = [remove];
    remove.forEach(e => {
        input = input.replace(`&$${e}`, "").replace(`$${e}`, "");
    });
    return input;
};
