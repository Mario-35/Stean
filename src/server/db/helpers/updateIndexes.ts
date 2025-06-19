/**
 * updateIndexes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { models } from "../../models";

/**
 * this (re)create index without wait
 *
 * @param name
 */

export const updateIndexes = (name: string): void => {
    const mod = models.DBFull(name);
    if (mod)
        Object.keys(mod).forEach((entity: string) => {
            const tmp = mod[entity].update;
            if (tmp)
                tmp.forEach((e) =>
                    config
                        .connection(name)
                        .unsafe(e)
                        .catch((error: Error) => {
                            console.error(error);
                            console.log(error);
                            return false;
                        })
                );
        });
};
