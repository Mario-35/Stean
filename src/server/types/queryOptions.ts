/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Query interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Query interface -----------------------------------!");

import { IdecodedUrl, Ientities, IserviceInfos, Iuser } from ".";

export interface IqueryOptions {
    user:       Iuser;
    methods:    string[];
    entity:     string;
    subentity?: string;
    method?:    string;
    options:    string;
    services:   { [key: string]: IserviceInfos };
    decodedUrl: IdecodedUrl;
    datas?:     Record<string, any>;
    results?:   Record<string, any> | string;
    graph:      boolean;
    admin:      boolean;
    _DATAS:     Ientities
}
