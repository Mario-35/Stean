/**
 * doSomeWorkAfterCreateAst
 *
 * @copyright 2022-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { RootPgVisitor } from "..";
import { config } from "../../../configuration";
import { multiDatastreamKeys } from "../../../db/queries";
import { logging } from "../../../log";
import { koaContext } from "../../../types";
export const doSomeWorkAfterCreateAst = async (input: RootPgVisitor, ctx: koaContext) => {
    console.log(logging.whereIam(new Error().stack));
    if (input.entity && input.splitResult && input.splitResult[0].toUpperCase() == "ALL" && input.parentId && <bigint>input.parentId > 0) {
        const temp = await config.connection(ctx.service.name).unsafe(`${multiDatastreamKeys(input.parentId)}`);
        input.splitResult = temp[0]["keys"];
    }
};
