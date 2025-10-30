/**
 * reorganiseRecord
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { isObject } from "./tests";

export function reorganiseRecord(input: Record<string, any>) {
    // properties first
    const pop: Record<string, any> = {};
    Object.keys(input).forEach((e) => {
        if (!isObject(input[e])) {
            pop[e] = input[e];
            delete input[e];
        }
    });

    return { ...pop, ...input };
}
