/**
 * createIentityColumnAliasOptions
 *
 * @copyright 2022-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Ientity, IentityColumnAliasOptions, IodataContext } from "../../../types";
import { PgVisitor } from "../pg/pgVisitor";

export function createIentityColumnAliasOptions(
    entity: Ientity,
    columnName: string,
    context: IodataContext | undefined,
    operation: string | undefined,
    forceString: boolean | undefined,
    pgVisitor: PgVisitor
): IentityColumnAliasOptions {
    return {
        entity: entity,
        columnName: columnName,
        operation: operation,
        alias: false,
        forceString: forceString || false,
        valueskeys: pgVisitor.valueskeys,
        numeric: pgVisitor.numeric,
        context: context
    };
}
