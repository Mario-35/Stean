/**
 * decodedUrl interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EFrom } from "../enums";

// onsole.log("!----------------------------------- decodedUrl interface -----------------------------------!");
export interface IdecodedUrl {
    linkbase:   string;
    root:       string;
    search:     string;
    path:       string;
    id:         bigint;
    idStr:      string | undefined;
    service:    string;
    version:    string;
    configName: string | undefined;
    from:       EFrom;
}