/**
 * cleanDb
*
* @copyright 2020-present Inrae
* @author mario.adam@inrae.fr
*
*/

import { executeSql, executeSqlValues } from ".";
import { EChar, EState } from "../../enums";
import { asyncForEach } from "../../helpers";
import { logging } from "../../log";
import { koaContext } from "../../types";
import { queries } from "../queries";
import { setState } from "../../constants";

export const cleanDb = async (ctx: koaContext) => {
    setState(EState.clean);
    const result: Record<string, string> = {};
    const listTables = await executeSqlValues(ctx._.service, queries.listPartionned()).then((res) => {
        const listTables: string[] = res[0 as keyof object];
        return listTables.filter((table) => !table.endsWith("iddefault")).filter((table) => !table.endsWith("_id0"));
    });

    await asyncForEach(listTables, async (table: string) => {
        result[`Create index for ${table}`] = await executeSql(ctx._.service, queries.createClusterIndex(table))
        .then(() => EChar.ok)
        .catch(() => EChar.notOk);
    });

    result["Update all indexes"] = await executeSql(ctx._.service, [queries.updateNb("datastream", true), queries.updateNb("multidatastream", true)])
    .then(() => EChar.ok)
    .catch(() => EChar.notOk);

    await asyncForEach(listTables, async (table: string) => {
        logging.status(true, queries.cluster(table));
        result[`Cluster for ${table}`] = await executeSql(ctx._.service, queries.cluster(table))
        .then(() => EChar.ok)
        .catch(() => EChar.notOk);
    });

    result["Complete Vacuum"] = await executeSql(ctx._.service, 'VACUUM;')        
    .then(() => EChar.ok)
    .catch(() => EChar.notOk);

    setState(EState.normal);
    return result;
};
