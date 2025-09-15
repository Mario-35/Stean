import { EDataType } from "../../enums";
import { Core } from "./core";

export class Relation extends Core {
    constructor(input: string) {
        super(EDataType.bigint);
        this._.dataType = EDataType.link;
        this.relation(input.trim());
    }
}
