/**
 * Index Js.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Index Js -----------------------------------!");

import fs from "fs";
import path from "path";

export const addJsFile = (name: string): string => (fs.existsSync(__dirname + `/${name}`)) ? fs.readFileSync(__dirname + `/${name}`, "utf-8") : fs.readFileSync(__dirname + `/${name.replace(".js",".min.js")}`, "utf-8");
export const listaddJsFiles = (): string[] => {
	const result: string[] = [];
	fs.readdirSync(path.join(__dirname)).filter((e: string) => e.endsWith(".js")).forEach(file => {
		result.push(file);
	});
	return result;
};