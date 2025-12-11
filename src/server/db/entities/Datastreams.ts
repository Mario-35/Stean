/**
 * Datastreams entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EErrors, EHttpCode } from "../../enums";
import { logging } from "../../log";
import { DATASTREAM } from "../../models/entities";
import { koaContext } from "../../types";
import { queries } from "../queries";
import { Common } from "./common";

/**
 * Datastreams Class
 */

export class Datastreams extends Common {
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }

    formatDataInput(input: Record<string, any> | undefined): Record<string, any> | undefined {
        console.log(logging.whereIam(new Error().stack));
        if (input) {
            if (input["FeatureOfInterest"]) {
                input["_default_featureofinterest"] = `@(${queries.getFromIdOrName("featureofinterest", "id", input["FeatureOfInterest"])})@`;
                delete input["FeatureOfInterest"];
            }
            const colName = "observationType";
            if (input[colName]) {
                if (!DATASTREAM.columns[colName].verify?.list.includes(input[colName])) this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: EErrors.observationType });
            } else input[colName] = DATASTREAM.columns[colName].verify?.default;
        }
        return input;
    }
}
