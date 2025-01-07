/**
 * Constants of API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import path from 'path';
import fs from "fs";

export const ESCAPE_ARRAY_JSON = (input: string) => input ? input.replace("[", "{") .replace("]", "}") : undefined;
export const ESCAPE_SIMPLE_QUOTE = (input: string) => input.replace(/[']+/g, "''");
export const TIMESTAMP = (): string => { const d = new Date(); return d.toLocaleTimeString(); };
export function setDebug(input: boolean) { _DEBUG = input; }
export function setReady(input: boolean) { _READY = input; }
export let _TRACE = true;
export let _DEBUG = false;
export let _READY = false;
export const rootpath = path.join(path.resolve(__dirname, process.env.NODE_ENV?.trim() === "production" ? "../api" :  "../../src/server/"));
export const packageJsonPath = path.join(__dirname, process.env.NODE_ENV?.trim() === "production" ?  "./package.json" : "../../package.json");
export const uploadPath = path.join(path.resolve(__dirname, process.env.NODE_ENV?.trim() === "production" ? "../upload/" :  "../../upload/"));
export const appVersion =  String(JSON.parse(String(fs.readFileSync(packageJsonPath, "utf-8"))).version);