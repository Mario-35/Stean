/**
 * Type Maker
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EDataType } from "../../enums";
import { doubleQuotes } from "../../helpers";
import { IentityColumn, IentityColumnAliasOptions } from "../../types";

export class Core {
    _: IentityColumn;
    cast: string | undefined;
    constructor(dataType: EDataType, cast?: string) {
        this._ = {
            dataType: dataType,
            create: `${EDataType[dataType.toString() as keyof typeof EDataType]}@NULL@@UNIQUE@@DEFAULT@`.toUpperCase(),
            alias(options: IentityColumnAliasOptions) {
                return doubleQuotes(options.columnName);
            }
        };
        this.cast = cast;
    }

    coalesce(input: string) {
        this._.coalesce = input;
        return this;
    }

    defaultOrder(input: "asc" | "desc") {
        this._.orderBy = input;
        return this;
    }

    column(): IentityColumn {
        this._.create = this._.create.replace("@DEFAULT@", "").replace("@NULL@", "").replace("@UNIQUE@", "");
        return this._;
    }

    notNull(): this {
        this._.create = this._.create.replace("@NULL@", " NOT NULL");
        return this;
    }

    unique(): this {
        this._.create = this._.create.replace("@UNIQUE@", " UNIQUE");
        // if (test) this._.create = this._.create.replace("@UNIQUE@", " UNIQUE");
        return this;
    }

    addIndexes(input: string | string[]) {
        this._.indexes = typeof input === "string" ? [input] : input;
        return this;
    }

    partition(input: "main" | "sub") {
        this._.partition = input;
        return this;
    }

    default(input: string | number): this {
        if (typeof input === "number") input = String(input);
        this._.create = this._.create.replace("@DEFAULT@", input.trim() !== "" ? ` DEFAULT '${input.trim()}'${this.cast ? `::${this.cast}` : ""}` : "");
        this._.verify = {
            list: [],
            default: input.trim()
        };
        return this;
    }

    relation(input: string): this {
        this._.entityRelation = input.trim();
        return this;
    }
}
