/**
 * queryMaker interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EOperation } from "../enums";
import { Ientity } from "./entity";

export interface IqueryMaker  {
    [key: string]: {
        type: EOperation;
        entity: Ientity;
        datas: object;
        keyId: string;
    }
}