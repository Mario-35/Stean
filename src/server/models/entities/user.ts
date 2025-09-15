/**
 * entity User.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Ientity } from "../../types";
import { Entity } from "../entity";
import { EentityType } from "../../enums";
import { Bigint, Bool, Text } from "../types";

export const USER: Ientity = new Entity("Users", {
    createOrder: -1,
    type: EentityType.table,
    order: 21,
    columns: {
        id: new Bigint().generated().column(),
        username: new Text().notNull().unique().defaultOrder("asc").column(),
        email: new Text().column(),
        password: new Text().column(),
        database: new Text().column(),
        canPost: new Bool().column(),
        canDelete: new Bool().column(),
        canCreateUser: new Bool().column(),
        canCreateDb: new Bool().column(),
        admin: new Bool().column(),
        superAdmin: new Bool().column()
    },
    relations: {}
});
