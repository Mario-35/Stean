import { EDataType } from "../../enums";
import { IentityColumn, Iservice } from "../../types";

export class Core {
    _override: IentityColumn | undefined;
    _dataType: EDataType;
    _orderBy: string | undefined;
    _cast: string;
    _create: string;
    _coalesce: string;
    _entityRelation: string | undefined = undefined;
    _verify: {
        list: string[] | undefined;
        default: string | undefined;
    } = {
        list: undefined,
        default: undefined
    };

    constructor(dataType: EDataType, cast: string, entityRelation?: string) {
        this._dataType = dataType;
        this._cast = cast;
        this._create = `@CAST@@NULL@@UNIQUE@@DEFAULT@`;
        this._entityRelation = entityRelation;
    }

    coalesce(input: string) {
        this._coalesce = input;
        return this;
    }
    defaultOrder(input: "asc" | "desc") {
        this._orderBy = input;
        return this;
    }

    type(): IentityColumn {
        if (this._override) return this._override;
        const res: IentityColumn = {
            dataType: this._dataType,
            create: this._create.replace("@CAST@", this._cast).replace("@DEFAULT@", "").replace("@NULL@", "").replace("@UNIQUE@", ""),
            alias() {}
        };
        if (this._orderBy) res.orderBy = this._orderBy;
        if (this._entityRelation) res.entityRelation = this._entityRelation;
        if (this._coalesce) res.coalesce = this._coalesce;
        if (this._verify.default && this._verify.list)
            res.verify = {
                list: this._verify.list,
                default: this._verify.default
            };
        return res;
    }

    notNull(): this {
        this._create = this._create.replace("@NULL@", " NOT NULL");
        return this;
    }

    unique(): this {
        this._create = this._create.replace("@UNIQUE@", " UNIQUE");
        return this;
    }

    default(input: string | number): this {
        if (typeof input === "number") input = String(input);
        this._create = this._create.replace("@DEFAULT@", input.trim() !== "" ? ` DEFAULT '${input.trim()}'::${this._cast}` : "");
        this._verify.default = input.trim();
        return this;
    }

    relation(input: string): this {
        this._entityRelation = input.trim();
        return this;
    }

    alias(alias: string, create: string, dataType: EDataType) {
        this._override = {
            create: "JSONB NULL",
            alias(service: Iservice, test: Record<string, boolean> | undefined) {
                return `"result"->'line'${test && test["as"] === true ? ` AS "result"` : ""}`;
            },
            dataType: dataType
        };
        return this;
    }
}
