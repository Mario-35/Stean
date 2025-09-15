import { EDataType } from "../../enums";
import { Core } from "./core";

export class Geometry extends Core {
    constructor() {
        super(EDataType.geometry);
    }
}
