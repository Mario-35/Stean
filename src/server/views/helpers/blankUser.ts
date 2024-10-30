/**
 * blankUser
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EExtensions } from "../../enums";
import { Iuser, koaContext } from "../../types";
export function blankUser(ctx: koaContext):Iuser  {    
    return {
        id: 0,
        username: "query",
        password: "",
        email: "",
        database: ctx.service.pg.database,
        canPost: !ctx.service.extensions.includes(EExtensions.users),
        canDelete: !ctx.service.extensions.includes(EExtensions.users),
        canCreateUser: !ctx.service.extensions.includes(EExtensions.users),
        canCreateDb: !ctx.service.extensions.includes(EExtensions.users),
        admin: false,
        superAdmin: false
    }
};
