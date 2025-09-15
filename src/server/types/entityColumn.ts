/**
 * entityColumn interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IentityColumnAliasOptions } from ".";
import { EDataType } from "../enums";

export interface IentityColumn {
    dataType: EDataType;
    orderBy?: string;
    create: string;
    entityRelation?: string;
    coalesce?: string;
    alias(options: IentityColumnAliasOptions): string | undefined | void;
    verify?: {
        list: string[];
        default: string;
    };
}
