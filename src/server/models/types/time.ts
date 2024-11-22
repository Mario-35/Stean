import { EDataType, EDatesType } from "../../enums";
import { IKeyBoolean, Iservice } from "../../types";
import { Core } from "./core";

export class Time extends Core {

    constructor(tz?: "tz" | "TZ") {
        super(tz ? EDataType.timetz : EDataType.time, tz ? "TIMETZ" : "TIME");
    }

    defaultCurrent()  {
        this._create = this._create.replace('@DEFAULT@', ' DEFAULT CURRENT_TIME');
        return this;
    }

    
    alias(alias: string) {
        const tmpType  = this._dataType === EDataType.timetz ? EDatesType.timeTz : EDatesType.time;
        this._override = {
            create: "",
            alias(service: Iservice , test: IKeyBoolean | undefined) {
                return `CONCAT(to_char("_${alias}Start",'${tmpType}'),'/',to_char("_${alias}End",'${tmpType}')) AS "${alias}"`;    
            },
            dataType: EDataType.text
        }
        return this;
    }
}



