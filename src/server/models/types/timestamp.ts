import { EDataType } from "../../enums";
import { Core } from "./core";

export class Timestamp extends Core {
    constructor(tz?: "tz" | "TZ") {
        super(tz ? EDataType.timestamptz : EDataType.timestamp);
    }

    defaultCurrent() {
        this._.create = this._.create.replace("@DEFAULT@", " DEFAULT CURRENT_TIMESTAMP");
        return this;
    }
}
