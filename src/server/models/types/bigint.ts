import { EDataType } from "../../enums";
import { doubleQuotesString } from "../../helpers";
import { Iservice } from "../../types";
import { Core } from "./core";

export class Bigint extends Core {
    constructor() {
        super(EDataType.bigint, "BIGINT");
    }

    generated(name: string) {
        this._override = {
            create: "BIGINT GENERATED ALWAYS AS IDENTITY",
            alias(service: Iservice, test: Record<string, boolean>) {
                return `"${name}"${test["alias"] && (test["alias"] === true) === true ? ` AS ${doubleQuotesString(`@iot.${name}`)}` : ""}`;
            },
            dataType: EDataType.bigint
        };
        return this;
    }
}
