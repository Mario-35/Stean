/**
 * IvisitRessource interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IodataContext } from ".";
import { Token } from "../odata/parser";
export interface IvisitRessource {
    (node: Token, context?: IodataContext): void;
};