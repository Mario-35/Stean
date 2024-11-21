import { EDataType } from "../../enums";
import { Core } from "./core";

export class Texts extends Core {
    constructor() {
        super(EDataType._text, "TEXT[]");
    }

    verify(input: string[]): this  {
        this._verify.list = input;
        return this;
    }
}



