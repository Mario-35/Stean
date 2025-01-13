/**
 * Index triggers
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import fs from "fs";
import path from "path";

/**
 *
 * @returns all sql files in directory
 */
export const pgFunctions = (): string[] => {
    const result: string[] = [];
    fs.readdirSync(path.join(__dirname))
        .filter((e: string) => e.endsWith(".sql"))
        .forEach((file) => {
            const content = fs.readFileSync(__dirname + `/${file}`, "utf8");
            result.push(content);
        });
    return result;
};
