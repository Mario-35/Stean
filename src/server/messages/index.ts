/**
 * Index messages
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EHttpCode } from "../enums";
import jsonErrors from "./error.json";
import jsonInfos from "./infos.json";
import jsonQueries from "./queries.json";

export const getErrorCode = (err: Error | any, actual: number): number => {
    if (err["where"] && err["where"].includes("verifyid")) return EHttpCode.notFound;
    return actual;
};

class Messages {
    errors = jsonErrors;
    infos = jsonInfos;
    queries = jsonQueries;

    _: string;

    createInfos(input: string[]) {
        this._ = input.map((e) => (this.infos as Record<string, string>)[e]).join(" ");
        return this;
    }

    create(input: string, args?: string) {
        this._ = input;
        if (args) this.replace(args);
        return this;
    }

    replace(...args: string[]) {
        for (let i = 0; i < args.length; i++) this._ = this._.split(`$${i + 1}`).join(args[i]);
        return this;
    }

    toString(input?: string) {
        if (input) this.replace(input);
        return this._;
    }
}

export const messages = new Messages();
