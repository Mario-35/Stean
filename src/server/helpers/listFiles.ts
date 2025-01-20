/**
 * listFiles
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import fs from "fs";
import path from "path";

export function listFiles(source: string, extension: string): string[] {
    const result: string[] = [];
    fs.readdirSync(path.join(source))
        .filter((e: string) => e.endsWith(`.${extension}`))
        .forEach((file) => {
            result.push(file);
        });
    return result;
}
