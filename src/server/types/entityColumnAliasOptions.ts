/**
 * entityColumnAliasOptions interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Ientity } from "./entity";
import { IodataContext } from "./odataContext";

export interface IentityColumnAliasOptions {
    entity: Ientity;
    columnName: string;
    operation?: string;
    alias?: boolean;
    showTable?: boolean;
    forceString?: boolean;
    valueskeys?: boolean;
    numeric?: boolean;
    context?: IodataContext;
}
