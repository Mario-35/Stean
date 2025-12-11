/**
 * Observations entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { Id, IreturnResult, koaContext } from "../../types";
import { asyncForEach, doubleQuotes, getBigIntFromString, makeNull } from "../../helpers";
import { messages } from "../../messages";
import { EConstant, EErrors, EHttpCode } from "../../enums";
import { logging } from "../../log";
import { executeSql, executeSqlValues } from "../helpers";
import { queries } from "../queries";
import { DATASTREAM, MULTIDATASTREAM, OBSERVATION } from "../../models/entities";

export class Observations extends Common {
    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx);
    }

    // Prepare odservations
    async prepareInputResult(dataInput: Record<string, any>): Promise<object> {
        console.log(logging.whereIam(new Error().stack));
        if (dataInput.hasOwnProperty("value")) {
            return dataInput["value"][0];
        }
        // IF MultiDatastream
        if (
            (dataInput[MULTIDATASTREAM.singular] && dataInput[MULTIDATASTREAM.singular] != null) ||
            (this.ctx._.odata.parentEntity && this.ctx._.odata.parentEntity.name.startsWith(MULTIDATASTREAM.singular))
        ) {
            // get MultiDatastream search ID
            const searchID: Id =
                dataInput[MULTIDATASTREAM.singular] && dataInput[MULTIDATASTREAM.singular] != null
                    ? BigInt(dataInput[MULTIDATASTREAM.singular][EConstant.id])
                    : getBigIntFromString(this.ctx._.odata.parentId);
            if (!searchID) this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: messages.str(EErrors.noFound, MULTIDATASTREAM.name) });
            // Search id keys
            const tempSql = await executeSqlValues(this.ctx._.service, queries.multiDatastreamsUnitsKeys(searchID));
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
        else if ((dataInput[DATASTREAM.singular] && dataInput[DATASTREAM.singular] != null) || (this.ctx._.odata.parentEntity && this.ctx._.odata.parentEntity.name.startsWith(DATASTREAM.singular))) {
            if (dataInput["result"] && typeof dataInput["result"] != "object")
                dataInput["result"] = this.ctx._.service._numeric ? dataInput["result"] : { value: dataInput["result"] };
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

    columnsValues(keys: string[], input: string[]): string {
        const res: string[] = [];
        keys.forEach((elem: string, index: number) => {
            if (Object.keys(OBSERVATION.relations).includes(elem)) {
                if (typeof input[index] === "object") {
                    try {
                        const tmp = input[index]["name" as keyof object];
                        res.push(`(SELECT id from "${elem.toLowerCase()}" WHERE name = '${tmp}')`);
                    } catch (error) {
                        res.push(logging.error(error).return(`null`));
                    }
                }
            } else
                switch (elem) {
                    case EConstant.id:
                        break;
                    case "result":
                        if (typeof input[index] === "object") res.push(`'{"value" : [${input[index]}]}'`);
                        else res.push(`'{"value" : ${input[index]}}'`);
                        break;

                    default:
                        res.push(`'${input[index]}'`);
                }
        });
        return makeNull(res.join(","));
    }

    // Override post to prepare datas before use super class
    async post(dataInput: Record<string, any>): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        if (dataInput) dataInput = await this.prepareInputResult(dataInput);
        if (dataInput.hasOwnProperty("components")) {
            let keys: string[] = dataInput["components"];
            let added = 0;
            let errors = 0;
            const sql = `INSERT INTO "${OBSERVATION.table}" (${keys
                .filter((e) => e !== EConstant.id)
                .map((e) => (Object.keys(OBSERVATION.relations).includes(e) ? doubleQuotes(`${e.toLowerCase()}_id`) : doubleQuotes(e)))
                .join(",")})\n VALUES`;
            await asyncForEach(dataInput["dataArray"], async (values: string[]) => {
                try {
                    await executeSql(this.ctx._.service, `${sql} (${this.columnsValues(keys, values)})\n`).then(() => (added += 1));
                } catch (error) {
                    logging.error(error);
                    errors += 1;
                }
            });
            return this.formatReturnResult({
                body: {
                    added: added,
                    error: errors
                }
            });
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
