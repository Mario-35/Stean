/**
 * Constants of API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export const ESCAPE_ARRAY_JSON = (input: string) => input ? input.replace("[", "{") .replace("]", "}") : undefined;
export const ESCAPE_SIMPLE_QUOTE = (input: string) => input.replace(/[']+/g, "''");
export const TIMESTAMP = (): string => { const d = new Date(); return d.toLocaleTimeString(); };
export function setDebug(input: boolean) { _DEBUG = input; }
export function setReady(input: boolean) { _READY = input; }
export let _TRACE = true;
export let _DEBUG = false;
export let _READY = false;