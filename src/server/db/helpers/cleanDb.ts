/**
 * cleanDb
*
* @copyright 2020-present Inrae
* @author mario.adam@inrae.fr
*
*/

import { executeSql, executeSqlValues } from ".";
import { config } from "../../configuration";
import { EState } from "../../enums";
import { asyncForEach } from "../../helpers";
// import { logging } from "../../log";
import { koaContext } from "../../types";
import { queries } from "../queries";

export const cleanIndexes = async (ctx: koaContext, table: string) => {
    executeSqlValues(ctx._.service, `SELECT indexname FROM pg_indexes WHERE tablename = '${table}' and indexname LIKE '%_idx'`).then(async (res: any) => {
        await asyncForEach(res, async (table: string) => {
            console.log(table);
            
            await executeSql(ctx._.service, queries.dropIndex(table));

        });
        
    });    
}

export const cleanDb = async (ctx: koaContext) => {
    config.setServiceState(ctx._.service, EState.cleaning);
    // const result: Record<string, string> = {};

    await executeSqlValues(ctx._.service, queries.listPartionned()).then((res) => {
        console.log(res);
        
    });
    
    // result["Clean all nbs"] = 
    //     await executeSql(ctx._.service, `UPDATE observation set _nb = NULL`)
    //             .then(() => EChar.ok)
    //             .catch(() => EChar.notOk);
    
    // await asyncForEach(listTables, async (table: string) => {
    //     cleanIndexes(ctx, table);
    //     result[`Create index for ${table}`] = 
    //         await executeSql(ctx._.service, queries.dropIndex(table))
    //         .then(() => EChar.ok)
    //         .catch(() => EChar.notOk);
    //     });
        



    // result["Update all indexes"] = 
    //     await executeSql(ctx._.service, [queries.updateNb("datastream", true), queries.updateNb("multidatastream", true)])
    //             .then(() => EChar.ok)
    //             .catch(() => EChar.notOk);

    // await asyncForEach(listTables, async (table: string) => {
    //     logging.status(true, queries.cluster(table));
    //     result[`Cluster for ${table}`] = 
    //         await executeSql(ctx._.service, queries.cluster(table))
    //             .then(() => EChar.ok)
    //             .catch(() => EChar.notOk);
    // });

    // result["Complete Vacuum"] = 
    //     await executeSql(ctx._.service, 'VACUUM;')        
    //         .then(() => EChar.ok)
    //         .catch(() => EChar.notOk);

    // config.setGlobalState(EState.normal);

    // return result;
};
