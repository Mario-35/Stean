/**
 * createBlankEntity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { singular } from ".";
import { allEntities, ETable } from "../../enums";
import { msg, errors } from "../../messages";
import { Ientity } from "../../types";

export const createBlankEntity = (name: string, table?: string): Ientity => {
    const entity = allEntities[name];
    if (entity) {
        return {
            type: ETable.blank,
            name: name,
            singular: singular(entity),
            table: table || "",
            createOrder: 99,
            order: 0,
            orderBy: "",
            columns: {},
            relations: {},
            constraints: {},
            indexes: {}
        };
    }
    throw new Error(msg(errors.noValidEntity, name));
};
