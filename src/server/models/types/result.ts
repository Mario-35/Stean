import { EDataType } from "../../enums";
import { IentityColumn, IKeyBoolean, Iservice } from "../../types";
import { Core } from "./core";

export class Result extends Core {
    constructor() {
        super(EDataType.result, "BIGINT");
    }
    
    type(): IentityColumn  {
        if(this._override) return this._override;
        return  {
            create: "JSONB NULL",
            alias: function functionResult(service: Iservice, test: IKeyBoolean | undefined) {
                if (!test) return "result";  
                if (test["valueskeys"] && test["valueskeys"] === true) 
                return `COALESCE("result"-> 'valueskeys', "result"-> 'value')${test && test["as"] === true ? ` AS "result"`: ''}`;
                if (test["numeric"] && test["numeric"] === true)
                return`CASE 
                WHEN jsonb_typeof("result"-> 'value') = 'number' THEN ("result"->>'value')::numeric 
                WHEN jsonb_typeof("result"-> 'value') = 'array' THEN ("result"->>'value')[0]::numeric 
                END${test && test["as"] === true ? ` AS "result"`: ''}`;
                return `COALESCE("result"->'quality', "result"->'value')${test && test["as"] === true ? ` AS "result"`: ''}`;
            },
            dataType: EDataType.result
        };
    }

    lines()  {
        this._override = {
            create: "JSONB NULL",
            alias(service: Iservice, test: IKeyBoolean | undefined) {
                return `"result"->'line'${test && test["as"] === true ? ` AS "result"`: ''}`;
            },
            dataType: EDataType.result
        }
        return this;
    }
}



