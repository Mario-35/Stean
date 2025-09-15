/**
 * createDefaultContext
 *
 * @copyright 2022-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EQuery } from "../../../enums";
import { IodataContext } from "../../../types";

export function createDefaultContext(def?: EQuery): IodataContext {
    return {
        target: def || EQuery.Where,
        key: undefined,
        entity: undefined,
        table: undefined,
        identifier: undefined,
        relation: undefined,
        literal: undefined,
        sign: undefined,
        sql: undefined,
        onEachResult: undefined,
        in: undefined
    };
}
