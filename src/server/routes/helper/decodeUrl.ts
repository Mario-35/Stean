/**
 * Helpers for user admin.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { setDebug } from "../../constants";
import { EConstant, EFrom, EHttpCode } from "../../enums";
import { cleanUrl, removeFromUrl } from "../../helpers";
import { logging } from "../../log";
import { IdecodedUrl, koaContext } from "../../types";
//   service root URI                   resource path     query options
// __________|______________________________|___________ _______|____________
//                                 \                   \                  \
// http://example.org:8029/test/v1.1/Things(1)/Locations?$orderby=ID&$top=10
// _____/________________/____/____/___________________/___________________/
//   |           |         |    |         |                |
// protocol    host   service  version  pathname         search

/**
 *
 * @param ctx koa context
 * @param input own url (use ctx.href if not)
 * @returns IdecodedUrl
 */
export const decodeUrl = (ctx: koaContext, input?: string): IdecodedUrl | undefined => {
    // get input.separator
    input = input || ctx.href;
    // debug mode
    setDebug(input.includes("?$debug=true"));
    console.log(logging.whereIam(new Error().stack));
    // decode url
    const url = new URL(
        cleanUrl(
            removeFromUrl(input, ["debug=true"])
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
        )
    );
    // get configName from port
    let configName: string | undefined = undefined;
    // path[0] : service, path[1] : version, path[...] : path
    const paths = url.pathname.split("/").filter((e) => e != "");

    // no service
    if (paths[0]) configName = configName || config.getConfigNameFromName(paths[0].toLowerCase());
    else ctx.throw(EHttpCode.notFound);
    // else throw new Error(errors.noNameIdentified);
    // get getLinkBase from service
    if (configName) {
        const LinkBase = config.getInfos(ctx, configName);
        let idStr: string | undefined = undefined;
        let id: string | 0 = 0;
        // if nothing ===> root
        let path = "/";
        // id string or number
        if (paths[2]) {
            id = paths[2].includes("(") ? paths[2].split("(")[1].split(")")[0] : 0;
            idStr = isNaN(+id) ? String(id) : undefined;
            path = paths.slice(2).join("/");
        }

        // result
        return {
            origin: url.origin,
            search: url.search,
            service: paths[0],
            version: paths[0] === EConstant.admin ? "v1.0" : paths[1],
            path: idStr ? path.replace(String(id), "0") : path,
            id: isNaN(+id) ? BigInt(0) : BigInt(id),
            idStr: idStr, // Lora deveUI
            configName: configName,
            linkbase: LinkBase.linkBase,
            root: LinkBase.root,
            from: ctx.request.headers.host === "mqtt" ? EFrom.mqtt : EFrom.unknown
        };
    }
};
