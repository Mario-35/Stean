import { EDataType } from "../../enums";
import { singular } from "../helpers";
import { Core } from "./core";

export class Tmperiod extends Core {
    constructor() {
        super(EDataType.period, "TIMESTAMP");
    }
    
    source(source: string) {
        this._create = singular(source).toLowerCase();
        return this;
    }
}



