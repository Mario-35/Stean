/**
 * Index Css.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import fs from "fs";
import path from "path";
const getCssFile = (name: string): string => (fs.existsSync(path.join(__dirname, "/", name)) ? fs.readFileSync(path.join(__dirname, "/", name), "utf-8") : fs.readFileSync(path.join(__dirname, "/", name.replace(".css", ".min.css")), "utf-8"));
export const addCssFile = (name: string | string[]): string => {
    if (typeof name === "string") return getCssFile(name);
    else {
        const res: string[] = [];
        name.forEach((e) => res.push(getCssFile(e)));
        return res.join("");
    }
};

export const listaddCssFiles = (): string[] => {
    const result: string[] = [];
    fs.readdirSync(path.join(__dirname))
        .filter((e: string) => e.endsWith(".css"))
        .forEach((file) => {
            result.push(file);
        });
    return result;
};
