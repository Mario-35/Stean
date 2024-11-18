/**
 * Entity interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IentityColumn, IentityRelation, IKeyString } from ".";
import { ETable } from "../enums";
export interface IentityCore {
     createOrder:   number;
     type:          ETable;
     order:         number;
     orderBy:       string;
     columns:       { [key: string]: IentityColumn };
     relations:     { [key: string]: IentityRelation };
     constraints?:  IKeyString;
     indexes?:      IKeyString;
     clean?:        string[];
     after?:        string;
}
export interface Ientity extends IentityCore {
     name:     string; // Entity Name
     singular: string;
     table:    string;
}
