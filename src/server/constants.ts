/**
 * Constants of API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
*/

import { Iversion } from "./types";
import { EConstant, EState } from "./enums";
import { getVersion } from "./helpers";

process.env.NODE_ENV = process.env.NODE_ENV || "production";
let _state: EState = EState.start;
let _debug = process.env.NODE_ENV?.trim() === EConstant.test || false;

export const appVersion: Iversion = getVersion();
export const timestampNow = (): string => new Date().toLocaleTimeString();
export function setDebug(state: boolean) {
    _debug = state;
}

export function setState(state: EState) {
    _state = state;
}

export function isState(state: EState) {
    return _state === state;
}

export function getState() {
    return _state;
}

export function isDebug() {
    return _debug === true;
}

export function espireTime() {
    return Math.floor(Date.now() / 1000) + 60 * 60 // 60 seconds * 60 minutes = 1 hour
}
 
