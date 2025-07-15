/**
 * Configuration class
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { setReady, _DEBUG, timestampNow, logDbError, appVersion } from "../constants";
import { asyncForEach, compareVersions, decrypt, encrypt, hidePassword, isProduction, isTest, logToHtml } from "../helpers";
import { Iservice, IdbConnection, IserviceInfos, koaContext, keyobj, Iversion } from "../types";
import { errors, info, infos, msg } from "../messages";
import { app } from "..";
import { color, EChar, EColor, EConstant, EOptions } from "../enums";
import path from "path";
import fs from "fs";
import postgres from "postgres";
import { log } from "../log";
import { createDatabase, pgFunctions, testDatas } from "../db/createDb";
import { userAccess } from "../db/dataAccess";
import { formatServiceFile, validJSONService } from "./helpers";
import { MqttServer } from "../mqtt";
import { createService } from "../db/helpers";
import { models } from "../models";
import { paths } from "../paths";
import { Trace } from "../log/trace";
import { FORMAT_JSONB } from "../db/constants";

/**
 * Class to create configs environements
 */
class Configuration {
    // store all services
    static services: { [key: string]: Iservice } = {};
    static adminConnection: postgres.Sql<Record<string, unknown>>;
    static MqttServer: MqttServer;
    static listenPorts: number[] = [];
    static appVersion: Iversion;
    static remoteVersion: Iversion | undefined;
    static upToDate: boolean = true;
    trace: Trace;

    constructor() {
        // override console log for TDD important in production build will remove all console.log
        if (isTest()) {
            console.log = (data: any) => {};
            this.readConfigFile();
        } else
            console.log = (data: any) => {
                if (data) this.writeLog(data);
            };
    }

    createServiceTable() {
        return `CREATE TABLE public.services (
      "name" text NOT NULL,
      "datas" jsonb NULL,
      "stats" jsonb NULL,
      CONSTRAINT services_unik_name UNIQUE (name)
    ); CREATE INDEX services_name ON public.services USING btree (name);`;
    }

    version(): string {
        return `${Configuration.appVersion.version} [${Configuration.appVersion.date}]`;
    }

    remoteVersion(): string | undefined {
        return Configuration.remoteVersion ? `${Configuration.remoteVersion.version} [${Configuration.remoteVersion.date}]` : undefined;
    }

    upToDate(): boolean {
        return Configuration.upToDate;
    }

    private async updateService(input: Iservice, fromInside?: boolean): Promise<boolean> {
        if (input.name !== EConstant.admin) {
            const service = models.getStats(input);
            if (service)
                return this.connection(input.name)
                    .unsafe(service)
                    .then(async (res) => {
                        const datas = `UPDATE public.services SET stats = ${FORMAT_JSONB(res[0].results[0])} WHERE name = '${input.name}'`;
                        Configuration.services[input.name]._stats = res[0].results[0];
                        return await this.adminConnection()
                            .unsafe(datas)
                            .then((e) => true)
                            .catch((err) => {
                                return logDbError(err);
                            });
                    })
                    .catch(async (err) => {
                        if (!fromInside && isTest() === false && input.name === EConstant.test && err.code == "3D000") {
                            await createService(input, testDatas);
                            return this.updateService(input, true);
                        }
                        console.log(err);
                        return false;
                    });
        }
        return false;
    }

    private async addService(input: Iservice): Promise<boolean> {
        if (input && input.name === EConstant.admin) return false;
        const datas = `INSERT INTO public.services ("name", "datas") VALUES('${input.name}', ${FORMAT_JSONB(input)}) ON CONFLICT DO NOTHING;`;
        return await this.adminConnection()
            .unsafe(datas)
            .then((e) => true)
            .catch(async (error) => {
                console.log(error);
                if (error.code === "42P01") {
                    return await this.adminConnection()
                        .unsafe(this.createServiceTable())
                        .then(async (e) => {
                            return await this.adminConnection()
                                .unsafe(datas)
                                .then((e) => true);
                        })
                        .catch(async (err) => {
                            if (err.code === "42P07") {
                                return await this.adminConnection()
                                    .unsafe(datas)
                                    .then((e) => true);
                            } else {
                                process.stdout.write(err + EConstant.return);
                                return false;
                            }
                        });
                } else if (error.code === "23505") {
                    return true;
                } else {
                    console.log(error);
                    process.stdout.write(error + EConstant.return);
                    return false;
                }
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
        if (db) this.writeLog(log.booting(`${color(EColor.Magenta)}${info.db} => ${color(EColor.Yellow)}${what}${color(EColor.Default)} ${info.onLine}`, port));
        else this.writeLog(log.booting(`${color(EColor.Yellow)}${what}${color(EColor.Yellow)} ${color(EColor.Green)}${info.listenPort}`, port));
    }

    /**
     * Override console log
     *
     * @param input
     */
    writeLog(input: any) {
        if (input) {
            process.stdout.write(input + EConstant.return);
            paths.logFile.writeStream(logToHtml(input));
        }
    }

    /**
     * Read string (or default configuration file) as configuration file
     *
     * @param input
     * @returns true if it's done
     */
    private async readConfigFile(input?: string): Promise<boolean> {
        this.writeLog(
            `${color(EColor.Red)}${"▬".repeat(24)} ${color(EColor.Cyan)} ${`START ${EConstant.appName} ${info.ver} : ${appVersion.version} du ${appVersion.date} [${process.env.NODE_ENV}]`} ${color(
                EColor.White
            )} ${new Date().toLocaleDateString()} : ${timestampNow()} ${color(EColor.Red)} ${"▬".repeat(24)}${color(EColor.Reset)}`
        );
        log.newLog(log.message("Root", paths.root));
        this.writeLog(log.message(infos(["read", "config"]), input ? "content" : paths.configFile.fileName));
        try {
            // load File
            const fileContent = input || fs.readFileSync(paths.configFile.fileName, "utf8");
            if (fileContent.trim() === "") {
                log.error(msg(errors.fileEmpty, paths.configFile.fileName), paths.configFile.fileName);
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
                if (!isTest())
                    await this.adminConnection()
                        .unsafe("SELECT * FROM services")
                        .then((res: any) => {
                            res.forEach((element: object) => {
                                Configuration.services[element["name" as keyof object]] = element["datas" as keyof object];
                            });
                        });
            } catch (error: any) {
                console.log(error);

                if (error.code === "42P01")
                    await this.adminConnection()
                        .unsafe(this.createServiceTable())
                        .catch((e) => {
                            console.log(this.createServiceTable());
                            log.error(errors.serviceCreateError);
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
                        await this.updateService(Configuration.services[element]);
                    });
                }
            } else {
                log.error(errors.configFileError);
                process.exit(112);
            }
            // rewrite file (to update config modification except in test mode)
            if (!isTest() && config.configFileExist() === false) this.writeConfig();
        } catch (error: any) {
            console.log(error);

            log.error(errors.configFileError, error["message"]);
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
    private initMqtt() {
        Configuration.MqttServer = new MqttServer({
            wsPort: Configuration.services[EConstant.admin].ports?.ws || 1883,
            tcpPort: Configuration.services[EConstant.admin].ports?.tcp || 9000
        });
    }

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
     * Return infos of a service
     *
     * @param 1
     * @param name service name
     * @returns infos as IserviceInfos
     */
    getInfos = (ctx: koaContext, name: string): IserviceInfos => {
        const protocol: string = ctx.request.headers["x-forwarded-proto"]
            ? ctx.request.headers["x-forwarded-proto"].toString()
            : Configuration.services[name].options.includes(EOptions.forceHttps)
            ? "https"
            : ctx.protocol;

        // make linkbase
        let linkBase = ctx.request.headers["x-forwarded-host"]
            ? `${protocol}://${ctx.request.headers["x-forwarded-host"].toString()}`
            : ctx.request.header.host
            ? `${protocol}://${ctx.request.header.host}`
            : "";

        // make rootName
        if (!linkBase.includes(name)) linkBase += "/" + name;
        const version = Configuration.services[name].apiVersion || undefined;
        return {
            protocol: protocol,
            linkBase: linkBase,
            version: version || "",
            root: process.env.NODE_ENV?.trim() === EConstant.test ? `proxy/${version || ""}` : `${linkBase}/${version || ""}`,
            model: version ? `https://app.diagrams.net/?lightbox=1&edit=_blank#U${linkBase}/${version}/draw` : "",
            service: {
                apiVersion: Configuration.services[name].apiVersion || "",
                date_format: Configuration.services[name].date_format,
                nb_page: Configuration.services[name].nb_page,
                extensions: Configuration.services[name].extensions,
                options: Configuration.services[name].options,
                synonyms: Configuration.services[name].synonyms,
                csvDelimiter: Configuration.services[name].csvDelimiter
            },
            stats: Configuration.services[name]._stats || JSON.parse("{}"),
            users: JSON.parse("{}")
        };
    };

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
            result[conf] = this.getInfos(ctx, conf);
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
        this.writeLog(log.message(infos(["read", "config"]), paths.configFile.fileName));
        return await this.readConfigFile(input);
    }

    /**
     * Write an encrypt config file in json file
     *
     * @returns true if it's done
     */
    private writeConfig(input?: JSON): boolean {
        this.writeLog(log.message(infos(["write", "config"]), paths.configFile.fileName));
        const datas: string = input ? JSON.stringify(input, null, 4) : JSON.stringify({ admin: Configuration.services[EConstant.admin] }, null, 4);
        return this.writeFile(paths.configFile.fileName, isProduction() === true ? encrypt(datas) : datas);
    }

    /**
     * Execute one query
     *
     * @param service service
     * @param query query
     * @returns result postgres.js object
     */
    private async executeOneSql(service: Iservice, query: string): Promise<object> {
        this.writeLog(log.query(query));
        return new Promise(async function (resolve, reject) {
            await config
                .connection(service.name)
                .unsafe(query)
                .then((res: object) => {
                    resolve(res);
                })
                .catch((err: Error) => {
                    if (!isTest() && +err["code" as keyobj] === 23505) config.writeLog(log.queryError(query, err));
                    reject(err);
                });
        });
    }

    /**
     * Execute multiple queries
     *
     * @param service service
     * @param query query
     * @returns result postgres.js object
     */
    private async executeMultiSql(service: Iservice, query: string[]): Promise<object> {
        this.writeLog(log.query(query));
        return new Promise(async function (resolve, reject) {
            await config
                .connection(service.name)
                .begin((sql) => query.map((e: string) => sql.unsafe(e)))
                .then((res: object) => {
                    resolve(res);
                })
                .catch((err: Error) => {
                    if (!isTest() && +err["code" as keyobj] === 23505) config.writeLog(log.queryError(query, err));
                    reject(err);
                });
        });
    }

    /**
     *
     * @param service service or service name
     * @param query one or multiple queries
     * @returns result postgres.js object
     */
    async executeSql(service: Iservice | string, query: string | string[]): Promise<object> {
        service = typeof service === "string" ? Configuration.services[service as keyof object] : service;
        return typeof query === "string" ? this.executeOneSql(service, query) : this.executeMultiSql(service, query);
    }

    /**
     *
     * @param query query
     * @returns result postgres.js object
     */
    async executeAdmin(query: string): Promise<object> {
        this.writeLog(log.query(query));
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
     * @param service service or service name
     * @param query one or multiple queries
     * @returns result postgres.js object values
     */
    async executeSqlValues(service: Iservice | string, query: string | string[]): Promise<object> {
        this.writeLog(log.query(query));
        if (typeof query === "string") {
            return new Promise(async function (resolve, reject) {
                await config
                    .connection(typeof service === "string" ? service : service.name)
                    .unsafe(query)
                    .values()
                    .then((res: Record<string, any>) => {
                        resolve(res[0]);
                    })
                    .catch((err: Error) => {
                        if (!isTest() && +err["code" as keyof object] === 23505) config.writeLog(log.queryError(query, err));
                        reject(err);
                    });
            });
        } else {
            return new Promise(async function (resolve, reject) {
                let result = {};
                await asyncForEach(query, async (sql: string) => {
                    await config
                        .connection(typeof service === "string" ? service : service.name)
                        .unsafe(sql)
                        .values()
                        .then((res: Record<string, any>) => {
                            result = { ...result, ...res[0] };
                        })
                        .catch((err: Error) => {
                            if (!isTest() && +err["code" as keyof object] === 23505) config.writeLog(log.queryError(query, err));
                            reject(err);
                        });
                });
                resolve(result);
            });
        }
    }

    /**
     *
     * @param string
     * @returns Hash code number
     */
    // private hashCode(s: string): number {
    //     return s.split("").reduce((a, b) => {
    //         a = (a << 5) - a + b.charCodeAt(0);
    //         return a & a;
    //     }, 0);
    // }

    /**
     *
     * @param name connection name
     * @returns postgres postgres.js
     */
    public connection(name: string): postgres.Sql<Record<string, unknown>> {
        if (!Configuration.services[name]._connection) this.createDbConnectionFromConfigName(name);
        return Configuration.services[name]._connection || this.createDbConnection(Configuration.services[name].pg);
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
        Configuration.services[input]._connection = temp;
        return temp;
    }

    /**
     *
     * @param connection name
     * @returns nothing
     */
    private clean(connection: string): void {
        if (![EConstant.admin as String, EConstant.test as String].includes(connection)) {
            const queries = models.getClean(connection);
            if (queries)
                queries.forEach((query) => {
                    config
                        .connection(connection)
                        .unsafe(query)
                        .catch((error: Error) => {
                            console.log(error);
                        });
                });
        }
    }

    /**
     *
     * @param connection name
     * @returns true if it's done
     */
    private async reCreatePgFunctions(connection: string): Promise<boolean> {
        await asyncForEach(pgFunctions(), async (query: string) => {
            const name = query.split(" */")[0].split("/*")[1].trim();
            await config
                .connection(connection)
                .unsafe(query)
                .then(() => {
                    log.create(`[${connection}] ${name}`, EChar.ok);
                })
                .catch((error: Error) => {
                    console.log(error);
                    return false;
                });
        });
        this.writeLog(log.message(info.createFunc, connection));
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
        compareVersions().then((temp) => {
            if (temp) {
                Configuration.appVersion = temp.appVersion;
                Configuration.remoteVersion = temp.remoteVersion;
                Configuration.upToDate = temp.upToDate;
            }
        });

        if (this.configFileExist() === true || input) {
            await this.readConfigFile(input);
            console.log(log.message(info.config, info.loaded + " " + EChar.ok));
            let status = true;
            await asyncForEach(
                // Start connection ALL entries in config file
                Object.keys(Configuration.services).filter((e) => e.toUpperCase() !== EConstant.test.toUpperCase()),
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
            // note that is executed without async to not block start processus
            // if (!isTest()) {
            //     if (await testDbExists(Configuration.services[EConstant.admin].pg, EConstant.test)) {
            //         Configuration.services[EConstant.test] = this.formatConfig(testDatas["create"]);
            //     } else await createService(ctx, testDatas);
            //     this.messageListen(EConstant.test, String(this.defaultHttp()), true);
            // }

            this.writeLog(log._head("Ready", EChar.ok));
            this.writeLog(log.logo(appVersion.version));
            return status;
            // no configuration file so First install
        } else {
            console.log(log.message("file", paths.configFile.fileName + " " + EChar.notOk));
            this.addListening(this.defaultHttp(), "First launch");
            return true;
        }
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
            throw new Error(`No configuration found for ${input} name`);
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
        const goodDbName = name ? name : input["pg" as keyobj] && input["pg" as keyobj]["database"] ? input["pg" as keyobj]["database"] : `ERROR`;
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
                    this.messageListen(key, res ? EChar.web : EChar.notOk, true);
                    this.addListening(this.defaultHttp(), key);
                }
                return res;
            })
            .catch((error: Error) => {
                log.error(errors.unableFindCreate, Configuration.services[key].pg.database);
                console.log(error);
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
        this.writeLog(log.booting(info.try, Configuration.services[connectName].pg.database));
        return await createDatabase(connectName)
            .then(async () => {
                this.writeLog(log.booting(`${info.db} ${info.create} [${Configuration.services[connectName].pg.database}]`, EChar.ok));
                this.createDbConnectionFromConfigName(connectName);
                return true;
            })
            .catch((err: Error) => {
                log.error(msg(info.create, info.db), err.message);
                return false;
            });
    }

    /**
     *
     * @param serviceName service name
     * @param create create if not exist
     * @returns true if it's done
     */
    private async isServiceExist(serviceName: string, create: boolean): Promise<boolean> {
        this.writeLog(log.booting(info.dbExist, Configuration.services[serviceName].pg.database));
        return await this.connection(serviceName)`select 1+1 AS result`
            .then(async () => {
                const listTempTables = await this.connection(serviceName)`SELECT array_agg(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE 'temp%';`;
                const tables = listTempTables[0]["array_agg"];
                if (tables != null)
                    this.writeLog(
                        log.booting(
                            `DELETE temp table(s) ==> \x1b[33m${serviceName}\x1b[32m`,
                            await this.connection(serviceName)
                                .begin((sql) => {
                                    tables.forEach(async (table: string) => {
                                        await sql.unsafe(`DROP TABLE ${table}`);
                                    });
                                })
                                .then(() => EChar.ok)
                                .catch((err: Error) => err.message)
                        )
                    );
                await this.reCreatePgFunctions(serviceName);
                this.clean(serviceName);
                return true;
            })
            .catch(async (error: Error) => {
                // Password authentication failed
                if (error["code" as keyobj] === "ECONNREFUSED") {
                    log.error(error);
                } else if (error["code" as keyobj] === "28P01") {
                    if (!isTest()) return await this.createDB(serviceName);
                    // Database does not exist
                } else if (error["code" as keyobj] === "3D000" && create == true) {
                    console.log(log._infos(msg(info.tryCreate, info.db), Configuration.services[serviceName].pg.database));
                    if (serviceName !== EConstant.test) return await this.createDB(serviceName);
                } else console.log(error);
                return false;
            });
    }

    /**
     *
     * @param path ath with filename
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
                if (error) {
                    console.log(error);
                    return false;
                }
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
        this.writeLog(log.message(infos(["write", "config"]), `in ${myPath}`));
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
            const datas = `UPDATE public.services SET "datas" = ${FORMAT_JSONB(input)} WHERE "name" = '${input.name}'`;
            return await this.adminConnection()
                .unsafe(datas)
                .then((e) => true)
                .catch((err) => {
                    return logDbError(err);
                });
        }

        return false;
    }
}

export const config = new Configuration();
