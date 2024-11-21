import { EDataType } from "../../enums";
import { Core } from "./core";

export class Jsonb extends Core {
    constructor() {
        super(EDataType.jsonb, "JSONB");
    }
}



