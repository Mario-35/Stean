/**
 * InfosRoute connection page.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { appVersion } from "../../constants";
import { queries } from "../../db/queries";
import { returnFormats } from "../../helpers";
import { koaContext } from "../../types";

/**
 * 
 * @param ctx koa context
 * @param file file to load
 */
export const InfosRoute = async (ctx: koaContext) => {
    ctx.type = returnFormats.html.type;
    ctx.body = await 
        config.adminConnection().unsafe(queries.infos()).then((res) => {            
        return {
            "Postgres": res[0 as keyof object],
            "extensions": res[1 as keyof object],
            "logFile": res[2 as keyof object],
            "services": config.getServicesNames(),
            "stean": appVersion,
            "state": config.getState(ctx),
        }
    });
};
