import { EDataType, EDatesType } from "../../enums";
import { Iservice } from "../../types";
import { Core } from "./core";

export class Timestamp extends Core {
    constructor(tz?: "tz" | "TZ") {
        super(tz ? EDataType.timestamptz : EDataType.timestamp, tz ? "TIMESTAMPTZ" : "TIMESTAMP");
    }

    defaultCurrent() {
        this._create = this._create.replace("@DEFAULT@", " DEFAULT CURRENT_TIMESTAMP");
        return this;
    }

    alias(alias: string) {
        const tmpType = this._dataType === EDataType.timestamptz ? EDatesType.dateTz : EDatesType.date;
        this._override = {
            create: "",
            alias(service: Iservice, test: Record<string, boolean> | undefined) {
                return `CONCAT(to_char("_${alias}Start",'${tmpType}'),'/',to_char("_${alias}End",'${tmpType}')) AS "${alias}"`;
            },
            dataType: EDataType.text
        };
        return this;
    }
}
