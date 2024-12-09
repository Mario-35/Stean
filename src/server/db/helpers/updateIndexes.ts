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
    Object.keys(models.DBFull(name)).forEach((entity: string) => {
        const tmp = models.DBFull(name)[entity].update;
        if (tmp) tmp.forEach(e => config
            .connection(name)
            .unsafe(e)
            .catch((error: Error) => {
                console.error(error);
                console.log(error);
                return false;
            }));
    });
}
