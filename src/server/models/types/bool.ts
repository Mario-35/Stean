/**
 * Type Boolean
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EDataType } from "../../enums";
import { Core } from "./core";

export class Bool extends Core {
    constructor() {
        super(EDataType.bool);
    }
}
