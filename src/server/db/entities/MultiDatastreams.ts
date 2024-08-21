/**
 * MultiDatastreams entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- MultiDatastreams entity -----------------------------------!");

import { koaContext } from "../../types";
import { Common } from "./common";
import { errors, msg } from "../../messages/";
import { log } from "../../log";

export class MultiDatastreams extends Common {
  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    super(ctx);
  }

  formatDataInput(input: Record<string, any>  | undefined): Record<string, any>  | undefined {
    console.log(log.whereIam());
    if (!input) this.ctx.throw(400, { code: 400, detail: errors.noData });
    const temp = this.getKeysValue(input, ["FeaturesOfInterest", "foi"]);
    if (temp) input["_default_foi"] = temp;
    if ( input["multiObservationDataTypes"] && input["unitOfMeasurements"] && input["ObservedProperties"] ) {
      if ( input["multiObservationDataTypes"].length != input["unitOfMeasurements"].length )
        this.ctx.throw(400, {
          code: 400,
          detail: msg(
            errors.sizeListKeysUnitOfMeasurements,
            input["unitOfMeasurements"].length,
            input["multiObservationDataTypes"].length
          ),
        });
      if ( input["multiObservationDataTypes"].length != input["ObservedProperties"].length )
        this.ctx.throw(400, {
          code: 400,
          detail: msg(
            errors.sizeListKeysObservedProperties,
            input["ObservedProperties"].length,
            input["multiObservationDataTypes"].length
          ),
        });
    }
    if ( input && input["multiObservationDataTypes"] && input["multiObservationDataTypes"] != null )
      input["multiObservationDataTypes"] = JSON.stringify( input["multiObservationDataTypes"] )
        .replace("[", "{")
        .replace("]", "}");
    if (input["observationType"]) {
      if ( !this.ctx.model.MultiDatastreams.columns[ "observationType" ].verify?.list.includes(input["observationType"]) )
        this.ctx.throw(400, { code: 400, detail: errors["observationType"] });
    } else
      input["observationType"] =
      this.ctx.model.MultiDatastreams.columns["observationType"].verify?.default;

    return input;
  }
}
