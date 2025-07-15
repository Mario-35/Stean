/**
 * exportToJson
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { EConstant } from "../../enums";
import { doubleQuotesString, asyncForEach, getUrlKey, hidePassword } from "../../helpers";
import { THINGLOCATION } from "../../models/entities";
import { koaContext } from "../../types";
// import { asCsv } from "../queries";

export const exportToJson = async (ctx: koaContext) => {
    // get config with hidden password
    const result: Record<string, any> = { "create": hidePassword(config.getService(ctx.service.name)) };
    // get entites list
    const entities = Object.keys(ctx.model).filter((e: string) => ctx.model[e].createOrder > 0);
    // add ThingsLocations
    entities.push(THINGLOCATION.name);
    // async loop
    await asyncForEach(
        // Entities list
        entities,
        // Action
        async (entity: string) => {
            if (Object.keys(ctx.model[entity].columns) && ctx.model[entity].table != "") {
                // Create columns list
                const columnList = Object.keys(ctx.model[entity].columns).filter((e: string) => e != "id" && !e.endsWith("_id") && e[0] != "_" && ctx.model[entity].columns[e].create != "");

                // Create relations list
                const rels = [""];
                Object.keys(ctx.model[entity].columns)
                    .filter((e: string) => e.endsWith("_id"))
                    .forEach((e: string) => {
                        const table = e.split("_")[0];
                        rels.push(
                            `CASE WHEN "${e}" ISNULL THEN NULL ELSE JSON_BUILD_OBJECT('@iot.name', (SELECT REPLACE (name, '''', '''''') FROM "${table}" WHERE "${table}"."id" = ${e} LIMIT 1)) END AS "${e}"`
                        );
                    });
                const columnListWithQuotes = columnList.map((e) => doubleQuotesString(e)).join();
                if (columnListWithQuotes.length <= 1) rels.shift();
                console.log(`----------------------------${entity}------------------------------------------`);
                console.log(
                    `select ${columnListWithQuotes}${rels.length > 1 ? rels.join() : ""}${EConstant.return} FROM "${ctx.model[entity].table}" LIMIT ${
                        getUrlKey(ctx.request.url, "limit") || ctx.service.nb_page
                    }`
                );
                console.log("----------------------------------------------------------------------");
                // Execute query
                const tempResult = await config
                    .connection(ctx.service.name)
                    .unsafe(
                        `select ${columnListWithQuotes}${rels.length > 1 ? rels.join() : ""}${EConstant.return} FROM "${ctx.model[entity].table}" LIMIT ${
                            getUrlKey(ctx.request.url, "limit") || ctx.service.nb_page
                        }`
                    );
                // remove null and store datas result
                result[entity] = tempResult; // result[entity] = removeEmpty(tempResult);
            }
        }
    );
    delete result["FeaturesOfInterest"][0];
    // const sql = asCsv("select * from observation", ctx.service.csvDelimiter);
    // console.log(sql);
    // ctx.attachment("obsexport.csv");
    // return await config.connection(ctx.service.name).unsafe(sql).readable();
    return result;
};
