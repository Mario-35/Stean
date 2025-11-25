/**
 * Configuration class
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { _DEBUG, appVersion, setDebug, setReady } from "../constants";
import { asyncForEach, compareVersions, decrypt, encrypt, hidePassword, isProduction, isTest } from "../helpers";
import { Iservice, IdbConnection, IserviceInfos, koaContext, Iversion } from "../types";
import { messages } from "../messages";
import { app } from "..";
import { EChar, EColor, EConstant, EOptions } from "../enums";
import path from "path";
import util from "util";
import fs from "fs";
import postgres from "postgres";
import { createDatabase, pgFunctions, testDatas } from "../db/createDb";
import { userAccess } from "../db/dataAccess";
import { formatServiceFile, validJSONService } from "./helpers";
import { MqttServer } from "../mqtt";
import { paths } from "../paths";
import { Trace } from "../log/trace";
import { FORMAT_JSONB } from "../db/constants";
import { queries } from "../db/queries";
import { logging } from "../log";
import { executeSql } from "../db/helpers";
import { EInfos } from "../enums/infos";
import { EErrors } from "../enums/errors";
/**
 * Class to create configs environements
 */
class Configuration {
    // store all services
    static services: { [key: string]: Iservice } = {};
    static adminConnection: postgres.Sql<Record<string, unknown>>;
    static connections: { [key: string]: postgres.Sql<Record<string, unknown>> | undefined } = {}; // not in file only when running to store connection
    static MqttServer: MqttServer;
    static listenPorts: number[] = [];
    static appVersion: Iversion;
    static remoteVersion: Iversion | undefined;
    static upToDate: boolean = true;
    trace: Trace;
    static afterInit: Record<string, string[] | undefined> = {};

    constructor() {
        // override console log for TDD important in production build will remove all console.log
        if (isTest()) {
            console.log = (data: any) => {};
            setDebug(false);
            this.readConfigFile();
            Configuration.services[EConstant.test] = this.formatConfig(testDatas["create"]);
        } else
            console.log = (data: any) => {
                if (data) process.stdout.write(typeof data === "object" ? util.inspect(data, { showHidden: false, depth: null, colors: true }) + EConstant.return : data + EConstant.return);
            };
    }

    allReady(): boolean {
        return !Object.values(Configuration.services)
            .map((e) => e._READY)
            .includes(false);
    }

    // app version
    version(): string {
        return `${Configuration.appVersion.version} [${Configuration.appVersion.date}]`;
    }

    // app repository version
    remoteVersion(): string | undefined {
        return Configuration.remoteVersion ? `${Configuration.remoteVersion.version} [${Configuration.remoteVersion.date}]` : undefined;
    }

    // is update
    upToDate(): boolean {
        return Configuration.upToDate;
    }

    // update options
    private async createUpdateOptions(connectionName: string): Promise<void> {
        logging.status(true, EInfos.UpdateCount).toLogAndFile(true);
    }

    // create a new instance in DB
    private async addService(input: Iservice): Promise<boolean> {
        // except admin
        if (input && input.name === EConstant.admin) return false;
        const datas = queries.insertConfig(input.name, FORMAT_JSONB(input));
        // test database connection
        return await this.adminConnection()
            .unsafe(datas)
            .then((e) => true)
            .catch(async (error) => {
                // relation does not exist error
                if (error.code === "42P01") {
                    return await this.adminConnection()
                        .unsafe(queries.createTableService())
                        .then(async (e) => {
                            return await this.adminConnection()
                                .unsafe(datas)
                                .then((e) => true);
                        })
                        .catch(async (error) => {
                            // relation already exist error
                            if (error.code === "42P07") {
                                return await this.adminConnection()
                                    .unsafe(datas)
                                    .then((e) => true);
                            } else {
                                process.stdout.write(error + EConstant.return);
                                return false;
                            }
                        });
                    // Duplicate Key Violation error
                } else if (error.code === "23505") {
                    return true;
                } else return logging.error(EInfos.createUser, error).toLogAndFile(true).result(false);
            });
    }

    /**
     * log message of listening
     *
     * @param what messace log
     * @param port port number
     * @param db show db infos
     */


    messageListen(what: string, port: string, db?: boolean) {
        if (db) logging.status(true, messages.str(EInfos.dbReady, what), EChar.web).toLogAndFile(true);
        else logging.status(true, `${what} ${EInfos.listenPort} ${port}`, EChar.web).toLogAndFile(true);
    }

    /**
     * Read string (or default configuration file) as configuration file
     *
     * @param input
     * @returns true if it's done
     */
    private async readConfigFile(input?: string): Promise<boolean> {
        logging.file(EInfos.readConfig, input ? "content" : paths.configFile.fileName).toLogAndFile(true);
        try {
            // load File
            const fileContent = input || fs.readFileSync(paths.configFile.fileName, "utf8");
            if (fileContent.trim() === "") {
                logging.error(messages.str(EErrors.fileEmpty, paths.configFile.fileName), paths.configFile.fileName).toLogAndFile(true);
                process.exit(111);
            }
            // decrypt file
            Configuration.services = JSON.parse(decrypt(fileContent));
            const infosAdmin = Configuration.services[EConstant.admin].pg;
            Configuration.adminConnection = postgres(`postgres://${infosAdmin.user}:${infosAdmin.password}@${infosAdmin.host}:${infosAdmin.port || 5432}/${EConstant.pg}`, {
                debug: _DEBUG,
                connection: {
                    application_name: `${EConstant.appName} ${appVersion}`
                }
            });

            try {
                if (!isTest()) {
                    await this.adminConnection()
                        .unsafe("SELECT * FROM services")
                        .then((res: any) => {
                            res.forEach((element: object) => {
                                Configuration.services[element["name" as keyof object]] = element["datas" as keyof object];
                            });
                        });
                    await this.adminConnection()
                        .unsafe("SELECT version()")
                        .then((res: any) => {
                            logging.startEnd(res[0].version.split(",")[0], EColor.Cyan, EColor.White).toLogAndFile(true);
                        });
                }
            } catch (error: any) {
                logging.error(EInfos.accessServies, error).toLogAndFile(true);
                if (error.code === "42P01")
                    await this.adminConnection()
                        .unsafe(queries.createTableService())
                        .catch((e) => {
                            logging.error(EInfos.createServies, EErrors.serviceCreateError).toLogAndFile(true);
                            process.exit(112);
                        });
            }

            if (validJSONService(Configuration.services)) {
                if (isTest() === true) {
                    Configuration.services[EConstant.admin] = this.formatConfig(EConstant.admin);
                    Configuration.services[EConstant.test] = this.formatConfig(testDatas["create"]);
                } else {
                    Object.keys(Configuration.services).forEach(async (element: string) => {
                        Configuration.services[element] = this.formatConfig(element);
                        await this.addService(Configuration.services[element]);
                    });
                }
            } else {
                logging.error("Unknown error", EErrors.configFileError).toLogAndFile(true);
                process.exit(112);
            }
            // rewrite file (to update config modification except in test mode)
            if (!isTest() && config.configFileExist() === false) this.writeConfig();
        } catch (error: any) {
            logging.error(error, EErrors.configFileError).toLogAndFile(true);
            process.exit(111);
        }

        this.trace = new Trace(Configuration.adminConnection);
        return true;
    }

    /**
     *
     * @returns http port number
     */
    private defaultHttp(): number {
        return Configuration.services[EConstant.admin] && Configuration.services[EConstant.admin].ports ? Configuration.services[EConstant.admin].ports?.http || 8029 : 8029;
    }

    /** Initialivze mqtt */
    // private initMqtt() {
    //     Configuration.MqttServer = new MqttServer({
    //         wsPort: Configuration.services[EConstant.admin].ports?.ws || 1883,
    //         tcpPort: Configuration.services[EConstant.admin].ports?.tcp || 9000
    //     });
    // }

    /**
     *
     * @returns broker id
     */
    getBrokerId() {
        return Configuration.MqttServer.broker.id;
    }

    /**
     * Test if config file exists
     *
     * @returns configuration file present
     */
    configFileExist(): boolean {
        return fs.existsSync(paths.configFile.fileName);
    }

    /**
     * Return infos for all services
     *
     * @param ctx koa context
     * @param name service name
     * @returns infos as IserviceInfos
     */
    getInfosForAll(ctx: koaContext): { [key: string]: IserviceInfos } {
        const result: Record<string, any> = {};
        this.getServicesNames().forEach((conf: string) => {
            result[conf] = ctx._.toString();
        });
        return result;
    }

    /**
     *
     * @param name service name
     * @returns service.
     */
    getService(name: string) {
        return Configuration.services[name];
    }

    /**
     *
     * @returns service names
     */
    getServicesNames() {
        return Object.keys(Configuration.services).filter((e) => e !== EConstant.admin);
    }

    /**
     * Write an encrypt config file in json file
     *
     * @param input admin config file
     * @returns true if it's done
     */
    async initConfig(input: string): Promise<boolean> {
        logging.message(EInfos.readConfig, paths.configFile.fileName).toLogAndFile(true);
        return await this.readConfigFile(input);
    }

    /**
     * Write an encrypt config file in json file
     *
     * @returns true if it's done
     */
    private writeConfig(input?: JSON): boolean {
        logging.message(EInfos.writeConfig, paths.configFile.fileName).toLogAndFile(true);
        const datas: string = input ? JSON.stringify(input, null, 4) : JSON.stringify({ admin: Configuration.services[EConstant.admin] }, null, 4);
        return this.writeFile(paths.configFile.fileName, isProduction() === true ? encrypt(datas) : datas);
    }

    /**
     *
     * @param query query
     * @returns result postgres.js object
     */
    async executeAdmin(query: string): Promise<object> {
        logging.query("executeAdmin", query).toLogAndFile();
        return new Promise(async function (resolve, reject) {
            await config
                .adminConnection()
                .unsafe(query)
                .then((res: object) => {
                    resolve(res);
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }

    /**
     *
     * @param name connection name
     * @returns postgres postgres.js
     */
    public connection(name: string): postgres.Sql<Record<string, unknown>> {
        if (!Configuration.connections[name]) this.createDbConnectionFromConfigName(name);
        return Configuration.connections[name] || this.createDbConnection(Configuration.services[name].pg);
    }

    /**
     *
     * @returns return postgres.js connection with admin rights
     */
    public adminConnection(): postgres.Sql<Record<string, unknown>> {
        return Configuration.adminConnection;
    }

    /**
     *
     * @param input IdbConnection
     * @returns return postgres.js connection (psql connect string)
     */
    private createDbConnection(input: IdbConnection): postgres.Sql<Record<string, unknown>> {
        return postgres(`postgres://${input.user}:${input.password}@${input.host}:${input.port || 5432}/${input.database}`, {
            debug: true,
            max: 2000,
            connection: {
                application_name: `${EConstant.appName} ${appVersion}`
            }
        });
    }

    /**
     *
     * @param input connection string name
     * @returns return postgres.js connection (psql connect string)
     */
    public createDbConnectionFromConfigName(input: string): postgres.Sql<Record<string, unknown>> {
        const temp = this.createDbConnection(Configuration.services[input].pg);
        Configuration.connections[input] = temp;
        return temp;
    }

    private async refresh(connectionName: string): Promise<boolean> {
        await this.reCreatePgFunctions(connectionName);
        await this.createUpdateOptions(connectionName);
        return true;
    }

    /**
     *
     * @param connection name
     * @returns true if it's done
     */
    private async reCreatePgFunctions(connectionName: string): Promise<boolean> {
        await asyncForEach(pgFunctions(), async (query: string) => {
            await config
                .connection(connectionName)
                .unsafe(query)
                .catch((error: Error) => logging.error(EInfos.createFunc, error).toLogAndFile(true).result(false));
        });
        logging.status(true, EInfos.createFunc).toLogAndFile(true);
        return true;
    }

    /**
     *
     * @param port listening port
     * @param message messagu info
     */
    addListening(port: number, message: string) {
        if (Configuration.listenPorts.includes(port)) this.messageListen(`ADD ${message}`, String(port));
        else
            app.listen(port, () => {
                Configuration.listenPorts.push(port);
                this.messageListen(message, String(port));
            });
    }

    /**
     * initialize configuration class
     *
     * @param input specific config file
     * @returns true if it's done
     */
    async initialisation(input?: string): Promise<boolean> {
        compareVersions().then((result) => {
            if (result) {
                Configuration.appVersion = result.appVersion;
                Configuration.remoteVersion = result.remoteVersion;
                Configuration.upToDate = result.upToDate;
            }
        });
        if (this.configFileExist() === true || input) {
            await this.readConfigFile(input);
            let status = true;
            // Add test service
            Configuration.services[EConstant.test] = this.formatConfig(testDatas["create"]);
            await asyncForEach(
                // Start connection ALL entries in config file
                Object.keys(Configuration.services).filter((e) => e.toUpperCase()),
                async (key: string) => {
                    try {
                        await this.addToServer(key);
                    } catch (error) {
                        status = logging.error(EInfos.addServer, error).toLogAndFile(true).result(false);
                    }
                }
            );
            // this.initMqtt();
            return status;
            // no configuration file so First install
        } else {
            logging.message("file", paths.configFile.fileName + " " + EChar.notOk).toLogAndFile(true);
            this.addListening(this.defaultHttp(), "First launch");
            return true;
        }
    }

    /**
     * Some sql run to clean services ...
     *
     * @returns boolean when it's done
     */

    async afterInitialisation(): Promise<boolean> {
        await asyncForEach(Object.keys(Configuration.afterInit), async (service: string) => {
            const myService = this.getService(service);
            if (Configuration.afterInit[service]) {
                await executeSql(myService, Configuration.afterInit[service])
                    .then(() => {
                        logging.init().text(EInfos.queryAfter, EColor.Magenta).status(true, service).toLogAndFile(true);
                    })
                    .catch((err) => logging.error(EInfos.queryAfter, err).toLogAndFile(true).result(false));
            }
        });
        return true;
    }

    /**
     * return config name from databse name
     *
     * @param input config to search
     * @returns config name or undefined
     */
    public getConfigNameFromDatabase(input: string): string | undefined {
        if (input !== "all") {
            const aliasName = Object.keys(Configuration.services).filter((configName: string) => Configuration.services[configName].pg.database === input)[0];
            if (aliasName) return aliasName;
            throw new Error(messages.str(EErrors.noConfig, input));
        }
    }

    /**
     * return config name from config name
     *
     * @param input config to search
     * @returns config name or undefined
     */
    public getConfigNameFromName(name: string): string | undefined {
        if (name) {
            if (Object.keys(Configuration.services).includes(name)) return name;
            Object.keys(Configuration.services).forEach((configName: string) => {
                if (Configuration.services[configName].alias.includes(name)) return configName;
            });
        }
    }

    /**
     * Return Iservice Formated for Iservice object or name found in json file
     *
     * @param input config nome to search
     * @param name name of the config (if format)
     * @returns
     */
    private formatConfig(input: object | string, name?: string): Iservice {
        if (typeof input === "string") {
            name = input;
            input = Configuration.services[input];
        }
        const goodDbName = name ? name : input["pg" as keyof object] && input["pg" as keyof object]["database"] ? input["pg" as keyof object]["database"] : `ERROR`;

        return formatServiceFile(goodDbName, input);
    }

    /**
     * Add config to configuration file
     *
     * @param addJson service JSON
     * @returns formated service
     */
    public async addConfig(addJson: object): Promise<Iservice | undefined> {
        try {
            const formatedConfig = this.formatConfig(addJson);
            if (Configuration.services[formatedConfig.name]) {
                throw new Error(`Same configuration name found for ${formatedConfig.name}`);
            }
            Configuration.services[formatedConfig.name] = formatedConfig;
            if (!isTest()) {
                // In TDD not create service
                await this.addToServer(formatedConfig.name);
                this.addService(Configuration.services[formatedConfig.name]);
            }
            return formatedConfig;
        } catch (error) {
            return undefined;
        }
    }

    /**
     * Process to add an entry in server
     *
     * @param key name
     * @returns true if it's ok
     */
    private async addToServer(key: string): Promise<boolean> {
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
                    this.messageListen(key, res ? EChar.web : EChar.notOk, true);
                    this.addListening(this.defaultHttp(), key);
                }
                return res;
            })
            .catch((error: Error) => {
                logging.error("addToServer", error).toLogAndFile(true);
                process.exit(111);
            });
    }

    /**
     *
     * @returns JSON service create
     */
    async export(): Promise<Record<string, any>> {
        return await this.adminConnection()
            .unsafe("SELECT datas FROM services")
            .then((res: any) => {
                const fileContent = fs.readFileSync(paths.configFile.fileName, "utf8");
                const result: JSON = JSON.parse(decrypt(fileContent));
                res.forEach((e: JSON) => {
                    result[e["datas" as keyof object]["name"]] = e["datas" as keyof object];
                });
                this.writeConfig(result);
                return hidePassword(result);
            });
    }

    /**
     * Create dataBase
     *
     * @param serviceName service name
     * @returns true if it's done
     */
    private async createDB(connectName: string): Promise<boolean> {
        logging.message(EInfos.createDB, Configuration.services[connectName].pg.database).toLogAndFile(true);
        return await createDatabase(connectName)
            .then(async () => {
                this.createDbConnectionFromConfigName(connectName);
                return logging.message(`${EInfos.db} ${EInfos.createDB} [${Configuration.services[connectName].pg.database}]`, EChar.ok).toLogAndFile(true).result(true);
            })
            .catch((err: Error) => {
                return logging.error(err.message, EInfos.createDB).toLogAndFile(true).result(false);
            });
    }

    /**
     *
     * @param serviceName service name
     * @param create create if not exist
     * @returns true if it's done
     */
    private async isServiceExist(serviceName: string, create: boolean): Promise<boolean> {
        logging.head(Configuration.services[serviceName].pg.database).toLogAndFile(true);
        return await this.connection(serviceName)`select 1+1 AS result`
            .then(async () => {
                logging.status(true, EInfos.dbExist).toLogAndFile(true);
                const listTempTables = await this.connection(serviceName)`SELECT array_agg(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE 'temp%';`;
                const tables = listTempTables[0]["array_agg"];
                if (tables != null)
                    logging
                        .status(
                            await this.connection(serviceName)
                                .begin((sql) => {
                                    tables.forEach(async (table: string) => {
                                        await sql.unsafe(queries.drop(table));
                                    });
                                })
                                .then(() => true)
                                .catch((err: Error) => logging.error(EInfos.delTemp, err).toLogAndFile(true).result(false)),
                            "Delete temp table(s)"
                        )
                        .to()
                        .log()
                        .file();
                await this.refresh(serviceName);
                await this.connection(serviceName)
                    .unsafe(queries.logLevel("WARNING"))
                    .then(() => {
                        logging.status(true, EInfos.logLevel).toLogAndFile(true);
                    })
                    .catch((err: Error) => logging.error(EInfos.logLevel, err).toLogAndFile(true));

                if (Configuration.services[serviceName].options.includes(EOptions.optimized)) {
                    Configuration.services[serviceName]._READY = false;
                    this.connection(serviceName)
                        .unsafe(`\n${queries.addNbToTable("observation")}\n${queries.updateNb("datastream", false)}\n${queries.updateNb("multidatastream", false)}`)
                        .then(() => {
                            Configuration.services[serviceName]._READY = true;
                            logging.statusAfter(serviceName, EInfos.updateNb).toLogAndFile(true);
                            if (this.allReady() === true) {
                                setReady(true);
                                logging.startEnd(`INIT FINISHED ${EConstant.appName} ${EInfos.ver} : ${appVersion.version}`, EColor.Green, EColor.Yellow).toLogAndFile(true);
                            }
                        });
                } else Configuration.services[serviceName]._READY = true;
                return true;
            })
            .catch(async (error: Error) => {
                // Password authentication failed
                if (error["code" as keyof object] === "ECONNREFUSED") {
                    logging.error(EErrors.connUser, error).toLogAndFile(true);
                } else if (error["code" as keyof object] === "28P01") {
                    if (!isTest()) return await this.createDB(serviceName);
                    // Database does not exist
                } else if (error["code" as keyof object] === "3D000" && create == true) {
                    logging.message(EInfos.startCreateDB, Configuration.services[serviceName].pg.database).toLogAndFile(true);
                    if (serviceName !== EConstant.test) return await this.createDB(serviceName);
                } else return logging.error(EErrors.connUser, error).toLogAndFile(true).result(false);
                return false;
            });
    }

    /**
     *
     * @param path path with filename
     * @param content content to write
     * @returns true when its done
     */
    public writeFile(path: string, content: string): boolean {
        // in some case of crash config is blank so prevent to overrite it
        fs.writeFile(
            // encrypt only in production mode
            path,
            content,
            (error) => {
                if (error) return logging.error(messages.str(EErrors.write, path), error).toLogAndFile(true).result(false);
            }
        );
        return true;
    }

    /**
     * Write an encrypt config file in json file
     *
     * @returns true if it's done
     */
    public saveConfig(myPath: string): boolean {
        logging.message(EInfos.writeConfig, `in ${myPath}`).toLogAndFile(true);
        const datas: string = JSON.stringify({ admin: Configuration.services[EConstant.admin] }, null, 4);
        if (this.writeFile(path.join(myPath, "configuration.json"), isProduction() === true ? encrypt(datas) : datas) === false) return false;
        if (this.writeFile(path.join(myPath, ".key"), paths.key) === false) return false;
        return true;
    }

    /**
     * Write an encrypt config file in json file
     *
     * @returns true if it's done
     */
    public async updateConfig(input: Iservice): Promise<boolean> {
        if (input.name !== EConstant.admin) {
            // const datas = `UPDATE public.services SET "datas" = ${FORMAT_JSONB(input)} WHERE "name" = '${input.name}'`;
            return await this.adminConnection()
                .unsafe(queries.updateConfig(input.name, FORMAT_JSONB(input)))
                .then(async () => await this.refresh(input.name))
                .catch((err) => logging.error(EErrors.serviceUpdateteError, err).toLogAndFile(true).result(false));
        }
        return false;
    }

    public async delete(input: string): Promise<postgres.Sql<Record<string, unknown>> | undefined> {
        try {
            return await this.adminConnection()
                .unsafe(queries.terminate(input))
                .then(
                    async () =>
                        await this.adminConnection()
                            .unsafe(queries.dropDB(input))
                            .then(() => this.adminConnection())
                );
        } catch (error) {
            logging.error(EErrors.serviceUpdateteError, error).toLogAndFile(true);
            return;
        }
    }

    async start(restart: boolean): Promise<boolean> {
        setReady(false);
        logging.start(restart === true ? "Restart" : "Start").toLogAndFile(true);
        return this.initialisation()
            .then(async () => {
                await config.afterInitialisation();
                logging.logo().toLogAndFile(true);
                return true;
            })
            .catch((err) => {
                console.log(err);
                return false;
            });
    }
}

export const config = new Configuration();
