/**
 * cleanDb
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { executeSql, executeSqlValues } from ".";
import { EChar } from "../../enums";
import { asyncForEach } from "../../helpers";
import { logging } from "../../log";
import { koaContext } from "../../types";
import { queries } from "../queries";

export const cleanDb = async (ctx: koaContext) => {
    const result: Record<string, string> = {};
    const listTables = await executeSqlValues(ctx.service, queries.listPartionned()).then((res) => {
        const listTables: string[] = res[0 as keyof object];
        return listTables.filter((table) => !table.endsWith("iddefault")).filter((table) => !table.endsWith("_id0"));
    });
    await executeSql(ctx.service, [queries.updateNb("datastream", true), queries.updateNb("multidatastream", true)]);
    await asyncForEach(listTables, async (table: string) => {
        logging.status(true, queries.cluster(table));
        await executeSql(ctx.service, queries.cluster(table)).then(() => {
            result[table] = EChar.ok;
        });
    });
    return result;
};
