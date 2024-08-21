/**
 * createSTDB
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- createSTDB -----------------------------------!");

import { createTable, createUser } from "../helpers";
import { serverConfig } from "../../configuration";
import { addDoubleQuotes, addSimpleQuotes, asyncForEach } from "../../helpers";
import { _RIGHTS } from "../constants";
import { IKeyString } from "../../types";
import { EChar, EExtensions } from "../../enums";
import { triggers } from "./triggers";
import { models } from "../../models";
import { log } from "../../log";
import { createRole } from "../helpers/createRole";

export const createDatabase = async (configName: string): Promise<IKeyString> => {
  console.log(log.debug_head("createDatabase", configName));
  // init result
  const config = serverConfig.getConfig(configName).pg;
  const returnValue: IKeyString = { "Start create Database": config.database };
  const adminConnection = serverConfig.adminConnection();
  // Test connection Admin
  if (!adminConnection) {
    returnValue["DROP Error"] = "No Admin connection";
    return returnValue;
  }

  // create blank DATABASE
  await adminConnection.unsafe(`CREATE DATABASE ${config.database}`)
    .then(async () => {
      returnValue[`Create Database`] = `${config.database} ${EChar.ok}`;
      // create USER if not exist
      await adminConnection.unsafe(`SELECT COUNT(*) FROM pg_user WHERE usename = ${addSimpleQuotes(config.user)};`)
        .then(async (res: Record<string, any>) => {
          if (res[0].count == 0) {            
            returnValue[`CREATE ROLE ${config.user}`] = await adminConnection.unsafe(`CREATE ROLE ${config.user} WITH PASSWORD ${addSimpleQuotes(config.password)} ${_RIGHTS}`)
              .then(() => EChar.ok)
              .catch((err: Error) => err.message);
          } else {
            await adminConnection.unsafe(`ALTER ROLE ${config.user} WITH PASSWORD ${addSimpleQuotes(config.password)}  ${_RIGHTS}`)
              .then(() => {
                returnValue[`Create/Alter ROLE`] = `${config.user} ${EChar.ok}`;
              })
              .catch((error: Error) => {
                console.log(error);
              });
          }
        });
    }).catch((error: Error) => {
      console.log(error);
    });

    const dbConnection = serverConfig.connection(configName);
    if (!dbConnection) {
      returnValue["DROP Error"] = `No DB connection ${EChar.notOk}`;
      return returnValue;
    }
  
  // create postgis
  returnValue[`Create postgis`] = await dbConnection.unsafe('CREATE EXTENSION IF NOT EXISTS postgis')
    .then(() => EChar.ok)
    .catch((err: Error) => err.message);
    
  // create tablefunc
  returnValue[`Create tablefunc`] = await dbConnection.unsafe('CREATE EXTENSION IF NOT EXISTS tablefunc')
    .then(() => EChar.ok)
    .catch((err: Error) => err.message);
    
  // Get complete model
  const DB = models.DBFull(configName);
  
  // loop to create each table
  await asyncForEach(
    Object.keys(DB),
    async (keyName: string) => {
      const res = await createTable(configName, DB[keyName], undefined);
      Object.keys(res).forEach((e: string) => log.create(e, res[e]));      
    }
  );

  // loop to create each table
  await asyncForEach( triggers(configName), async (query: string) => {
    const name = query.split(" */")[0].split("/*")[1].trim();
    await serverConfig.connection(configName).unsafe(query)
      .then(() => {
        log.create(name, EChar.ok);
      }).catch((error: Error) => {
        console.log(error);
        process.exit(111);
      });    
    }
  );

  // If only numeric extension
  if ( serverConfig.getConfig(configName).extensions.includes( EExtensions.highPrecision ) ) {
    await dbConnection.unsafe(`ALTER TABLE ${addDoubleQuotes(DB.Observations.table)} ALTER COLUMN 'result' TYPE float4 USING null;`)
      .catch((error: Error) => {
        console.log(error);
        return error;
      });
    await dbConnection.unsafe(`ALTER TABLE ${addDoubleQuotes(DB.HistoricalLocations.table)} ALTER COLUMN '_result' TYPE float4 USING null;`)
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  returnValue[`Create Role`] = await createRole(serverConfig.getConfig(configName))
    .then(() => EChar.ok)
    .catch((err: Error) => err.message);

  returnValue[`Create user`] = await createUser(serverConfig.getConfig(configName))
    .then(() => EChar.ok)
    .catch((err: Error) => err.message);

  await dbConnection.unsafe(`SELECT COUNT(*) FROM pg_user WHERE usename = ${addSimpleQuotes(config.user)};`)
    .then(() => { returnValue["ALL finished ..."] = EChar.ok; })
    .catch((err: Error) => err.message);
    
  return returnValue;
};