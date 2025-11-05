/**
 * Model Maker
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../configuration";
import { _STREAM } from "../db/constants";
import { queries } from "../db/queries";
import { EColumnType, EConstant, EDataType, EErrors, EExtensions, EInfos, EOptions, ERelations } from "../enums";
import { doubleQuotes, deepClone, isTest, formatPgTableColumn, isString } from "../helpers";
import { Iservice, Ientities, Ientity, IstreamInfos, koaContext, IentityRelation, getColumnType, IentityColumn, Id, typeExtensions } from "../types";
import path from "path";
import fs from "fs";
import {
    FEATUREOFINTEREST,
    THING,
    LOCATION,
    SERVICE,
    CREATEOBSERVATION,
    DATASTREAM,
    LORASTREAMS,
    DECODER,
    HISTORICALLOCATION,
    LORA,
    MULTIDATASTREAM,
    MULTIDATASTREAMOBSERVEDPROPERTY,
    OBSERVATION,
    SENSOR,
    USER,
    LOCATIONHISTORICALLOCATION,
    OBSERVEDPROPERTY,
    THINGLOCATION,
    LOG,
    PAYLOAD
} from "./entities";
import { Geometry, Jsonb, Text } from "./types";
import { logging } from "../log";
import { _DEBUG } from "../constants";
import { executeSql, executeSqlValues } from "../db/helpers";

export class Models {
    static models: {
        [key: string]: Ientities;
    } = {};

    // Create drawInfo diagram
    public getDrawIo(ctx: koaContext) {
        const deleteId = (id: string) => {
            const start = `<mxCell id="${id}"`;
            const end = "</mxCell>";
            fileContent = fileContent.replace(`${start}${fileContent.split(start)[1].split(end)[0]}${end}`, "");
        };
        let fileContent = fs.readFileSync(path.join(__dirname, "/", "model.drawio"), "utf8");
        fileContent = fileContent.replace("&gt;Version&lt;", `&gt;version : ${ctx.service.apiVersion}&lt;`);
        if (!ctx.service.extensions.includes(EExtensions.multiDatastream)) {
            ["114", "115", "117", "118", "119", "116", "120", "121"].forEach((e) => deleteId(e));
            fileContent = fileContent.replace(`&lt;hr&gt;COLUMNS.${ctx.mode.MultiDatastreams.name}`, "");
            fileContent = fileContent.replace(`&lt;hr&gt;COLUMNS.${ctx.mode.MultiDatastreams.name}`, "");
            fileContent = fileContent.replace(`&lt;strong&gt;${ctx.mode.MultiDatastreams.singular}&lt;/strong&gt;`, "");
        }
        Object.keys(ctx.mode).forEach((strEntity: string) => {
            fileContent = fileContent.replace(
                `COLUMNS.${ctx.mode[strEntity].name}`,
                Object.keys(ctx.mode[strEntity].columns)
                    .filter((word) => !word.includes("_") && !word.includes("id"))
                    .map((colName: string) => `&lt;p style=&quot;margin: 0px; margin-left: 8px;&quot;&gt;${colName}: ${getColumnType(ctx.mode[strEntity].columns[colName]).toUpperCase()}&lt;/p&gt;`)
                    .join("")
            );
        });
        return fileContent;
    }

    public async getInfos(ctx: koaContext) {
        const temp = config.getInfos(ctx, ctx.service.name);
        const result: Record<string, any> = {
            ...temp,
            ready: config.connection(ctx.service.name) ? true : false,
            Postgres: {},
            users: {}
        };
        const extensions: Record<string, any> = {};
        switch (ctx.service.apiVersion) {
            case "11":
                result["Ogc link"] = "https://docs.ogc.org/is/18-088/18-088.html";
                break;
            default:
                result["Ogc link"] = "https://docs.ogc.org/is/15-078r6/15-078r6.html";
                break;
        }
        if (ctx.service.extensions.includes(EExtensions.tasking)) extensions["tasking"] = "https://docs.ogc.org/is/17-079r1/17-079r1.html";

        await executeSqlValues(
            ctx.service,
            ` select version(), (SELECT ARRAY(SELECT extname||'-'||extversion AS extension FROM pg_extension) AS extension), (SELECT c.relname||'.'||a.attname FROM pg_attribute a JOIN pg_class c ON (a.attrelid=c.relfilenode) WHERE a.atttypid = 114) ;`
        ).then((res) => {
            result["Postgres"]["version"] = res[0 as keyof object];
            result["Postgres"]["extensions"] = res[1 as keyof object];
        });
        await executeSql(ctx.service, `select username, "canPost", "canDelete", "canCreateUser", "canCreateDb", "admin", "superAdmin" FROM public.user ORDER By username;`).then((res) => {
            Object.keys(res).forEach((e) => {
                result["users"][res[+e as keyof object]["username"]] = {
                    "canPost": res[+e as keyof object]["canPost"],
                    "canDelete": res[+e as keyof object]["canDelete"],
                    "canCreateUser": res[+e as keyof object]["canCreateUser"],
                    "canCreateDb": res[+e as keyof object]["canCreateDb"],
                    "admin": res[+e as keyof object]["admin"],
                    "superAdmin": res[+e as keyof object]["superAdmin"]
                };
            });
        });
        await executeSqlValues(
            ctx.service,
            `SELECT array_agg(table_name) FROM information_schema.tables WHERE table_schema LIKE 'public' AND table_type LIKE 'BASE TABLE' AND position('_' in table_name) = 0`
        ).then(async (res: Record<string, any>) => {
            await executeSql(
                ctx.service,
                ` SELECT JSON_AGG(t) AS results FROM ( SELECT ${res[0 as keyof object].map((e: string) => `(SELECT COUNT(*) FROM "${e}") AS "${e}"${EConstant.return}`).join()}) AS t`
            ).then((res) => {
                result["tables"] = res[0 as keyof object]["results"][0 as keyof object];
            });
        });
        if (ctx.service.options.includes(EOptions.optimized))
            await executeSql(ctx.service, queries.countAll()).then((res) => {
                result["partitioned"] = {};
                Object.values(res[0 as keyof object]["results"]).forEach((e: any) => (result["partitioned"][e["table_name"]] = e["count"]));
            });

        return result;
    }

    // Get multiDatastream or Datastreams infos
    public async getStreamInfos(ctx: koaContext, input: Record<string, any>): Promise<IstreamInfos | undefined> {
        console.log(logging.whereIam(new Error().stack));
        const stream: _STREAM = input["Datastream"] ? "Datastream" : input["MultiDatastream"] ? "MultiDatastream" : undefined;
        if (!stream) return undefined;
        const streamEntity = models.getEntityName(ctx.model, stream);
        if (!streamEntity) return undefined;
        const foiId: Id = input["FeaturesOfInterest"] ? input["FeaturesOfInterest"] : undefined;
        const searchKey = input[models.getModel(ctx.service)[streamEntity].name] || input[models.getModel(ctx.service)[streamEntity].singular];
        const streamId: Id = isNaN(searchKey) ? searchKey[EConstant.id] : searchKey;
        if (streamId) {
            return executeSqlValues(
                ctx.service,
                queries.asJson({
                    query: `SELECT "id", "observationType", "_default_featureofinterest" FROM ${doubleQuotes(models.getModel(ctx.service)[streamEntity].table)} WHERE "id" = ${BigInt(
                        streamId
                    )} LIMIT 1`,
                    singular: true,
                    strip: false,
                    count: false
                })
            )
                .then((res: object) => {
                    return res
                        ? {
                              type: stream,
                              id: res[0 as keyof object]["id"],
                              observationType: res[0 as keyof object]["observationType"],
                              FoId: foiId ? foiId : res[0 as keyof object]["_default_featureofinterest"]
                          }
                        : undefined;
                })
                .catch((error) => {
                    logging.error(EInfos.createUser, error).toLogAndFile();
                    return undefined;
                });
        }
    }

    private version1_0(extensions?: typeof typeExtensions): Ientities {
        const base: Ientities = {};
        base["Things"] = THING;
        base["FeaturesOfInterest"] = FEATUREOFINTEREST;
        base["Locations"] = LOCATION;
        base["ThingsLocations"] = THINGLOCATION;
        base["HistoricalLocations"] = HISTORICALLOCATION;
        base["LocationsHistoricalLocations"] = LOCATIONHISTORICALLOCATION;
        base["ObservedProperties"] = OBSERVEDPROPERTY;
        base["Sensors"] = SENSOR;
        base["Datastreams"] = DATASTREAM;
        base["MultiDatastreams"] = MULTIDATASTREAM;
        base["Observations"] = OBSERVATION;
        base["Services"] = SERVICE;
        base["Logs"] = LOG;
        base["CreateObservations"] = CREATEOBSERVATION;
        base["MultiDatastreamObservedProperties"] = MULTIDATASTREAMOBSERVEDPROPERTY;
        if ((extensions && extensions.includes(EExtensions.lora)) || !extensions) {
            base["LoraStreams"] = LORASTREAMS;
            base["Decoders"] = DECODER;
            base["Loras"] = LORA;
            base["Datastreams"].relations["Loras"] = {
                type: ERelations.hasMany,
                entityRelation: "LoraStreams"
            };
            base["MultiDatastreams"].relations["Loras"] = {
                type: ERelations.hasMany,
                entityRelation: "LoraStreams"
            };
            base["Payload"] = PAYLOAD;
        }
        if ((extensions && extensions.includes(EExtensions.users)) || !extensions) {
            base["Users"] = USER;
        }
        return base;
    }

    private version1_1(input: Ientities): Ientities {
        // add properties to entities
        ["Locations", "FeaturesOfInterest", "ObservedProperties", "Sensors", "Datastreams", "MultiDatastreams"].forEach((entityName: string) => {
            if (input[entityName]) input[entityName].columns["properties"] = new Jsonb().column();
        });
        // add geom to Location
        input.Locations.columns["geom"] = new Geometry().column();
        return input;
    }

    private createVersion(verStr: string, extensions?: typeof typeExtensions): Ientities {
        console.log(logging.whereIam(new Error().stack));
        switch (verStr) {
            case "v1.1":
                return this.version1_1(deepClone(this.createVersion("v1.0", extensions)));
            default:
                return this.version1_0(extensions);
        }
    }

    public listVersion() {
        // MUST BE SORTED
        return ["v1.0", "v1.1"];
    }

    public getService(service: Iservice | string): Iservice {
        if (typeof service === "string") {
            const nameConfig = config.getConfigNameFromName(service);
            if (!nameConfig) throw new Error(EErrors.configName);
            return config.getService(nameConfig);
        }
        return service;
    }

    public listTables(model: Ientities): string[] {
        console.log(logging.whereIam(new Error().stack));

        return Object.values(model)
            .map((e) => e.table)
            .filter((e) => e.trim() !== "");
    }

    public addTriggersOnTables(model: Ientities, triggerName: string): string[] {
        return this.listTables(model).map((table) => queries.createTrigger(table, triggerName));
    }

    public removeTriggersOnTables(model: Ientities, triggerName: string): string[] {
        return this.listTables(model).map((table) => queries.dropTrigger(table, triggerName));
    }

    public isSingular(model: Ientities, input: string): boolean {
        if (config && input) {
            const entityName = this.getEntityName(model, input);
            return entityName ? model[entityName].singular == input : false;
        }
        return false;
    }

    public getEntityName(model: Ientities, search: string): string | undefined {
        const testString: string | undefined = search
            .trim()
            .match(/[a-zA-Z_]/g)
            ?.join("");
        return testString
            ? model.hasOwnProperty(testString)
                ? testString
                : Object.keys(model).filter((elem: string) => model[elem].table == testString.toLowerCase() || model[elem].singular == testString)[0]
            : undefined;
    }

    public getEntityStrict = (model: Ientities, entity: Ientity | string): Ientity | undefined => {
        return typeof entity === "string" ? model[entity] : model[entity.name];
    };

    public getEntity = (model: Ientities, entity: Ientity | string): Ientity | undefined => {
        return model[this.getEntityName(model, isString(entity) ? entity.trim() : entity.name) || ""];
    };

    public getColumn = (model: Ientities, entity: Ientity | string, columnName: string): IentityColumn | undefined => {
        return model[this.getEntity(model, entity)?.name || ""].columns[columnName];
    };

    public getColumnType = (model: Ientities, entity: Ientity | string, columnName: string): EDataType => {
        return model[this.getEntity(model, entity)?.name || ""].columns[columnName].dataType;
    };

    public getRelationName = (entity: Ientity, searchs: string[]): string | undefined => {
        let res: string | undefined = undefined;
        searchs.forEach((e) => {
            if (entity.relations[e]) {
                res = e;
                return;
            }
        });
        return res;
    };

    public getRelation = (model: Ientities, entity: Ientity, relation: Ientity | string): IentityRelation | undefined => {
        const entityRelation = this.getEntity(model, relation);
        return entityRelation ? entity.relations[entityRelation.name] || entity.relations[entityRelation.singular] : undefined;
    };

    public getRelationColumnTable = (model: Ientities, entity: Ientity | string, test: string): EColumnType | undefined => {
        const tempEntity = this.getEntity(model, entity);
        if (tempEntity) return tempEntity.relations.hasOwnProperty(test) ? EColumnType.Relation : tempEntity.columns.hasOwnProperty(test) ? EColumnType.Column : undefined;
    };

    public getSelectColumnList(model: Ientities, entity: Ientity | string, complete: boolean, exclus?: string[]) {
        const tempEntity = this.getEntity(model, entity);
        return tempEntity
            ? Object.keys(tempEntity.columns)
                  .filter((word) => !word.includes("_") && !(exclus || [""]).includes(word))
                  .map((e: string) => (complete ? formatPgTableColumn(tempEntity.table, e) : doubleQuotes(e)))
            : [];
    }

    public isColumnType(model: Ientities, entity: Ientity | string, column: string, test: string): boolean {
        if (config && entity) {
            const tempEntity = this.getEntity(model, entity);
            return tempEntity && tempEntity.columns[column] ? getColumnType(tempEntity.columns[column]) === test.toLowerCase() : false;
        }
        return false;
    }

    public getRoot(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        let expectedResponse: object[] = [];
        Object.keys(ctx.model)
            .filter((elem: string) => ctx.model[elem].order > 0)
            .sort((a, b) => (ctx.model[a].order > ctx.model[b].order ? 1 : -1))
            .forEach((value: string) => {
                expectedResponse.push({
                    name: ctx.model[value].name,
                    url: `${ctx.decodedUrl.linkbase}/${ctx.service.apiVersion}/${value}`
                });
            });

        switch (ctx.service.apiVersion) {
            case "v1.0":
                return {
                    value: expectedResponse.filter((elem) => Object.keys(elem).length)
                };
            case "v1.1":
                expectedResponse = expectedResponse.filter((elem) => Object.keys(elem).length);
                // base
                const list: string[] = [
                    "https://docs.ogc.org/is/18-088/18-088.html",
                    // list.push("https://docs.ogc.org/is/18-088/18-088.html#req-batch-request-batch-request");
                    "https://docs.ogc.org/is/18-088/18-088.html#uri-components",
                    "https://docs.ogc.org/is/18-088/18-088.html#resource-path",
                    "https://docs.ogc.org/is/18-088/18-088.html#req-resource-path-resource-path-to-entities",
                    "https://docs.ogc.org/is/18-088/18-088.html#requesting-data",
                    "https://docs.ogc.org/is/18-088/18-088.html#create-update-delete",
                    "https://docs.ogc.org/is/18-088/18-088.html#req-data-array-data-array",
                    "https://docs.ogc.org/is/18-088/18-088.html#req-resource-path-resource-path-to-entities",
                    "http://docs.oasis-open.org/odata/odata-json-format/v4.01/odata-json-format-v4.01.html",
                    "https://datatracker.ietf.org/doc/html/rfc4180"
                ];
                // "http://www.opengis.net/spec/iot_sensing/1.1/req/receive-updates-via-mqtt/receive-updates",
                // "https://fraunhoferiosb.github.io/FROST-Server/extensions/DeepSelect.html",
                // "https://fraunhoferiosb.github.io/FROST-Server/extensions/GeoJSON-ResultFormat.html",
                // "https://fraunhoferiosb.github.io/FROST-Server/extensions/JsonBatchRequest.html",
                // "https://fraunhoferiosb.github.io/FROST-Server/extensions/OpenAPI.html",
                // "https://fraunhoferiosb.github.io/FROST-Server/extensions/ResponseMetadata.html",
                // "https://fraunhoferiosb.github.io/FROST-Server/extensions/SelectDistinct.html",
                // "https://github.com/INSIDE-information-systems/SensorThingsAPI/blob/master/CSV-ResultFormat/CSV-ResultFormat.md",
                // "https://github.com/INSIDE-information-systems/SensorThingsAPI/blob/master/EntityLinking/Linking.md#Expand",
                // "https://github.com/INSIDE-information-systems/SensorThingsAPI/blob/master/EntityLinking/Linking.md#Filter",
                // "https://github.com/INSIDE-information-systems/SensorThingsAPI/blob/master/EntityLinking/Linking.md#NavigationLinks"],
                if (ctx.service.extensions.includes(EExtensions.lora)) list.push(`${ctx.decodedUrl.origin}/#api-Loras`);
                if (ctx.service.extensions.includes(EExtensions.multiDatastream)) list.push("https://docs.ogc.org/is/18-088/18-088.html#multidatastream-extension");
                if (ctx.service.extensions.includes(EExtensions.mqtt))
                    list.push("https://docs.ogc.org/is/18-088/18-088.html#req-create-observations-via-mqtt-observations-creation", "https://docs.ogc.org/is/18-088/18-088.html#mqtt-extension");
                const temp: Record<string, any> = {
                    "value": expectedResponse.filter((elem) => Object.keys(elem).length),
                    "serverSettings": {
                        "conformance": list
                    }
                };
                list.push(`${ctx.decodedUrl.origin}/#api-Services`);
                list.push(`${ctx.decodedUrl.origin}/#api-Token`);
                list.push(`${ctx.decodedUrl.origin}/#api-Import`);
                list.push(`${ctx.decodedUrl.origin}/#api-Format`);
                temp[`${ctx.decodedUrl.linkbase}/${ctx.service.apiVersion}/req/receive-updates-via-mqtt/receive-updates`] = {
                    "endpoints": [`mqtt://server.example.com:${config.getService(EConstant.admin).ports?.ws}`, "ws://server.example.com/sensorThings"]
                };
                return temp;
            default:
                break;
        }
    }

    /**
     * initialize model class
     */
    public initialisation() {
        if (isTest()) this.getModel(EConstant.test);
    }

    public getModel(service?: Iservice | string): Ientities {
        if (service) {
            service = this.getService(service);
            // if (!Models.models[service.name]) Models.models[service.name] = this.createModel(service.apiVersion, service.options, service.extensions);
            Models.models[service.name] = this.createModel(service.apiVersion, service.options, service.extensions);
            return Models.models[service.name];
        }
        return this.createVersion("v1.1");
    }

    public getCreateModel(service: Iservice | string): Ientities {
        service = this.getService(service);
        return this.createModel(service.apiVersion, service.options, service.extensions);
    }

    private createModel(version: string, options: string[], extensions: typeof typeExtensions): Ientities {
        console.log(logging.whereIam(new Error().stack));
        let model = this.createVersion(version, extensions);
        const name = options.includes(EOptions.unique) ? new Text().notNull().default(EInfos.noName).unique().column() : new Text().notNull().column();
        const description = options.includes(EOptions.unique) ? new Text().notNull().default(EInfos.noName).unique().column() : new Text().notNull().column();
        Object.keys(model).forEach((k: string) => {
            if (model[k].columns["name"]) model[k].columns.name = name;
            if (model[k].columns["description"]) model[k].columns.name = description;
        });
        return model;
    }
}

export const models = new Models();
