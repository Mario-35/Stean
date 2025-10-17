/**
 * MultiDatastreams entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { koaContext } from "../../types";
import { Common } from "./common";
import { messages } from "../../messages/";
import { logging } from "../../log";
import { MULTIDATASTREAM } from "../../models/entities";
import { EHttpCode } from "../../enums";
import { _DEBUG } from "../../constants";

export class MultiDatastreams extends Common {
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }

    formatDataInput(input: Record<string, any> | undefined): Record<string, any> | undefined {
        console.log(logging.whereIam(new Error().stack));
        if (!input) this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: messages.errors.noData });
        const temp = this.getKeysValue(input, ["FeaturesOfInterest", "foi"]);
        if (temp) input["_default_featureofinterest"] = temp;
        if (input["multiObservationDataTypes"] && input["unitOfMeasurements"] && input["ObservedProperties"]) {
            if (input["multiObservationDataTypes"].length != input["unitOfMeasurements"].length)
                this.ctx.throw(EHttpCode.badRequest, {
                    code: EHttpCode.badRequest,
                    detail: messages.create(messages.errors.sizeListKeysUnitOfMeasurements).replace(input["unitOfMeasurements"].length, input["multiObservationDataTypes"].length).toString()
                });
            if (input["multiObservationDataTypes"].length != input["ObservedProperties"].length)
                this.ctx.throw(EHttpCode.badRequest, {
                    code: EHttpCode.badRequest,
                    detail: messages.create(messages.errors.sizeListKeysObservedProperties).replace(input["ObservedProperties"].length, input["multiObservationDataTypes"].length).toString()
                });
        }
        if (input && input["multiObservationDataTypes"] && input["multiObservationDataTypes"] != null)
            input["multiObservationDataTypes"] = JSON.stringify(input["multiObservationDataTypes"]).replace("[", "{").replace("]", "}");
        if (input["observationType"]) {
            if (!MULTIDATASTREAM.columns["observationType"].verify?.list.includes(input["observationType"]))
                this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: messages.errors["observationType"] });
        } else input["observationType"] = MULTIDATASTREAM.columns["observationType"].verify?.default;
        return input;
    }
}
