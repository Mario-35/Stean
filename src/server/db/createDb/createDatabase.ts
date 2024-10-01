/**
 * createSTDB
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- createSTDB -----------------------------------!\n");

import { createTable, createUser } from "../helpers";
import { config } from "../../configuration";
import { doubleQuotesString, simpleQuotesString, asyncForEach } from "../../helpers";
import { _RIGHTS } from "../constants";
import { IKeyString } from "../../types";
import { EChar, EExtensions } from "../../enums";
import { triggers } from "./triggers";
import { models } from "../../models";
import { log } from "../../log";
import { createRole } from "../helpers/createRole";
import { info } from "../../messages";

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
      await adminConnection.unsafe(`SELECT COUNT(*) FROM pg_user WHERE usename = ${simpleQuotesString(servicePg.user)};`)
        .then(async (res: Record<string, any>) => {
          if (res[0].count == 0) {            
            returnValue[`CREATE ROLE ${servicePg.user}`] = await adminConnection.unsafe(`CREATE ROLE ${servicePg.user} WITH PASSWORD ${simpleQuotesString(servicePg.password)} ${_RIGHTS}`)
              .then(() => EChar.ok)
              .catch((err: Error) => err.message);
          } else {
            await adminConnection.unsafe(`ALTER ROLE ${servicePg.user} WITH PASSWORD ${simpleQuotesString(servicePg.password)}  ${_RIGHTS}`)
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
    await config.connection(configName).unsafe(query)
      .then(() => {
        log.create(name, EChar.ok);
      }).catch((error: Error) => {
        console.log(error);
        process.exit(111);
      });    
    }
  );

  // If only numeric extension
  if ( config.getService(configName).extensions.includes( EExtensions.highPrecision ) ) {
    await dbConnection.unsafe(`ALTER TABLE ${doubleQuotesString(DB.Observations.table)} ALTER COLUMN 'result' TYPE float4 USING null;`)
      .catch((error: Error) => {
        console.log(error);
        return error;
      });
    await dbConnection.unsafe(`ALTER TABLE ${doubleQuotesString(DB.HistoricalLocations.table)} ALTER COLUMN '_result' TYPE float4 USING null;`)
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  returnValue[`Create Role`] = await createRole(config.getService(configName))
    .then(() => EChar.ok)
    .catch((err: Error) => err.message);

  returnValue[`Create user`] = await createUser(config.getService(configName))
    .then(() => EChar.ok)
    .catch((err: Error) => err.message);


    if (config.getService(configName).extensions.includes(EExtensions.file)) {
      const files: string[] =
      [`INSERT INTO sensor ("name", description, "encodingType", metadata) VALUES('${info.csvFile}', '${info.csvFile}', 'application/pdf', 'https://www.rfc-editor.org/rfc/pdfrfc/rfc4180.txt.pdf');`
      ,`WITH thing AS (INSERT INTO "thing" ("name","description","properties") VALUES ('${info.csvFile}','${info.csvFile}','{}') RETURNING *) , location1 AS ( INSERT INTO "location" ("name","description","encodingType","location") VALUES ('${info.csvFile}','${info.csvFile}','application/geo+json','{}') RETURNING id) , thinglocation AS ( INSERT INTO "thinglocation" ("location_id","thing_id") VALUES ((select location1.id from location1),(select thing.id from thing))) select id from thing`
      ,`INSERT INTO observedproperty ("name", definition, description) VALUES('${info.csvFile}', '${info.csvFile}', '${info.csvFile}');`]
      await asyncForEach( files, async (query: string) => {
        await config.connection(configName).unsafe(query)
          .then(() => {
            log.create("name", EChar.ok);
          }).catch((error: Error) => {
            console.log(query);
            console.log(error);
            process.exit(111);
          });    
        }
      );
    }


  await dbConnection.unsafe(`SELECT COUNT(*) FROM pg_user WHERE usename = ${simpleQuotesString(servicePg.user)};`)
    .then(() => { returnValue["ALL finished ..."] = EChar.ok; })
    .catch((err: Error) => err.message);
    
  return returnValue;
};