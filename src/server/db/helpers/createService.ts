/**
 * createService
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createDatabase, disconectDb } from ".";
import { config } from "../../configuration";
import { doubleQuotesString, asyncForEach } from "../../helpers";
import { models } from "../../models";
import { createInsertValues } from "../../models/helpers";
import { keyobj, Iservice } from "../../types";
import { log } from "../../log";
import { EChar } from "../../enums";

/**
 *
 * @param ctx koa context
 * @param dataInput input key values
 * @returns result postgres.js object
 */

export const createService = async (ctxService: Iservice, dataInput: Record<string, any>): Promise<Record<string, any>> => {
    console.log(log.whereIam());

    const prepareDatas = (dataInput: Record<string, string>, entity: string): object => {
        if (entity === "Observations") {
            if (!dataInput["resultTime"] && dataInput["phenomenonTime"]) dataInput["resultTime"] = dataInput["phenomenonTime"];
            if (!dataInput["phenomenonTime"] && dataInput["resultTime"]) dataInput["phenomenonTime"] = dataInput["resultTime"];
        }
        return dataInput;
    };

    if (dataInput && dataInput["create"]) {
        config.addConfig(dataInput["create"]);
    }

    const results: Record<string, string> = {};
    const serviceName = dataInput["create" as keyobj]["name"];
    const service = config.getService(serviceName);
    const mess = `Database [${serviceName}]`;

    try {
        await disconectDb(serviceName, true);
        results[`Drop ${mess}`] = EChar.ok;
    } catch (error) {
        results[`Drop ${mess}`] = EChar.notOk;
        console.log(error);
    }

    try {
        await createDatabase(serviceName);
        results[`Create ${mess}`] = EChar.ok;
    } catch (error) {
        results[`Create ${mess}`] = EChar.notOk;
        console.log(error);
    }

    const tmp = models.filtered(service);

    await asyncForEach(
        Object.keys(tmp)
            .filter((elem: string) => tmp[elem].createOrder > 0)
            .sort((a, b) => (tmp[a].createOrder > tmp[b].createOrder ? 1 : -1)),
        async (entityName: string) => {
            if (dataInput[entityName]) {
                const goodEntity = models.getEntity(service, entityName);
                if (goodEntity) {
                    try {
                        const sqls: string[] = dataInput[entityName].map((element: any) => `INSERT INTO ${doubleQuotesString(goodEntity.table)} ${createInsertValues(ctxService, prepareDatas(element, goodEntity.name), goodEntity.name)}`);
                        await config
                            .executeSqlValues(config.getService(serviceName), sqls.join(";"))
                            .then((res: Record<string, any>) => {
                                results[entityName] = EChar.ok;
                            })
                            .catch((error: any) => {
                                console.log(error);
                                results[entityName] = EChar.notOk;
                            });
                    } catch (error) {
                        console.log(error);
                        results[entityName] = EChar.notOk;
                    }
                }
            }
        }
    );

    return results;
};
