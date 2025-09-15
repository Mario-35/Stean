/**
 * Index Js.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import fs from "fs";
import path from "path";
import { listFiles } from "../../helpers";
export const addJsFile = (name: string): string =>
    fs.existsSync(path.join(__dirname, "/", name)) ? fs.readFileSync(path.join(__dirname, "/", name), "utf-8") : fs.readFileSync(path.join(__dirname, "/", name.replace(".js", ".min.js")), "utf-8");

export const listaddJsFiles = (): string[] => listFiles(path.join(__dirname), "js");
