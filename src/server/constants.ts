/**
 * Constants of API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import fs from "fs";
import { paths } from "./paths";
import { Iversion } from "./types";
import { EConstant } from "./enums";

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const _appVersion = (): Iversion => {
    const d = fs.fstatSync(fs.openSync(paths.packageFile(), "r")).mtime;
    return {
        version: String(JSON.parse(String(fs.readFileSync(paths.packageFile(), "utf-8"))).version),
        date: d.toLocaleDateString() + "-" + d.toLocaleTimeString()
    };
};
export const appVersion: Iversion = _appVersion();
export const ESCAPE_SIMPLE_QUOTE = (input: string) => input.replace(/[']+/g, "''");
export const timestampNow = (): string => new Date().toLocaleTimeString();

export function setReplay(input: string | undefined) {
    _REPLAY = input;
}

export function setDebug(input: boolean) {
    _DEBUG = input;
}

export const _CLEAN = !process.argv.includes("clean") ? true : undefined;
export let _DEBUG = process.env.NODE_ENV?.trim() === EConstant.test || false;
export let _REPLAY: string | undefined = undefined;
