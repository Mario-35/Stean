/**
 * Entity interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IentityColumn, IentityRelation } from ".";
import { ETable } from "../enums";

export interface IentityCore {
    createOrder: number;
    type: ETable;
    order: number;
    columns: { [key: string]: IentityColumn };
    relations: { [key: string]: IentityRelation };
    after?: string;
    trigger?: string[];
}

export interface Ientity extends IentityCore {
    name: string; // Entity Name
    singular: string;
    table: string;
    constraints: { [key: string]: string };
    indexes: { [key: string]: string };
    // update?: string[];
    clean?: string[];
    orderBy: string;
}
