/**
 * cleanDb
*
* @copyright 2020-present Inrae
* @author mario.adam@inrae.fr
*
*/

import { executeSql, executeSqlValues } from ".";
import { config } from "../../configuration";
import { EChar, EState } from "../../enums";
import { asyncForEach } from "../../helpers";
import { logging } from "../../log";
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
    const result: Record<string, string> = {};
    const listTables = await executeSqlValues(ctx._.service, queries.listPartionned()).then((res) => {
        const listTables: string[] = res[0 as keyof object];
        return listTables.filter((table) => !table.endsWith("iddefault")).filter((table) => !table.endsWith("_id0"));
    });   
    
    await asyncForEach(listTables, async (table: string) => {
        logging.status(true, queries.cluster(table));
        const query = `CLUSTER "${table}" USING "${table}_phenomenonTime_idx";`;
        result[`Cluster for ${table}`] = 
        await executeSql(ctx._.service, query)
            .then(() => EChar.ok)
            .catch(async (error: Error) => {
                if (error["code" as keyof object] === "42704") {
                    console.log("create Index");                    
                        return await executeSql(ctx._.service,`CREATE INDEX "${table}_phenomenonTime_idx" ON public.${table} USING btree ("phenomenonTime")`).then(async () => {
                            return await executeSql(ctx._.service, query)
                            .then(() => EChar.ok)
                            .catch(() => EChar.notOk)
                        });
                    } else {
                        console.error(error);                    
                        return EChar.notOk;
                    }
                })
    });

    result["Complete Vacuum"] = 
        await executeSql(ctx._.service, 'VACUUM;')        
            .then(() => EChar.ok)
            .catch(() => EChar.notOk);

    config.setServiceState(ctx._.service, EState.normal);
    return result;
};
