/**
 * Type numeric
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EDataType } from "../../enums";
import { Core } from "./core";

export class Numeric extends Core {
    constructor() {
        super(EDataType.numeric);
    }

    generated() {
        this._.create = "NUMERIC";
        return this;
    }
}
