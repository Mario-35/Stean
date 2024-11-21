import { EDataType } from "../../enums";
import { Core } from "./core";

export class Relation extends Core {
    constructor() {
        super(EDataType.link, "BIGINT");
    }
}
