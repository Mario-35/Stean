/**
 * entityRelation interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { ERelations } from "../enums";
export interface IentityRelation {
    type:            ERelations; // relation Type
    entityRelation?: string; // relationTable
}