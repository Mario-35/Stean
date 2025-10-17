/**
 * Type Relation
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EDataType } from "../../enums";
import { Core } from "./core";

export class Relation extends Core {
    constructor(input: string, myType: EDataType = EDataType.bigint) {
        super(myType);
        this._.dataType = EDataType.link;
        this.relation(input.trim());
    }
}
