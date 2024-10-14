/**
 * Constants of API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import util from "util";
export const ESCAPE_ARRAY_JSON = (input: string) => input ? input.replace("[", "{") .replace("]", "}") : undefined;
export const ESCAPE_SIMPLE_QUOTE = (input: string) => input.replace(/[']+/g, "''");
export const TIMESTAMP = (): string => { const d = new Date(); return d.toLocaleTimeString(); };
export function setDebug(input: boolean) { _DEBUG = input; }
export function setReady(input: boolean) { _READY = input; }
export function showAll<T>(input: T, colors?: boolean) { return typeof input === "object" ? util.inspect(input, { showHidden: false, depth: null, colors: colors || false, }) : input; }
export let _DEBUG = false;
export let _READY = false;
export const versionStr = (v: number) => `v${v}`
export const versionNb = (v: number | String) => Number(String(v).replace(/[^0-9]/g, '')) / 10;