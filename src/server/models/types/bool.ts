import { EDataType } from "../../enums";
import { Core } from "./core";

export class Bool extends Core {
    constructor() {
        super(EDataType.bool);
    }
}
