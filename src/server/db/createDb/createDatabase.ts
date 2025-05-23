/**
 * createSTDB
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createTable, createUser } from "../helpers";
import { config } from "../../configuration";
import { doubleQuotesString, simpleQuotesString, asyncForEach } from "../../helpers";
import { EChar, EConstant, EExtensions } from "../../enums";
import { models } from "../../models";
import { log } from "../../log";
import { createRole } from "../helpers/createRole";
import { createExtension } from "../queries";
import { pgFunctions } from ".";

/**
 *
 * @param configName service name
 * @returns record log report
 */

export const createDatabase = async (serviceName: string): Promise<Record<string, string>> => {
    console.log(log.debug_head("createDatabase", serviceName));

    // init result
    const servicePg = config.getService(serviceName).pg;
    const returnValue: Record<string, string> = { "Start create Database": servicePg.database };
    const adminConnection = config.adminConnection();

    // Test Admin connection
    if (!adminConnection) {
        returnValue["DROP Error"] = "No Admin connection";
        return returnValue;
    }

    // create blank DATABASE
    await adminConnection
        .unsafe(`CREATE DATABASE ${servicePg.database}`)
        .then(async () => {
            returnValue[`Create Database`] = `${servicePg.database} ${EChar.ok}`;
            // create default USER if not exist
            await adminConnection.unsafe(`SELECT COUNT(*) FROM pg_user WHERE usename = ${simpleQuotesString(servicePg.user)};`).then(async (res: Record<string, any>) => {
                if (res[0].count == 0) {
                    returnValue[`CREATE ROLE ${servicePg.user}`] = await adminConnection
                        .unsafe(`CREATE ROLE ${servicePg.user} WITH PASSWORD ${simpleQuotesString(servicePg.password)} ${EConstant.rights}`)
                        .then(() => EChar.ok)
                        .catch((err: Error) => err.message);
                } else {
                    await adminConnection
                        .unsafe(`ALTER ROLE ${servicePg.user} WITH PASSWORD ${simpleQuotesString(servicePg.password)}  ${EConstant.rights}`)
                        .then(() => {
                            returnValue[`Create/Alter ROLE`] = `${servicePg.user} ${EChar.ok}`;
                        })
                        .catch((error: Error) => {
                            console.log(error);
                        });
                }
            });
        })
        .catch((error: Error) => {
            console.log(error);
        });

    // test user connection
    const dbConnection = config.connection(serviceName);
    if (!dbConnection) {
        returnValue["DROP Error"] = `No DB connection ${EChar.notOk}`;
        return returnValue;
    }

    // create postgis
    returnValue[`Create postgis`] = await dbConnection
        .unsafe(createExtension("postgis"))
        .then(() => EChar.ok)
        .catch((err: Error) => err.message);

    // create tablefunc
    returnValue[`Create tablefunc`] = await dbConnection
        .unsafe(createExtension("tablefunc"))
        .then(() => EChar.ok)
        .catch((err: Error) => err.message);

    // Get complete model
    const DB = models.DBFullCreate(serviceName);

    // loop to create each table
    await asyncForEach(
        Object.keys(DB).filter((e) => e.trim() !== ""),
        async (keyName: string) => {
            const res = await createTable(serviceName, DB[keyName], undefined);
            Object.keys(res).forEach((e: string) => log.create(e, res[e]));
        }
    );

    // create role
    returnValue[`Create Role`] = await createRole(config.getService(serviceName))
        .then(() => EChar.ok)
        .catch((err: Error) => err.message);

    // create user
    returnValue[`Create user`] = await createUser(config.getService(serviceName))
        .then(() => EChar.ok)
        .catch((err: Error) => err.message);

    // loop to create each services
    if (!config.getService(serviceName).extensions.includes(EExtensions.file)) {
        await asyncForEach(pgFunctions(), async (query: string) => {
            const name = query.split(" */")[0].split("/*")[1].trim();
            await dbConnection
                .unsafe(query)
                .then(() => {
                    log.create(name, EChar.ok);
                })
                .catch((error: Error) => {
                    console.log(error);
                    process.exit(111);
                });
        });
    }

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
                        })
                        .catch((error: Error) => {
                            console.log(error);
                            return error;
                        });
                });
            }
        }
    );

    // If only numeric extension
    if (config.getService(serviceName).extensions.includes(EExtensions.highPrecision)) {
        await dbConnection.unsafe(`ALTER TABLE ${doubleQuotesString(DB.Observations.table)} ALTER COLUMN 'result' TYPE float4 USING null;`).catch((error: Error) => {
            console.log(error);
            return error;
        });
        await dbConnection.unsafe(`ALTER TABLE ${doubleQuotesString(DB.HistoricalLocations.table)} ALTER COLUMN '_result' TYPE float4 USING null;`).catch((error) => {
            console.log(error);
            return error;
        });
    }

    // final test
    await dbConnection
        .unsafe(`SELECT COUNT(*) FROM pg_user WHERE usename = ${simpleQuotesString(servicePg.user)};`)
        .then(() => {
            returnValue["ALL finished ..."] = EChar.ok;
        })
        .catch((err: Error) => err.message);

    return returnValue;
};
