/**
 * createQueryParams
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { getAuthenticatedUser } from "../../authentication";
import { config } from "../../configuration";
import { EConstant } from "../../enums";
import { log } from "../../log";
import { Ientities, IqueryOptions, koaContext } from "../../types";
import { blankUser } from "./";

export async function createQueryParams(ctx: koaContext): Promise<IqueryOptions | undefined> {
    console.log(log.whereIam());
    let user = await getAuthenticatedUser(ctx);
    user = user ? user : blankUser(ctx.service);
    const listEntities =
        user.superAdmin === true
            ? Object.keys(ctx.model)
            : user.admin === true
            ? Object.keys(ctx.model).filter((elem: string) => ctx.model[elem].order > 0 || ctx.model[elem].createOrder === 99 || ctx.model[elem].createOrder === -1)
            : user.canPost === true
            ? Object.keys(ctx.model).filter((elem: string) => ctx.model[elem].order > 0 || ctx.model[elem].createOrder === 99 || ctx.model[elem].createOrder === -1)
            : Object.keys(ctx.model).filter((elem: string) => ctx.model[elem].order > 0);
    listEntities.push("Services", "Logs");
    return {
        methods: ["GET"],
        decodedUrl: ctx.decodedUrl,
        entity: "",
        options: ctx.querystring ? ctx.querystring : "",
        user: user,
        graph: ctx.url.includes("$resultFormat=graph"),
        admin: ctx.service.name === EConstant.admin,
        services: config.getInfosForAll(ctx),
        _DATAS: Object.fromEntries(Object.entries(ctx.model).filter(([k, v]) => listEntities.includes(k) && v.order >= 0)) as Ientities
    };
}
