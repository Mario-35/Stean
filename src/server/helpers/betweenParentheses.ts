/**
 * betweenParentheses
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { logging } from "../log";

/**
 *
 * @param input: string
 * @returns clean string with ["$", "&", "?"] undesired removed
 */

export const betweenParentheses = (input: string): string => {
    if (input) {
        try {
            const testString = input.match(/(?:\()[^\(\)]*?(?:\))/g);
            return testString ? testString[1].slice(0, -1).slice(1).trim(): input;
        } catch (error) {
            logging.error(error);
        }
    }
    return input;
}