/**
 * createIndexes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- createIndexes -----------------------------------!");

import { serverConfig } from "../../configuration";
import { EChar, EExtensions } from "../../enums";
import { asyncForEach } from "../../helpers";
import { log } from "../../log";


export const createIndexes = (name: string): void => {
    const exe = async (name: string, queries: string[]): Promise<boolean> => {
        await asyncForEach( queries, async (query: string) => {
          await serverConfig
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

    const sqls = [`WITH datastreams AS (
        select distinct "datastream_id" AS id from observation
        ),
        datas AS (
            SELECT 
                "datastream_id" AS id,
                min("phenomenonTime") AS pmin ,
                max("phenomenonTime") AS pmax,
                min("resultTime") AS rmin,
                max("resultTime") AS rmax
            FROM observation, datastreams where  "datastream_id" = datastreams.id group by "datastream_id"
        )
        UPDATE "datastream" SET 
            "_phenomenonTimeStart" =  datas.pmin ,
            "_phenomenonTimeEnd" = datas.pmax,
            "_resultTimeStart" = datas.rmin,
            "_resultTimeEnd" = datas.rmax
        FROM datas where "datastream".id = datas.id`
    ] 

    if (serverConfig.getConfig(name).extensions.includes(EExtensions.multiDatastream)) {
        sqls.push(`WITH multidatastreams AS (
                select distinct "multidatastream_id" AS id from observation
            ),
            datas AS (
                SELECT 
                    "multidatastream_id" AS id,
                    min("phenomenonTime") AS pmin ,
                    max("phenomenonTime") AS pmax,
                    min("resultTime") AS rmin,
                    max("resultTime") AS rmax
                FROM observation, multidatastreams where "multidatastream_id" = multidatastreams.id group by "multidatastream_id"
            )
            UPDATE "multidatastream" SET 
                "_phenomenonTimeStart" =  datas.pmin ,
                "_phenomenonTimeEnd" = datas.pmax,
                "_resultTimeStart" = datas.rmin,
                "_resultTimeEnd" = datas.rmax
            FROM datas where "multidatastream".id = datas.id`);
    }
    
    exe(name, sqls);
  }
