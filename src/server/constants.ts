/**
 * Constants of API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

process.env.NODE_ENV = process.env.NODE_ENV || "production";
import { Iversion } from "./types";
import { EConstant } from "./enums";
import { getVersion } from "./helpers";

export const appVersion: Iversion = getVersion();
export const timestampNow = (): string => new Date().toLocaleTimeString();
export let _DEBUG = process.env.NODE_ENV?.trim() === EConstant.test || false;
export function setDebug(input: boolean) {
    // _DEBUG = true;
    _DEBUG = input;
}
export let _READY = false;
export function setReady(input: boolean) {
    _READY = input;
}

export function espireTime() {
    return Math.floor(Date.now() / 1000) + 60 * 60 // 60 seconds * 60 minutes = 1 hour
}
 
