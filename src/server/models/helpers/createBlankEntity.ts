/**
 * createBlankEntity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { singular } from ".";
import { EentityType } from "../../enums";
import { Ientity } from "../../types";

export const createBlankEntity = (name: string, table?: string): Ientity => {
    return {
        type: EentityType.blank,
        name: name,
        singular: singular(name),
        table: table || "",
        createOrder: 99,
        order: 0,
        orderBy: "",
        columns: {},
        relations: {},
        constraints: {},
        indexes: {}
    };
};
