/**
 * createIndexes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { EChar } from "../../enums";
import { asyncForEach } from "../../helpers";
import { log } from "../../log";
import { models } from "../../models";

// this create index are executed without wait 
export const createIndexes = (name: string): void => {
    const exe = async (name: string, queries: string[]): Promise<boolean> => {
        await asyncForEach( queries, async (query: string) => {
          await config
            .connection(name)
            .unsafe(query)
            .catch((error: Error) => {
                console.error(error);
                console.log(error);
                return false;
            });
        });
        log.create(`Indexes : [${name}]`, EChar.ok);
        return true;
    }

    const sqls: string[] = [];
    Object.keys(models.DBFull(name)).forEach((entity: string) => {
        const tmp = models.DBFull(name)[entity].update;
        if (tmp) tmp.forEach(e => sqls.push(e));
    });
    exe(name, sqls);
}
