/**
 * Index messages
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EErrors, EInfos } from "../enums";

class Messages {
    _: string;

    str(input: EInfos | EErrors, ...args: string[]) {
        this._ = input;
        for (let i = 0; i < args.length; i++) this._ = this._.split(`$${i + 1}`).join(args[i]);
        return this._;
    }
}

export const messages = new Messages();
