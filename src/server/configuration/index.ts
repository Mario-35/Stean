/**
 * Configuration class
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { setReady, _DEBUG } from "../constants";
import { asyncForEach, decrypt, encrypt, isProduction, isTest, logToHtml, } from "../helpers";
import { Iservice, IdbConnection, IserviceInfos, koaContext, keyobj } from "../types";
import { errors, info, infos, msg } from "../messages";
import { createIndexes, createService} from "../db/helpers";
import { app } from "..";
import { color, EChar, EColor, EConstant, EExtensions, EFileName, EOptions, EUpdate } from "../enums";
import fs from "fs";
import update from "./update.json";
import postgres from "postgres";
import { triggers } from "../db/createDb/triggers";
import { log } from "../log";
import { createDatabase, testDatas } from "../db/createDb";
import { userAccess } from "../db/dataAccess";
import path from "path";
import { formatconfigFile, testDbExists, validJSONConfig } from "./helpers";
import { MqttServer } from "../mqtt";
// class to logCreate configs environements
class Configuration {
  // store all services
  static services: { [key: string]: Iservice } = {};
  // configuration complete file path
  static filePath: string;
  static MqttServer: MqttServer;
  static queries: { [key: string]: string[] } = {};
  public logFile = fs.createWriteStream(path.resolve(__dirname, "../", EFileName.logs), {flags : 'w'});
  static listenPorts: number[] = [];
  constructor() {
    const file: fs.PathOrFileDescriptor = __dirname + `/${EFileName.config}`;
    Configuration.filePath = file.toString();
    // override console log important in production build will remove all console.log
    if (isTest()) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      console.log = (data: any) => {};
      this.readConfigFile();
    } 
    else console.log = (data: any) => {
      if (data) this.writeLog(data);
    };
  }
  messageListen(what: string, port: string, db?: boolean) {
    if (db)
      this.writeLog(log.booting(`${color(EColor.Magenta)}${info.db} => ${color(EColor.Yellow)}${what}${color(EColor.Default)} ${info.onLine}`, port));
      else this.writeLog(log.booting(`${color(EColor.Yellow)}${what}${color(EColor.Yellow)} ${color(EColor.Green)}${info.listenPort}`, port));
  }
  writeLog(input: any) {
    if (input) {
      process.stdout.write(input + "\n");
      if (config && config.logFile) config.logFile.write(logToHtml(input));
    }
  }
  // Read string (or default configuration file) as configuration file
  public readConfigFile(input?: string) {
    this.writeLog(`${color(EColor.Red)}${"▬".repeat(24)} ${color( EColor.Cyan )} ${`START ${EConstant.appName} ${info.ver} : ${EConstant.appVersion} [${EConstant.nodeEnv}]`} ${color( EColor.White )} ${new Date().toLocaleDateString()} : ${new Date().toLocaleTimeString()} ${color( EColor.Red )} ${"▬".repeat(24)}${color(EColor.Reset)}`);
    this.writeLog(log.message(infos(["read", "config"]), input ? "content" : Configuration.filePath));
    try {
      // load File
      const fileContent = input || fs.readFileSync(Configuration.filePath, "utf8");
      if (fileContent.trim() === "") {
        this.writeLog(log.error(msg(errors.fileEmpty, Configuration.filePath), Configuration.filePath));
        process.exit(111);      
      }
      // decrypt file
      Configuration.services = JSON.parse(decrypt(fileContent));
      if (validJSONConfig(Configuration.services)) {
        if (isTest()) {
          Configuration.services[EConstant.admin] = this.formatConfig(EConstant.admin);
          Configuration.services[EConstant.test] = this.formatConfig(testDatas["create"]);
          
        } else {
          Object.keys(Configuration.services).forEach((element: string) => {
            Configuration.services[element] = this.formatConfig(element);
          });
        }
      } else {
        this.writeLog(log.error(errors.configFileError));
        process.exit(112);
      }
      // rewrite file (to update config modification except in test mode)
      if (!isTest()) this.writeConfig();    
    } catch (error: any) {
      this.writeLog(log.error(errors.configFileError, error["message"]));
      process.exit(111);      
    }
  }
  public defaultHttp() {
    return Configuration.services[EConstant.admin] && Configuration.services[EConstant.admin].ports ? Configuration.services[EConstant.admin].ports?.http || 8029 : 8029;
  }
  public initMqtt() {
    Configuration.MqttServer = new MqttServer({wsPort : Configuration.services[EConstant.admin].ports?.ws || 1883, tcpPort  : Configuration.services[EConstant.admin].ports?.tcp || 9000});
  }
  getBrokerId() {
    return Configuration.MqttServer.broker.id; 
  }
  // verify if configuration file Exist
  public configFileExist(): boolean {
    return fs.existsSync(Configuration.filePath);
  }
  // return infos routes
  getInfos = (ctx: koaContext, name: string): IserviceInfos => {
    const protocol:string = ctx.request.headers["x-forwarded-proto"]
      ? ctx.request.headers["x-forwarded-proto"].toString()
      : Configuration.services[name].options.includes(EOptions.forceHttps)
        ? "https"
        : ctx.protocol;
        
    // make linkbase
    let linkBase = 
      ctx.request.headers["x-forwarded-host"]
        ? `${protocol}://${ctx.request.headers["x-forwarded-host"].toString()}`
        : ctx.request.header.host
          ? `${protocol}://${ctx.request.header.host}`
          : "";
    // make rootName
    if (!linkBase.includes(name)) linkBase += "/" + name;    
    const version = Configuration.services[name].apiVersion;
    return {
      protocol: protocol,
      linkBase: linkBase,
      version: version,
      root : process.env.NODE_ENV?.trim() === EConstant.test ? `proxy/${version}` : `${linkBase}/${version}`,
      model : `https://app.diagrams.net/?lightbox=1&edit=_blank#U${linkBase}/${version}/draw`
    };
  };
  // return infos routes for all services
  public getInfosForAll(ctx: koaContext): { [key: string]: IserviceInfos } {
        const result:Record<string, any> = {};    
    this.getServices().forEach((conf: string) => {
      result[conf] = this.getInfos(ctx, conf);
    });
    return result;
  }
  public isConfig(name: string) {
    return Configuration.services.hasOwnProperty(name);
  }
  public getService(name: string) {
    return Configuration.services[name];
  }
  public getServices() {
    return Object.keys(Configuration.services).filter(e => e !== EConstant.admin);
  }
  // Write an encrypt config file in json file
  writeConfig(): boolean {
    this.writeLog(log.message(infos(["write","config"]), Configuration.filePath));
    const result: Record<string, any> = {};
    Object.entries(Configuration.services).forEach(([k, v]) => {
      if (k !== EConstant.test) result[k] = Object.keys(v).filter(e => !e.startsWith("_")) .reduce((obj, key) => { obj[key as keyobj] = v[key as keyobj]; return obj; }, {} );
    });
    // in some case of crash config is blank so prevent to overrite it
    if (Object.keys(result).length > 0) fs.writeFile(
      // encrypt only in production mode
      Configuration.filePath,
      isProduction() === true 
        ? encrypt(JSON.stringify(result, null, 4))
        : JSON.stringify(result, null, 4),
      (error) => {
        if (error) {
          console.log(error);
          return false;
        }
      }
    );
    return true;
  }
  async executeMultipleQueries(configName: string, queries: string[], infos: string):Promise<boolean> {
    await asyncForEach( queries, async (query: string) => {
      await config
        .connection(configName)
        .unsafe(query)
        .catch((error: Error) => {
          console.log(error);
          return false;
        });
    });
    log.create(`${infos} : [${configName}]`, EChar.ok);
    return true;
  }
  async executeQueries(title: string): Promise<boolean> {
    try {
      await asyncForEach(
        Object.keys(Configuration.queries),
        async (connectName: string) => {
          await this.executeMultipleQueries(connectName, Configuration.queries[connectName], title);
        }
      );
    } catch (error) {
      console.log(error);
    }
    return true;
  }
  public hashCode(s: string): number {
    return s.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }
  
  // return the connection
  public connection(name: string): postgres.Sql<Record<string, unknown>> {  
    if (!Configuration.services[name]._connection) this.createDbConnectionFromConfigName(name);
    return Configuration.services[name]._connection || this.createDbConnection(Configuration.services[name].pg);
  }
  
  // return postgres.js connection with EConstant.admin rights
  public adminConnection(): postgres.Sql<Record<string, unknown>> {
    const input = Configuration.services[EConstant.admin].pg;    
    return postgres(`postgres://${input.user}:${input.password}@${input.host}:${input.port || 5432}/${EConstant.defaultDb}`,
      {
        debug: _DEBUG,          
        connection: { 
          application_name : `${EConstant.appName} ${EConstant.appVersion}`
        }
      }
    );
  }
  /**
   * 
   * @param input IdbConnection
   * @returns Postgres.s connection (psql connect string)
   */
  private createDbConnection(input: IdbConnection): postgres.Sql<Record<string, unknown>> {
    return postgres( 
      `postgres://${input.user}:${input.password}@${input.host}:${input.port || 5432}/${input.database}`,
      {
        debug: _DEBUG,
        max : 2000,            
        connection : { 
          application_name : `${EConstant.appName} ${EConstant.appVersion}`
        },
      }
    );
  }
  
  public createDbConnectionFromConfigName(input: string): postgres.Sql<Record<string, unknown>> {
    const temp = this.createDbConnection(Configuration.services[input].pg);
    Configuration.services[input]._connection = temp;
    return temp;
  }
  addToQueries(connectName: string, query: string) {
    if (Configuration.queries[connectName]) 
      Configuration.queries[connectName].push(query);
    else
      Configuration.queries[connectName] = [query];
  }
  private clearQueries() { 
    Configuration.queries = {}; 
  }
  async relogCreateTrigger(configName: string): Promise<boolean> {
    await asyncForEach( triggers(configName), async (query: string) => {
      const name = query.split(" */")[0].split("/*")[1].trim();
      await config.connection(configName).unsafe(query).then(() => {
        log.create(`[${configName}] ${name}`, EChar.ok);
      }).catch((error: Error) => {
        console.log(error);
        return false;
      });
    });
    return true;
  }
  // initialisation serve NOT IN EConstant.test
  async afterAll(): Promise<boolean> {
    // Updates database after init
    if ( update && update[EUpdate.afterAll] && Object.entries(update[EUpdate.afterAll]).length > 0 ) {
      this.clearQueries();
      Object.keys(Configuration.services)
        .filter((e) => e != EConstant.admin)
        .forEach(async (connectName: string) => {
          update[EUpdate.afterAll].forEach((operation: string) => { this.addToQueries(connectName, operation); });
        });
      await this.executeQueries(EUpdate.afterAll);
    }
    
    if (update && update[EUpdate.decoders] && Object.entries(update[EUpdate.decoders]).length > 0) {
      this.clearQueries();
      Object.keys(Configuration.services)
        .filter( (e) => e != EConstant.admin && Configuration.services[e].extensions.includes(EExtensions.lora) )
        .forEach((connectName: string) => {
          if(Configuration.services[connectName].extensions.includes(EExtensions.lora)) {
            const decs:string[] = [];
            Object.keys(update[EUpdate.decoders]).forEach(async (name: string) => {
              const hash = this.hashCode(update[EUpdate.decoders as keyobj][name]);
              decs.push(name);            
              const sql = `UPDATE decoder SET code='${update[EUpdate.decoders as keyobj][name]}', hash = '${hash}' WHERE name = '${name}' AND hash <> '${hash}' `;
              await config
              .connection(connectName)
              .unsafe(sql)
              .catch((error: Error) => {
                console.log(error);
                return false;
              });
            });
            this.writeLog(log.booting(`UPDATE decoder ${color(EColor.Yellow)} [${connectName}]`, decs));            
          }
        });
      }
     return true;
  }
 addListening(port: number, message: string) {
  if (Configuration.listenPorts.includes(port)) this.messageListen(`ADD ${message}`, String(port));
  else app.listen(port, () => {
      Configuration.listenPorts.push(port);
      this.messageListen(message, String(port));
    });
  }

  // initialisation serve NOT IN EConstant.test
  async init(input?: string): Promise<boolean> {
    if (this.configFileExist() === true || input) {
      this.readConfigFile(input);
      console.log(log.message(info.config, info.loaded + " " + EChar.ok));    
      let status = true;
      await asyncForEach(
        // Start connection ALL entries in config file
        Object.keys(Configuration.services).filter(e => e.toUpperCase() !== EConstant.test.toUpperCase()),
        async (key: string) => {
          try {
            await this.addToServer(key);
          } catch (error) {
            console.log(error);
            status = false;
          }
        }
      );
      this.writeLog(log._head("mqtt"));
      this.initMqtt();
      setReady(status);
      if (status === true) {
        this.afterAll();
      }
      if(!isTest()) {
        if( await testDbExists(Configuration.services[EConstant.admin].pg, EConstant.test) ) {
          Configuration.services[EConstant.test] = this.formatConfig(testDatas["create"]);
        } else await createService(testDatas);
        this.messageListen(EConstant.test, String(this.defaultHttp()) , true);
      }
      this.writeLog(log._head("Ready", EChar.ok));
      this.writeLog(log.logo(EConstant.appVersion));
      return status;
    // no configuration file so First install    
    } else {
        console.log(log.message("file", Configuration.filePath + " " + EChar.notOk));
        this.addListening(this.defaultHttp(), "First launch");
        return true;
    }
  }

  // return config name from config name
  public getConfigNameFromDatabase(input: string): string | undefined {
    if (input !== "all") {
      const aliasName = Object.keys(Configuration.services).filter( (configName: string) => Configuration.services[configName].pg.database === input )[0];
      if (aliasName) return aliasName;
      throw new Error(`No configuration found for ${input} name`);
    }
  }

  public getConfigForExcelExport = (name: string): object=> {
    const result: Record<string, any> = Object.assign({}, Configuration.services[name].pg);
    result["password"] = "*****";
    ["name", "apiVersion", "port", "date_format", "webSite", "nb_page", "forceHttps", "highPrecision", "canDrop", "logFile", "alias", "extensions"].forEach(e => {
      result[e]= Configuration.services[name][e as keyobj];
    }); 
    return result;
  };
  
  public getConfigNameFromName = (name: string): string | undefined => {
    if (name) {
      if (Object.keys(Configuration.services).includes(name)) return name;
      Object.keys(Configuration.services).forEach((configName: string) => {
        if (Configuration.services[configName].alias.includes(name)) return configName;
      });
    }
  };

  // return Iservice Formated for Iservice object or name found in json file
  private formatConfig(input: object | string, name?: string): Iservice {
    if (typeof input === "string") {
      name = input;
      input = Configuration.services[input];
    }
    const goodDbName = name
    ? name
    : input["pg" as keyobj] && input["pg" as keyobj]["database"] ? input["pg" as keyobj]["database"] : `ERROR` || "ERROR";
    return formatconfigFile(goodDbName, input);
  }

  // Add config to configuration file
  public async addConfig(addJson: object): Promise<Iservice | undefined> {
    try {
      const addedConfig = this.formatConfig(addJson);
      Configuration.services[addedConfig.name] = addedConfig;
      if(!isTest()) { // For TDD not create service
        await this.addToServer(addedConfig.name);
        this.writeConfig();
      }
      return addedConfig;
    } catch (error) {
      return undefined;
    }
  }

  // process to add an entry in server
  public async addToServer(key: string): Promise<boolean> {
    this.writeLog(log._head(key));
    return await this.isServiceExist(key, true)
      .then(async (res: boolean) => {
        if (res === true) {
          await userAccess.post(key, {
            username: Configuration.services[key].pg.user,
            email: "steandefault@email.com",
            password: Configuration.services[key].pg.password,
            database: Configuration.services[key].pg.database,
            canPost: true,
            canDelete: true,
            canCreateUser: true,
            canCreateDb: true,
            superAdmin: false,
            admin: false
          });
          
          if(!Configuration.services[key].extensions.includes(EExtensions.file) && ![EConstant.admin as String, EConstant.test as String].includes(key)) createIndexes(key);
          this.messageListen(key, res ? EChar.web : EChar.notOk, true);
          this.addListening(this.defaultHttp(), key);
        }
        return res;
      })
      .catch((error: Error) => {
        this.writeLog(log.error(errors.unableFindCreate, Configuration.services[key].pg.database));
        console.log(error);
        process.exit(111);
      });
  }
  // test in boolean exist if not and logCreate is true then logCreate DB
  private async tryToCreateDB(connectName: string): Promise<boolean> {
    this.writeLog(log.booting("Try create Database", Configuration.services[connectName].pg.database));
    return await createDatabase(connectName)
      .then(async () => {
        this.writeLog(log.booting(`${info.db} ${info.create} [${Configuration.services[connectName].pg.database}]`, EChar.ok ));
        this.createDbConnectionFromConfigName(connectName);
        return true;
      })
      .catch((err: Error) => {        
        this.writeLog(log.error(msg(info.create, info.db), err.message));
        return false;
      });
  }
  // verify if database exist and if create is true create database if not exist.
  private async isServiceExist(connectName: string, create: boolean): Promise<boolean> {
    this.writeLog(log.booting(info.dbExist, Configuration.services[connectName].pg.database));
    return await this.connection(connectName)`select 1+1 AS result`.then( async () => {
      const listTempTables = await this.connection(connectName)`SELECT array_agg(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE 'temp%';`;
      const tables = listTempTables[0]["array_agg"];
      if (tables != null)        
        this.writeLog(log.booting(`DELETE temp table(s) ==> \x1b[33m${connectName}\x1b[32m`,
          await this.connection(connectName).begin(sql => {
            tables.forEach(async (table: string) => {
              await sql.unsafe(`DROP TABLE ${table}`);
            });
          }).then(() => EChar.ok)
            .catch((err: Error) => err.message)
        ));
        if (update[EUpdate.triggers] && update[EUpdate.triggers] === true && connectName !== EConstant.admin) await this.relogCreateTrigger(connectName);
        if (update[EUpdate.beforeAll] && Object.entries(update[EUpdate.beforeAll]).length > 0 ) {
          if (update[EUpdate.beforeAll] && Object.entries(update[EUpdate.beforeAll]).length > 0 ) {
            console.log(log._head(EUpdate.beforeAll));
            try {              
              Object.keys(Configuration.services)
                .filter((e) => ![EConstant.admin as String, EConstant.test as String].includes(e))
                .forEach((connectName: string) => {
                  update[EUpdate.beforeAll].forEach((operation: string) => {
                    this.addToQueries(connectName, operation);
                  });
                });
              await this.executeQueries(EUpdate.beforeAll);
            // RelogCreate triggers for this service
            } catch (error) {
              console.log(error);
            }
          }
        }
        return true;
      })
      .catch(async (error: Error) => {
        // Password authentication failed 
        if (error["code" as keyobj] === "ECONNREFUSED") {
          console.log(log.error(error));
        } else 
        if (error["code" as keyobj] === "28P01") {
          if (!isTest()) return await this.tryToCreateDB(connectName);
          // Database does not exist
        } else if (error["code" as keyobj] === "3D000" && create == true) {
          console.log(log._infos(msg(info.tryCreate, info.db), Configuration.services[connectName].pg.database ));
          if (connectName !== EConstant.test) return await this.tryToCreateDB(connectName);
        } else console.log(error);
        return false;
      });
  }
}
export const config = new Configuration();