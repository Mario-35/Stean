/**
 * getVersion.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 *
 */

import { paths } from "../paths";
import { Iversion } from "../types";
import fs from "fs";

export function getVersion(): Iversion {
    const d = fs.fstatSync(fs.openSync(paths.packageFile(), "r")).mtime;
    return {
        version: String(JSON.parse(String(fs.readFileSync(paths.packageFile(), "utf-8"))).version),
        date: d.toLocaleDateString() + "-" + d.toLocaleTimeString()
    };
}
