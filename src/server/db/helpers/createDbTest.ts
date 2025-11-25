/**
 * createDbTest
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EHttpCode } from "../../enums";
import { koaContext } from "../../types";
import { testDatas } from "../createDb";
import { createService } from "./createService";

export const createDbTest = async (ctx: koaContext) => {
    try {
        ctx.body = await createService(testDatas);
        ctx.status = EHttpCode.created;
    } catch (error) {
        console.log(error);
        ctx.status = EHttpCode.badRequest;
        ctx.redirect(`${ctx.-.root}/error`);
    }
};
