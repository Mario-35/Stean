/**
 * Observations entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { Id, IreturnResult, koaContext } from "../../types";
import { getBigIntFromString } from "../../helpers";
import { messages } from "../../messages";
import { EConstant, EErrors, EExtensions, EHttpCode } from "../../enums";
import { logging } from "../../log";
import { executeSqlValues } from "../helpers";
import { _DEBUG } from "../../constants";
import { queries } from "../queries";
import { DATASTREAM, MULTIDATASTREAM } from "../../models/entities";

export class Observations extends Common {
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }

    // Prepare odservations
    async prepareInputResult(dataInput: Record<string, any>): Promise<object> {
        console.log(logging.whereIam(new Error().stack));
        // IF MultiDatastream
        if (
            (dataInput[MULTIDATASTREAM.singular] && dataInput[MULTIDATASTREAM.singular] != null) ||
            (this.ctx.odata.parentEntity && this.ctx.odata.parentEntity.name.startsWith(MULTIDATASTREAM.singular))
        ) {
            // get MultiDatastream search ID
            const searchID: Id =
                dataInput[MULTIDATASTREAM.singular] && dataInput[MULTIDATASTREAM.singular] != null
                    ? BigInt(dataInput[MULTIDATASTREAM.singular][EConstant.id])
                    : getBigIntFromString(this.ctx.odata.parentId);
            if (!searchID) this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: messages.str(EErrors.noFound, MULTIDATASTREAM.name) });
            // Search id keys
            const tempSql = await executeSqlValues(this.ctx.service, queries.multiDatastreamsUnitsKeys(searchID));
            if (tempSql[0 as keyof object] === null) this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: messages.str(EErrors.noFound, MULTIDATASTREAM.name) });

            const multiDatastream: Record<string, any> = tempSql[0 as keyof object];
            if (dataInput["result"] && typeof dataInput["result"] == "object") {
                logging
                    .message("result : keys", `${Object.keys(dataInput["result"]).length} : ${multiDatastream.length}`)
                    .to()
                    .log()
                    .file();
                if (Object.keys(dataInput["result"]).length != multiDatastream.length) {
                    this.ctx.throw(EHttpCode.badRequest, {
                        code: EHttpCode.badRequest,
                        detail: messages.str(EErrors.sizeResultUnitOfMeasurements, String(Object.keys(dataInput["result"]).length), multiDatastream.length)
                    });
                }
                dataInput["result"] = { value: Object.values(dataInput["result"]), valueskeys: dataInput["result"] };
            }
        } // IF Datastream
        else if ((dataInput[DATASTREAM.singular] && dataInput[DATASTREAM.singular] != null) || (this.ctx.odata.parentEntity && this.ctx.odata.parentEntity.name.startsWith(DATASTREAM.singular))) {
            if (dataInput["result"] && typeof dataInput["result"] != "object")
                dataInput["result"] = this.ctx.service.extensions.includes(EExtensions.resultNumeric) ? dataInput["result"] : { value: dataInput["result"] };
            // if no stream go out with error
        } else if (this.ctx.request.method === "POST") {
            this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: EErrors.noStream });
        }
        return dataInput;
    }

    formatDataInput(input: Record<string, any> | undefined): Record<string, any> | undefined {
        console.log(logging.whereIam(new Error().stack));
        if (input) if (!input["resultTime"] && input["phenomenonTime"]) input["resultTime"] = input["phenomenonTime"];
        return input;
    }

    // Override post to prepare datas before use super class
    async post(dataInput: Record<string, any>): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        if (dataInput) dataInput = await this.prepareInputResult(dataInput);
        if (dataInput["import"]) {
        } else return await super.post(dataInput);
    }

    // Override update to prepare datas before use super class
    async update(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        if (dataInput) dataInput = await this.prepareInputResult(dataInput);
        if (dataInput && dataInput["resultQuality"] && dataInput["resultQuality"]["nameOfMeasure"]) {
            dataInput["result"] = { quality: dataInput["result"] };
        }
        return await super.update(dataInput);
    }
}
