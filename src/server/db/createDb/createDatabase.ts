/**
 * createSTDB
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createTable, createUser } from "../helpers";
import { config } from "../../configuration";
import { doubleQuotes, asyncForEach } from "../../helpers";
import { EChar, EErrors, EExtensions, EInfos } from "../../enums";
import { models } from "../../models";
import { logging } from "../../log";
import { createRole } from "../helpers/createRole";
import { pgFunctions } from ".";
import { _DEBUG } from "../../constants";
import { queries } from "../queries";
import { messages } from "../../messages";

/**
 *
 * @param configName service name
 * @returns record log report
 */

export const createDatabase = async (serviceName: string): Promise<Record<string, string>> => {
    console.log(logging.head(`${EInfos.createDB} [${serviceName}]`).to().text());

    // init result
    const service = config.getService(serviceName);
    const servicePg = service.pg;
    const returnValue: Record<string, string> = { [EInfos.startCreateDB]: servicePg.database };
    const adminConnection = config.adminConnection();

    // Test Admin connection
    if (!adminConnection) {
        returnValue["DROP Error"] = EErrors.noAdmin;
        return returnValue;
    }

    // create blank DATABASE
    returnValue[EInfos.adminConnection] = await adminConnection
        .unsafe(queries.creatdeDB(servicePg.database))
        .then(async () => {
            // create default USER if not exist
            returnValue[messages.str(EInfos.create, `/Alter ROLE ${servicePg.user}`)] = await createRole(service)
                .then(() => EChar.ok)
                .catch((error: Error) => {
                    console.log(error);
                    return EChar.notOk;
                });
            return EChar.ok;
        })
        .catch((error: Error) => {
            console.log(error);
            return EChar.notOk;
        });

    // test user connection
    const dbConnection = config.connection(service.name);
    if (!dbConnection) {
        returnValue["DROP Error"] = `No DB connection ${EChar.notOk}`;
        return returnValue;
    }

    // create postgis
    returnValue[messages.str(EInfos.create, "postgis")] = await dbConnection
        .unsafe(queries.createExtension("postgis"))
        .then(() => EChar.ok)
        .catch((err: Error) => err.message);

    // create tablefunc
    returnValue[messages.str(EInfos.create, "tablefunc")] = await dbConnection
        .unsafe(queries.createExtension("tablefunc"))
        .then(() => EChar.ok)
        .catch((err: Error) => err.message);

    // Get complete model
    const DB = models.getModel();

    // loop to create each table
    await asyncForEach(
        Object.keys(DB).filter((e) => e.trim() !== ""),
        async (keyName: string) => {
            const res = await createTable(service.name, DB[keyName], undefined);
            Object.keys(res).forEach((e: string) => {
                logging.message(e, res[e]);
                returnValue["  ■■■►  " + e] = res[e];
            });
            if (res.toString().includes(EChar.notOk)) {
                process.exit(111);
            }
        }
    );

    // create user
    returnValue[messages.str(EInfos.create, "user")] = await createUser(service)
        .then(() => EChar.ok)
        .catch((err: Error) => err.message);

    // loop to create each services
    await asyncForEach(pgFunctions(), async (query: string) => {
        const name = query.split(" */")[0].split("/*")[1].trim();
        await dbConnection
            .unsafe(query)
            .then(() => {
                logging.message(name, EChar.ok);
                returnValue["  ■■■►  " + name] = EChar.ok;
            })
            .catch((error: Error) => {
                console.log(error);
                process.exit(111);
            });
    });

    // loop to create each triggers
    await asyncForEach(
        Object.keys(DB).filter((e) => e.trim() !== ""),
        async (keyName: string) => {
            if (DB[keyName].trigger) {
                await asyncForEach(DB[keyName].trigger, async (query: string) => {
                    await dbConnection
                        .unsafe(query)
                        .then((e) => {
                            // to preserve size
                            DB[keyName].trigger = [];
                            returnValue[messages.str(EInfos.create, "trigger")] = EChar.ok;
                        })
                        .catch((error: Error) => {
                            console.log(error);
                            returnValue[messages.str(EInfos.create, "trigger")] = EChar.notOk;
                        });
                });
            }
        }
    );

    // If only numeric extension
    if (service.extensions.includes(EExtensions.highPrecision)) {
        returnValue[messages.str(EInfos.create, "High Precision result")] = await dbConnection
            .unsafe(`ALTER TABLE ${doubleQuotes(DB.Observations.table)} ALTER COLUMN 'result' TYPE float4 USING null;`)
            .then(() => {
                return EChar.ok;
            })
            .catch((error: Error) => {
                console.log(error);
                return EChar.notOk;
            });
    }

    // final test
    returnValue["ALL finished ..."] = await dbConnection
        .unsafe(queries.countUser(servicePg.user))
        .then(() => {
            return EChar.ok;
        })
        .catch((error: Error) => {
            console.log(error);
            return EChar.notOk;
        });

    return returnValue;
};
