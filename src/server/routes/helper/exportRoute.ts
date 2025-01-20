/**
 * exportRoute connection page.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { returnFormats } from "../../helpers";
import { koaContext } from "../../types";

export const exportRoute = async (ctx: koaContext) => {
    ctx.type = returnFormats.json.type;
    ctx.body = await config.export();
};
