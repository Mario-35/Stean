import { EDataType } from "../../enums";
import { singular } from "../helpers";
import { Core } from "./core";

export class Tmperiod extends Core {
    constructor(tz: "time" | "timetz" | "timestamp" | "timestamptz") {
        super(EDataType.period, tz.toUpperCase());
    }

    source(source: string) {
        this._entityRelation = singular(source).toLowerCase();
        return this;
    }
}



