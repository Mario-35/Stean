/**
 * Entity interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Entity interface -----------------------------------!");

import { IentityColumn, IentityRelation, IKeyString } from ".";

export interface IentityCore {
     createOrder:   number;
     order:         number;
     orderBy:       string;
     columns:       IentityColumn;
     relations:     { [key: string]: IentityRelation };
     constraints?:  IKeyString;
     indexes?:      IKeyString;
     after?:        string;
}

export interface Ientity extends IentityCore {
     name:     string; // Entity Name
     singular: string;
     table:    string;
}