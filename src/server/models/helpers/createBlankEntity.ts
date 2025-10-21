/**
 * createBlankEntity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { singular } from ".";
import { allEntities, EentityType, EErrors } from "../../enums";
import { messages } from "../../messages";
import { Ientity } from "../../types";

export const createBlankEntity = (name: string, table?: string): Ientity => {
    const entity = allEntities[name];
    if (entity) {
        return {
            type: EentityType.blank,
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
    throw new Error(messages.str(EErrors.noValidEntity, name));
};
