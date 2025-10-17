/**
 * Type Texts
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EDataType } from "../../enums";
import { Core } from "./core";

export class Texts extends Core {
    constructor() {
        super(EDataType._text);
    }

    verify(input: string[]): this {
        this._.verify = {
            list: input,
            default: ""
        };
        return this;
    }
}
