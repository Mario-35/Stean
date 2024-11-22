/**
 * entityColumn interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IKeyBoolean, Iservice } from ".";
import { EDataType } from "../enums";
export interface IentityColumn {    
        dataType:           EDataType;
        create:             string;
        entityRelation?:    string;
        alias(config:Iservice, test?: IKeyBoolean): string | undefined | void;
        verify?: {
            list: string[];
            default: string;
        }
    };