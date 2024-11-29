import { EDataType } from "../../enums";
import { doubleQuotes } from "../../helpers";
import { IKeyBoolean, Iservice } from "../../types";
import { Core } from "./core";

export class Bigint extends Core {
    constructor() {
        super(EDataType.bigint, "BIGINT");
    }

    generated(name: string)  {
        this._override = {
            create: "BIGINT GENERATED ALWAYS AS IDENTITY",
            alias(service: Iservice, test: IKeyBoolean) {
                return `"${name}"${test["alias"] && test["alias"] === true  === true ? ` AS ${doubleQuotes(`@iot.${name}`)}`: ''}` ;
            },
            dataType: EDataType.bigint
        }
        return this;
    }
}



