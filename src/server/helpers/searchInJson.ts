/**
 * searchInJson
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

/**
 *
 * @param obj object source
 * @param search key string search
 * @returns value or undefined if not found
 */
function loopThroughJSON(obj: Record<string, any>, search: string): string | undefined {
    for (let key in obj) {
        if (typeof obj[key] === "object") {
            if (Array.isArray(obj[key])) {
                // loop through array
                for (let i = 0; i < obj[key].length; i++) {
                    const temp = loopThroughJSON(obj[key][i], search);
                    if (temp) return temp;
                }
            } else {
                // call function recursively for object
                const temp = loopThroughJSON(obj[key], search);
                if (temp) return temp;
            }
        } else if (key === search) return obj[key];
    }
}

/**
 *
 * @param obj object source
 * @param search key string or array of string to search
 * @returns value or undefined if not found
 */
export function searchInJson(obj: Record<string, any>, search: string | string[]): string | undefined {
    let result: string | undefined = undefined;
    if (typeof search === "string") result = loopThroughJSON(obj, search);
    else
        search.forEach((element) => {
            const test = loopThroughJSON(obj, element);
            if (test) {
                result = test;
                return;
            }
        });
    return result;
}
