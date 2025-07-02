import { formatResultColuwn } from ".";
import { EDataType } from "../../enums";
import { IentityColumn, Iservice } from "../../types";
import { Core } from "./core";

export class Result extends Core {
    constructor() {
        super(EDataType.result, "BIGINT");
    }

    type(): IentityColumn {
        if (this._override) return this._override;
        return {
            create: "JSONB NULL",
            alias: function functionResult(service: Iservice, test: Record<string, boolean> | undefined) {
                return test ? formatResultColuwn({ numeric: test["numeric"], valueskeys: test["valueskeys"], as: test["as"] }) : "result";
            },
            dataType: EDataType.result
        };
    }

    lines() {
        this._override = {
            create: "JSONB NULL",
            alias(service: Iservice, test: Record<string, boolean> | undefined) {
                return `"result"->'line'${test && test["as"] === true ? ` AS "result"` : ""}`;
            },
            dataType: EDataType.result
        };
        return this;
    }
}
