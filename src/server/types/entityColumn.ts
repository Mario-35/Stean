/**
 * entityColumn interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { IKeyString, IKeyBoolean, Iservice, typeExtensions } from ".";
export interface IentityColumn {
    [key: string]: {
        readonly create:    string;
        extensions?:        typeof typeExtensions;
        alias(config:       Iservice, test?: IKeyBoolean): string | undefined | void;
        readonly unique?:   boolean;
        readonly test?:     string;
        readonly dataList?: IKeyString;
        readonly type:      string;
        readonly verify?: {
            list: string[];
            default: string;
        }
    };
}