/**
 * Entity interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IentityColumn, IentityRelation } from ".";
import { EentityType } from "../enums";

export interface IentityCore {
    createOrder: number; // create order to respect constraint
    type: EentityType; // Entity type
    order: number; // order eault show
    columns: { [key: string]: IentityColumn }; // columns table
    relations: { [key: string]: IentityRelation }; // relations table
    after?: string; // execute after create (default ata for example)
    trigger?: string[];
}

export interface Ientity extends IentityCore {
    name: string; // Entity Name
    singular: string; // Singlar entity Name
    table: string; // table name
    constraints: { [key: string]: string }; // constraints table
    indexes: { [key: string]: string }; // indexes table
    orderBy: string; // default orderBy
    clean?: string[]; // Clean to execute at start service when argv clean is found _CLEAN global var to process after new version
    start?: string[]; // Start to execute at start service (recalc date or flush)
    partition?: string[];
}
