/**
 * Type Time
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EDataType } from "../../enums";
import { Core } from "./core";

export class Time extends Core {
    constructor(tz?: "tz" | "TZ") {
        super(tz ? EDataType.timetz : EDataType.time);
    }

    defaultCurrent() {
        this._.create = this._.create.replace("@DEFAULT@", " DEFAULT CURRENT_TIME");
        return this;
    }
}
