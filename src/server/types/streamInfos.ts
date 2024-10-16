/**
 * streamInfos interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { _STREAM } from "../db/constants";
import { EObservationType } from "../enums";
export interface IstreamInfos {
    type:            _STREAM, 
    id:              BigInt, 
    observationType: EObservationType, 
    FoId:            BigInt
}
