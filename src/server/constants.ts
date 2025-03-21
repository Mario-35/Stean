/**
 * Constants of API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import fs from "fs";
import { paths } from "./paths";

process.env.NODE_ENV = process.env.NODE_ENV || "production";

export const appVersion = String(JSON.parse(String(fs.readFileSync(paths.packageFile(), "utf-8"))).version);
export const ESCAPE_ARRAY_JSON = (input: string) => (input ? input.replace("[", "{").replace("]", "}") : undefined);
export const ESCAPE_SIMPLE_QUOTE = (input: string) => input.replace(/[']+/g, "''");
export const timestampNow = (): string => new Date().toLocaleTimeString();

export function setDebug(input: boolean) {
    _DEBUG = input;
}
export function setReady(input: boolean) {
    _READY = input;
}

export let _TRACE = true;
export let _DEBUG = false;
export let _READY = false;

// function to be used in catch
export function logDbError(err: any) {
    console.log(err);
    return false;
}

export const dateFile = () =>
    new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[^0-9]/g, "");
