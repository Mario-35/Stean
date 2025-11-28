/**
 * createService
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createDatabase, disconnectDb, executeSqlValues } from ".";
import { config } from "../../configuration";
import { doubleQuotes, asyncForEach } from "../../helpers";
import { models } from "../../models";
import { createInsertValues } from "../../models/helpers";
import { logging } from "../../log";
import { EChar, EInfos } from "../../enums";
import { _DEBUG } from "../../constants";
import { messages } from "../../messages";

/**
 *
 * @param ctx koa context
 * @param dataInput input key values
 * @returns result postgres.js object
 */

export const createService = async (dataInput: Record<string, any>): Promise<Record<string, any>> => {
    console.log(logging.whereIam(new Error().stack));

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
    const newServiceName = dataInput["create" as keyof object]["name"];
    const newService = config.getService(newServiceName);
    const mess = ` database [${newServiceName}]`;

    try {
        await disconnectDb(newServiceName, true);
        results[messages.str(EInfos.disconnect, mess)] = EChar.ok;
    } catch (error) {
        results[messages.str(EInfos.disconnect, mess)] = logging.error(error).return(EChar.notOk);
    }

    try {
        await createDatabase(newServiceName);
        results[messages.str(EInfos.create, mess)] = EChar.ok;
    } catch (error) {
        results[messages.str(EInfos.create, mess)] = logging.error(error).return(EChar.notOk);
        ;
    }

    const model = models.getModel(newService);

    await asyncForEach(
        Object.keys(model)
            .filter((elem: string) => model[elem].createOrder > 0)
            .sort((a, b) => (model[a].createOrder > model[b].createOrder ? 1 : -1)),
        async (entityName: string) => {
            if (dataInput[entityName]) {
                const goodEntity = models.entity(model, entityName);
                if (goodEntity) {
                    try {
                        const sqls: string[] = dataInput[entityName].map(
                            (element: any) => `INSERT INTO ${doubleQuotes(goodEntity.table)} ${createInsertValues(goodEntity, prepareDatas(element, goodEntity.name))}`
                        );
                        await executeSqlValues(config.getService(newServiceName), sqls.join(";"))
                            .then((res: Record<string, any>) => {
                                results[entityName] = EChar.ok;
                            })
                            .catch((error: any) => {
                                console.log(error);
                                results[entityName] = EChar.notOk;
                            });
                    } catch (error) {                    
                        results[entityName] = logging.error(error).return(EChar.notOk);
                    }
                }
            }
        }
    );

    return results;
};
