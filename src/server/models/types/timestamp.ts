import { EDataType, EDatesType } from "../../enums";
import { IKeyBoolean, Iservice } from "../../types";
import { Core } from "./core";

export class Timestamp extends Core {
    constructor() {
        super(EDataType.timestamp, "TIMESTAMP");
    }

    tz() {
        this._cast = `${this._cast}TZ`;
        this._dataType = EDataType.timestamptz;
        return this;
    }

    defaultCurrent()  {
        this._create = this._create.replace('@DEFAULT@', ' DEFAULT CURRENT_TIMESTAMP');
        return this;
    }

    
    alias(alias: string) {
        this._override = {
            create: "",
            alias(service: Iservice , test: IKeyBoolean | undefined) {
              return  `CONCAT(to_char("_${alias}Start",'${EDatesType.date}'),'/',to_char("_${alias}End",'${EDatesType.date}')) AS "${alias}"`;
    
            },
            dataType: EDataType.text
        }
        return this;
    }
}



