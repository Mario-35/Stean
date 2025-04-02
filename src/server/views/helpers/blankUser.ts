/**
 * blankUser
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EExtensions } from "../../enums";
import { Iuser, Iservice } from "../../types";
export function blankUser(service: Iservice): Iuser {
    return {
        id: 0,
        username: "query",
        password: "",
        email: "",
        database: service.pg.database,
        canPost: !service.extensions.includes(EExtensions.users),
        canDelete: !service.extensions.includes(EExtensions.users),
        canCreateUser: !service.extensions.includes(EExtensions.users),
        canCreateDb: !service.extensions.includes(EExtensions.users),
        admin: false,
        superAdmin: false
    };
}
