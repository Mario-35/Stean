/**
 * InfosRoute connection page.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { appVersion, getState } from "../../constants";
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
        config.adminConnection().unsafe( ` select version(), (SELECT ARRAY(SELECT extname||'-'||extversion AS extension FROM pg_extension) AS extension), (SELECT c.relname||'.'||a.attname FROM pg_attribute a JOIN pg_class c ON (a.attrelid=c.relfilenode) WHERE a.atttypid = 114) ;`
    ).then((res) => {
        return {
        "Postgres": res[0 as keyof object],
        "extensions": res[1 as keyof object],
        "services": config.getServicesNames(),
        "stean": appVersion,
        "state": getState(),
        }
    });
};
