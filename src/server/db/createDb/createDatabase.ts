/**
 * createSTDB
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createTable, createUser } from "../helpers";
import { config } from "../../configuration";
import { doubleQuotes, simpleQuotes, asyncForEach } from "../../helpers";
import { IKeyString } from "../../types";
import { EChar, EConstant, EExtensions } from "../../enums";
import { triggers } from "./triggers";
import { models } from "../../models";
import { log } from "../../log";
import { createRole } from "../helpers/createRole";
import { createExtension } from "../queries";

export const createDatabase = async (configName: string): Promise<IKeyString> => {
  console.log(log.debug_head("createDatabase", configName));
  // init result
  const servicePg = config.getService(configName).pg;
  const returnValue: IKeyString = { "Start create Database": servicePg.database };
  const adminConnection = config.adminConnection();
  // Test connection Admin
  if (!adminConnection) {
    returnValue["DROP Error"] = "No Admin connection";
    return returnValue;
  }
  // create blank DATABASE
  await adminConnection.unsafe(`CREATE DATABASE ${servicePg.database}`)
    .then(async () => {
      returnValue[`Create Database`] = `${servicePg.database} ${EChar.ok}`;
      // create USER if not exist
      await adminConnection.unsafe(`SELECT COUNT(*) FROM pg_user WHERE usename = ${simpleQuotes(servicePg.user)};`)
        .then(async (res: Record<string, any>) => {
          if (res[0].count == 0) {            
            returnValue[`CREATE ROLE ${servicePg.user}`] = await adminConnection.unsafe(`CREATE ROLE ${servicePg.user} WITH PASSWORD ${simpleQuotes(servicePg.password)} ${EConstant.rights}`)
              .then(() => EChar.ok)
              .catch((err: Error) => err.message);
          } else {
            await adminConnection.unsafe(`ALTER ROLE ${servicePg.user} WITH PASSWORD ${simpleQuotes(servicePg.password)}  ${EConstant.rights}`)
              .then(() => {
                returnValue[`Create/Alter ROLE`] = `${servicePg.user} ${EChar.ok}`;
              })
              .catch((error: Error) => {
                console.log(error);
              });
          }
        });
    }).catch((error: Error) => {
      console.log(error);
    });
    const dbConnection = config.connection(configName);
    if (!dbConnection) {
      returnValue["DROP Error"] = `No DB connection ${EChar.notOk}`;
      return returnValue;
    }
  
  // create postgis
  returnValue[`Create postgis`] = await dbConnection.unsafe(createExtension("postgis"))
    .then(() => EChar.ok)
    .catch((err: Error) => err.message);
    
  // create tablefunc
  returnValue[`Create tablefunc`] = await dbConnection.unsafe(createExtension("tablefunc"))
    .then(() => EChar.ok)
    .catch((err: Error) => err.message);
    
  // Get complete model
  const DB = models.DBFull(configName);  
  // loop to create each table
  await asyncForEach(
    Object.keys(DB).filter(e => e.trim() !== ""),
    async (keyName: string) => {
      const res = await createTable(configName, DB[keyName], undefined);      
      Object.keys(res).forEach((e: string) => log.create(e, res[e]));      
    }
  );



  returnValue[`Create Role`] = await createRole(config.getService(configName))
  .then(() => EChar.ok)
  .catch((err: Error) => err.message);

  returnValue[`Create user`] = await createUser(config.getService(configName))
    .then(() => EChar.ok)
    .catch((err: Error) => err.message);
    
  // loop to create each triggers
  if (!config.getService(configName).extensions.includes( EExtensions.file ) ) {   
    await asyncForEach( triggers(configName), async (query: string) => {
      const name = query.split(" */")[0].split("/*")[1].trim();
      await dbConnection.unsafe(query)
        .then(() => {
          log.create(name, EChar.ok);
        }).catch((error: Error) => {
          console.log(error);
          process.exit(111);
        });    
      }
    );
  }

  // If only numeric extension
  if ( config.getService(configName).extensions.includes( EExtensions.highPrecision ) ) {
    await dbConnection.unsafe(`ALTER TABLE ${doubleQuotes(DB.Observations.table)} ALTER COLUMN 'result' TYPE float4 USING null;`)
      .catch((error: Error) => {
        console.log(error);
        return error;
      });
    await dbConnection.unsafe(`ALTER TABLE ${doubleQuotes(DB.HistoricalLocations.table)} ALTER COLUMN '_result' TYPE float4 USING null;`)
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  await dbConnection.unsafe(`SELECT COUNT(*) FROM pg_user WHERE usename = ${simpleQuotes(servicePg.user)};`)
    .then(() => { returnValue["ALL finished ..."] = EChar.ok; })
    .catch((err: Error) => err.message);
    
  return returnValue;
};