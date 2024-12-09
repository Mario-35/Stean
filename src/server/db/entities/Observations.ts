/**
 * Observations entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { getDBDateNow } from "../helpers";
import { IreturnResult, keyobj, koaContext } from "../../types";
import { getBigIntFromString } from "../../helpers";
import { errors, msg } from "../../messages";
import { multiDatastreamsUnitsKeys } from "../queries";
import { EConstant, EExtensions, EHttpCode } from "../../enums";
import { log } from "../../log";
import { config } from "../../configuration";

export class Observations extends Common {
  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    super(ctx);
  }

  // Prepare odservations 
  async prepareInputResult(dataInput: Record<string, any> ): Promise<object> {    
    console.log(log.whereIam());
    // IF MultiDatastream
    if ( (dataInput["MultiDatastream"] && dataInput["MultiDatastream"] != null) || (this.ctx.odata.parentEntity && this.ctx.odata.parentEntity.name.startsWith("MultiDatastream")) ) {
      // get MultiDatastream search ID
      const searchID: bigint | undefined = dataInput["MultiDatastream"] && dataInput["MultiDatastream"] != null
          ? BigInt(dataInput["MultiDatastream"][EConstant.id])
          : getBigIntFromString(this.ctx.odata.parentId);
      if (!searchID) this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: msg(errors.noFound, "MultiDatastreams"), });
      // Search id keys
      const tempSql = await config.executeSqlValues(this.ctx.service, multiDatastreamsUnitsKeys(searchID) );
      if (tempSql[0 as keyof object] === null) 
        this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: msg(errors.noFound, "MultiDatastreams"), });
      
      const multiDatastream: Record<string, any> = tempSql[0 as keyobj];
      if (dataInput["result"] && typeof dataInput["result"] == "object") {
        console.log(log.debug_infos( "result : keys", `${Object.keys(dataInput["result"]).length} : ${ multiDatastream.length }` ));
        if ( Object.keys(dataInput["result"]).length != multiDatastream.length ) {
          this.ctx.throw(EHttpCode.badRequest, {
            code: EHttpCode.badRequest,
            detail: msg(
              errors.sizeResultUnitOfMeasurements,
              String(Object.keys(dataInput["result"]).length),
              multiDatastream.length
            ),
          });
        }
        dataInput["result"] = { value: Object.values(dataInput["result"]), valueskeys: dataInput["result"], };
      }
    } // IF Datastream
    else if ((dataInput["Datastream"] && dataInput["Datastream"] != null) || (this.ctx.odata.parentEntity && this.ctx.odata.parentEntity.name.startsWith("Datastream")) ) { 
      if (dataInput["result"] && typeof dataInput["result"] != "object")
          dataInput["result"] = this.ctx.service.extensions.includes( EExtensions.resultNumeric )
                                ? dataInput["result"]
                                : { value: dataInput["result"] };
    // if no stream go out with error
    } else if (this.ctx.request.method === "POST") {
      this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: errors.noStream });
    }
    return dataInput;
  }

  formatDataInput(input: Record<string, any> | undefined): Record<string, any> | undefined {
    console.log(log.whereIam());
    if (input) 
      if (!input["resultTime"] && input["phenomenonTime"]) input["resultTime"] = input["phenomenonTime"];
    return input;
  }

  // Override post to prepare datas before use super class
  async post(dataInput: Record<string, any>): Promise<IreturnResult | undefined | void> {
    console.log(log.whereIam());
    if (dataInput) dataInput = await this.prepareInputResult(dataInput);
    if (dataInput["import"]) {
      
    } else return await super.post(dataInput);
  }

  // Override update to prepare datas before use super class
  async update( idInput: bigint, dataInput: Record<string, any> | undefined ): Promise<IreturnResult | undefined | void> {
    console.log(log.whereIam());
    if (dataInput) dataInput = await this.prepareInputResult(dataInput);
    if (dataInput) dataInput["validTime"] = await getDBDateNow(this.ctx.service);
    if (dataInput && dataInput["resultQuality"] && dataInput["resultQuality"]["nameOfMeasure"]) {
      dataInput["result"] = { quality: dataInput["result"] };
    }
    return await super.update(idInput, dataInput);
  }



}
