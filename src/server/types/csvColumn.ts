/**
 * IcsvColumn interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IstreamInfos } from "./streamInfos";
export interface    IcsvColumn {
    column:         string; 
    stream:         IstreamInfos;
}