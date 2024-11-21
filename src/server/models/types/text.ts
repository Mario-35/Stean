import { EDataType } from "../../enums";
import { Core } from "./core";

export class Text extends Core {
    constructor() {
        super(EDataType.text, "TEXT");
    }

    verify(input: string[]): this  {
        this._verify.list = input;
        return this;
    }
}



