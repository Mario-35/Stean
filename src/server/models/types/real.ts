/**
 * Type real
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EDataType } from "../../enums";
import { Core } from "./core";

export class Real extends Core {
    constructor() {
        super(EDataType.real);
    }

    generated() {
        this._.create = "REAL";
        return this;
    }
}
