import { config } from "../configuration";
import { log } from "../log";
import { _STREAM } from "../db/constants";
import { asJson } from "../db/queries";
import { EColumnType, EConstant, EExtensions, EOptions, ETable, filterEntities } from "../enums";
import { doubleQuotesString, deepClone, isTest, formatPgTableColumn, isString } from "../helpers";
import { errors, info } from "../messages";
import { Iservice, Ientities, Ientity, IstreamInfos, koaContext, IentityRelation, getColumnType } from "../types";
import fs from "fs";
import { FEATUREOFINTEREST, THING, LOCATION, SERVICE, CREATEOBSERVATION, CREATEFILE, DATASTREAM, DECODER, HISTORICALLOCATION, LOG, LORA, MULTIDATASTREAM, MULTIDATASTREAMOBSERVEDPROPERTY, OBSERVATION, SENSOR, USER, LOCATIONHISTORICALLOCATION, OBSERVEDPROPERTY, THINGLOCATION, FILE, LINE } from "./entities";
import { Geometry, Jsonb, Text } from "./types";

export class Models {
  static models : { 
    [key: string]: Ientities;
  } = {};

  private testVersion(verStr: string) {
    return Models.models.hasOwnProperty(verStr);
  };

  public getDrawIo(ctx: koaContext) {
    const deleteId = (id: string) => {
      const start = `<mxCell id="${id}"`;
      const end = "</mxCell>";
      fileContent = fileContent.replace(`${start}${fileContent.split(start)[1].split(end)[0]}${end}`, "");      
    };
    const entities = Models.models[ctx.service.apiVersion];
    let fileContent = fs.readFileSync(__dirname + `/model.drawio`, "utf8");
    fileContent = fileContent.replace('&gt;Version&lt;', `&gt;version : ${ctx.service.apiVersion}&lt;`);
    if (!ctx.service.extensions.includes(EExtensions.logs)) deleteId("124");
    if (!ctx.service.extensions.includes(EExtensions.multiDatastream)) {
      ["114" ,"115" ,"117" ,"118" ,"119" ,"116" ,"120" ,"121"].forEach(e => deleteId(e));
      fileContent = fileContent.replace(`&lt;hr&gt;COLUMNS.${entities.MultiDatastreams.name}`, "");
      fileContent = fileContent.replace(`&lt;hr&gt;COLUMNS.${entities.MultiDatastreams.name}`, "");
      fileContent = fileContent.replace(`&lt;strong&gt;${entities.MultiDatastreams.singular}&lt;/strong&gt;`, "");
    }
    Object.keys(entities).forEach((strEntity: string) => {
      fileContent = fileContent.replace(`COLUMNS.${entities[strEntity].name}`, Object.keys(entities[strEntity].columns).filter((word) => !word.includes("_") && !word.includes("id")).map((colName: string) => `&lt;p style=&quot;margin: 0px; margin-left: 8px;&quot;&gt;${colName}: ${getColumnType(entities[strEntity].columns[colName]).toUpperCase()}&lt;/p&gt;`).join(""));
    });
    return fileContent;
  }
  
  public async getInfos(ctx: koaContext) {
    const temp = config.getInfos(ctx, ctx.service.name)
    const result: Record<string, any> = {
      ... temp,
      ready : ctx.service._connection ? true : false,
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
    if (ctx.service.extensions.includes(EExtensions.logs)) extensions["logs"] = `${ctx.decodedUrl.linkbase}/${ctx.service.apiVersion}/Logs`;
    
    result["extensions"] = extensions;
    result["options"] = ctx.service.options;
    await config.executeSqlValues(ctx.service, ` select version(), (SELECT ARRAY(SELECT extname||'-'||extversion AS extension FROM pg_extension) AS extension), (SELECT c.relname||'.'||a.attname FROM pg_attribute a JOIN pg_class c ON (a.attrelid=c.relfilenode) WHERE a.atttypid = 114) ;`
    ).then(res => {
      result["Postgres"]["version"] = res[0 as keyof object];
      result["Postgres"]["extensions"] = res[1 as keyof object];
    });
    await config.executeSql(ctx.service, `select username, "canPost", "canDelete", "canCreateUser", "canCreateDb", "admin", "superAdmin" FROM public.user ORDER By username;`
    ).then(res => {
      Object.keys(res).forEach(e => {        
        result["users"][res[+e as keyof object]["username"]] = {
          "canPost": res[+e as keyof object]["canPost"],
          "canDelete": res[+e as keyof object]["canDelete"],
          "canCreateUser": res[+e as keyof object]["canCreateUser"],
          "canCreateDb": res[+e as keyof object]["canCreateDb"],
          "admin": res[+e as keyof object]["admin"],
          "superAdmin": res[+e as keyof object]["superAdmin"],
        }
      })
    });
    return result;
  }
  
  // Get multiDatastream or Datastreams infos
  public async getStreamInfos(service: Iservice, input: Record<string, any> ): Promise<IstreamInfos | undefined> {
    console.log(log.whereIam());
    const stream: _STREAM = input["Datastream"] ? "Datastream" : input["MultiDatastream"] ? "MultiDatastream" : undefined;
    if (!stream) return undefined;
    const streamEntity = models.getEntityName(service, stream); 
    if (!streamEntity) return undefined;
    const foiId: bigint | undefined = input["FeaturesOfInterest"] ? input["FeaturesOfInterest"] : undefined;
    const searchKey = input[models.DBFull(service)[streamEntity].name] || input[models.DBFull(service)[streamEntity].singular];
    const streamId: string | undefined = isNaN(searchKey) ? searchKey[EConstant.id] : searchKey;
    if (streamId) {
      const query = `SELECT "id", "observationType", "_default_featureofinterest" FROM ${doubleQuotesString(models.DBFull(service)[streamEntity].table)} WHERE "id" = ${BigInt(streamId)} LIMIT 1`;
      return config.executeSqlValues(service, asJson({ query: query, singular: true, strip: false, count: false }))
        .then((res: object) => {        
          return res ? {
            type: stream,
            id: res[0 as keyof object]["id"],
            observationType: res[0 as keyof object]["observationType"],
            FoId: foiId ? foiId : res[0 as keyof object]["_default_featureofinterest"],
          } : undefined;
        })
        .catch((error) => {
          console.log(error);
          return undefined;
        });
    }
  }

  private version0_9(): Ientities {
    return  {
      Files: FILE,
      Lines: LINE,
      CreateFile: CREATEFILE,
    };
  }

  private version1_0(): Ientities {
    return {
      Things: THING,
      FeaturesOfInterest: FEATUREOFINTEREST,
      Locations: LOCATION,
      ThingsLocations: THINGLOCATION,
      HistoricalLocations: HISTORICALLOCATION,
      LocationsHistoricalLocations: LOCATIONHISTORICALLOCATION,
      ObservedProperties: OBSERVEDPROPERTY,
      Sensors: SENSOR,
      Datastreams: DATASTREAM,
      MultiDatastreams: MULTIDATASTREAM,
      MultiDatastreamObservedProperties: MULTIDATASTREAMOBSERVEDPROPERTY,
      Observations: OBSERVATION,      
      Decoders: DECODER,
      Loras: LORA,
      Logs: LOG,
      Users: USER,
      Services: SERVICE,
      CreateObservations: CREATEOBSERVATION,
    }
  }
  
  private version1_1(input: Ientities): Ientities {
    // add properties to entities
    ["Locations", "FeaturesOfInterest", "ObservedProperties", "Sensors", "Datastreams", "MultiDatastreams"]
      .forEach((entityName: string) => { input[entityName].columns["properties"] =  new Jsonb().type() });
    // add geom to Location
    input.Locations.columns["geom"] =  new Geometry().type();
    return input;
  }

  private createVersion(verStr: string): boolean {
    console.log(log.whereIam(verStr));
    switch (verStr) {
      case "v0.9":        
        Models.models["v0.9"] = this.version0_9();         
      case "v1.1":          
      this.createVersion("v1.0");
      Models.models["v1.1"] = this.version1_1(deepClone(Models.models["v1.0"]));
      default:         
        Models.models["v1.0"] = this.version1_0();
    }
    return this.testVersion(verStr);
  }
  
  public listVersion() {
    return ["v0.9","v1.0","v1.1"]
  }

  private filtering(service: Iservice) {    
    return Object.fromEntries(Object.entries(Models.models[service.apiVersion]).filter(([, v]) => Object.keys(filterEntities(service.extensions)).includes(v.name))) as Ientities;
  }
  
  public filtered(service: Iservice): Ientities {
    if (this.testVersion(service.apiVersion) === false) this.createVersion(service.apiVersion);
    return service.name === EConstant.admin ? this.DBAdmin(service) : this.filtering(service);
  }
  
  public get(service: Iservice | string): Iservice {    
    if (typeof service === "string") {
      const nameConfig = config.getConfigNameFromName(service);
      if (!nameConfig) throw new Error(errors.configName);
      if (this.testVersion(config.getService(nameConfig).apiVersion) === false) this.createVersion(config.getService(nameConfig).apiVersion);
      return config.getService(nameConfig);
    }
    return service;
  }

  public getStats(service: Iservice | string): string {
    service = this.get(service);    
    const a = this.filtered(service);
    const b = Object.keys(a).filter(e => a[e].type === ETable.table).map(e => a[e].name === "Users" 
      ? `(SELECT JSON_AGG(u) AS mario FROM ( select username, "canPost", "canDelete", "canCreateUser", "canCreateDb", "admin", "superAdmin" FROM public.user WHERE username <> 'postgres' ORDER By username ) as u) AS "Users"`
      : `(SELECT COUNT('${a[e].orderBy.split(" ")[0]}') FROM "${a[e].table}") AS "${a[e].name}"\n`)
    return ` SELECT JSON_AGG(t) AS results FROM ( SELECT ${b.join()}) AS t`;
  }

  public DBFullCreate(service: Iservice | string): Ientities {
    service = this.get(service);
    
    const  name = service.options.includes(EOptions.unique)
      ?  new Text().notNull().default(info.noName).unique().type()
      : new Text().notNull().type();
      
    const description = service.options.includes(EOptions.unique)
      ?  new Text().notNull().default(info.noName).unique().type()
      : new Text().notNull().type();

      const s = Models.models[service.apiVersion];
      Object.keys(s).forEach((k: string) => {
        if (s[k].columns["name"]) s[k].columns.name = name;
        if (s[k].columns["description"]) s[k].columns.name = description;
      });
    return Models.models[service.apiVersion];
  }

  public DBFull(service: Iservice | string): Ientities {
    return Models.models[this.get(service).apiVersion];
  }
  
  public DBAdmin(service: Iservice ):Ientities {
    const entities = Models.models["v1.0"];
    return Object.fromEntries(Object.entries(entities)) as Ientities;
  } 

  public isSingular(service: Iservice, input: string): boolean { 
    if (config && input) {
      const entityName = this.getEntityName(service, input); 
      return entityName ? Models.models[service.apiVersion][entityName].singular == input : false; 
    }          
    return false;
  }

  public getEntityName(service: Iservice, search: string): string | undefined {
    if (config && search) {        
      const tempModel = Models.models[service.apiVersion];
      const testString: string | undefined = search.trim().match(/[a-zA-Z_]/g)?.join("");
      return tempModel && testString
          ? tempModel.hasOwnProperty(testString)
          ? testString
          : Object.keys(tempModel).filter((elem: string) => tempModel[elem].table == testString.toLowerCase() || tempModel[elem].singular == testString )[0]
          : undefined;
    }
  }

  public getEntityStrict = (service: Iservice, entity: Ientity | string): Ientity | undefined => {
    return (typeof entity === "string") ? Models.models[service.apiVersion][entity] : Models.models[service.apiVersion][entity.name];
  }

  public getEntity = (service: Iservice, entity: Ientity | string): Ientity | undefined => {
    if (config && entity) {
      if (isString(entity)) {
        const entityName = this.getEntityName(service, entity.trim());
        if (!entityName) return;
        entity = entityName;
      }
      
      return isString(entity) 
        ? Models.models[service.apiVersion][entity] 
        : Models.models[service.apiVersion][entity.name];
    }
  };

  public getRelationName = (entity: Ientity, searchs: string[]): string | undefined => {
    let res: string | undefined = undefined;    
    searchs.forEach(e => {
        if (entity.relations[e]) {
            res = e;
            return;
        }
    });
    return res;
  }
  
  public getRelation = (service: Iservice, entity: Ientity, relation: Ientity | string): IentityRelation | undefined => {
    const entityRelation = this.getEntity(service, relation);
    return entityRelation ? entity.relations[entityRelation.name] ||  entity.relations[entityRelation.singular] : undefined;
  };
  
  public getRelationColumnTable = (service: Iservice, entity: Ientity | string, test: string): EColumnType | undefined => {
    if (config && entity) {
      const tempEntity = this.getEntity(service, entity);
      if (tempEntity)
          return tempEntity.relations.hasOwnProperty(test)
            ? EColumnType.Relation
            : tempEntity.columns.hasOwnProperty(test)
                ? EColumnType.Column
                : undefined;
    }      
  };

  public getSelectColumnList(service: Iservice, entity: Ientity | string, complete: boolean,  exclus?: string[]) {
      const tempEntity = this.getEntity(service, entity);
      exclus = exclus || [""];
      return tempEntity 
        ? Object.keys(tempEntity.columns).filter((word) => !word.includes("_") && !exclus.includes(word)).map((e: string) => complete 
          ? formatPgTableColumn(tempEntity.table, e) : doubleQuotesString(e))
          : [];
  }
  
  public isColumnType(service: Iservice, entity: Ientity | string, column: string, test: string): boolean {
    if (config && entity) {
      const tempEntity = this.getEntity(service, entity);
      return tempEntity && tempEntity.columns[column] ? (getColumnType(tempEntity.columns[column]) === test.toLowerCase()) : false;
    }
    return false;
  }

  public getRoot(ctx: koaContext) {
    console.log(log.whereIam());
    let expectedResponse: object[] = [];    
    Object.keys(ctx.model)
    .filter((elem: string) => ctx.model[elem].order > 0)
    .sort((a, b) => (ctx.model[a].order > ctx.model[b].order ? 1 : -1))
    .forEach((value: string) => {
        expectedResponse.push({
          name: ctx.model[value].name,
          url: `${ctx.decodedUrl.linkbase}/${ctx.service.apiVersion}/${value}`,
        });
      });
    
    switch (ctx.service.apiVersion) {
      case "v0.9":
      case "v1.0":
        return {
          value : expectedResponse.filter((elem) => Object.keys(elem).length)
        };    
      case "v1.1":
        expectedResponse = expectedResponse.filter((elem) => Object.keys(elem).length); 
        // base   
        const list:string[] = [
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
        "https://datatracker.ietf.org/doc/html/rfc4180"];
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
        if (ctx.service.extensions.includes(EExtensions.mqtt)) list.push("https://docs.ogc.org/is/18-088/18-088.html#req-create-observations-via-mqtt-observations-creation",
                                                                        "https://docs.ogc.org/is/18-088/18-088.html#mqtt-extension");
        const temp: Record<string, any>  =  {
          "value" : expectedResponse.filter((elem) => Object.keys(elem).length),
          "serverSettings" : {
            "conformance" : list,
          }
        };
        if (ctx.service.extensions.includes(EExtensions.logs)) list.push(`${ctx.decodedUrl.origin}/#api-Logs`);
        list.push(`${ctx.decodedUrl.origin}/#api-Services`);
        list.push(`${ctx.decodedUrl.origin}/#api-Token`);
        list.push(`${ctx.decodedUrl.origin}/#api-Import`);
        list.push(`${ctx.decodedUrl.origin}/#api-Format`);        
        temp[`${ctx.decodedUrl.linkbase}/${ctx.service.apiVersion}/req/receive-updates-via-mqtt/receive-updates`] = 
        {
          "endpoints": [
            `mqtt://server.example.com:${config.getService(EConstant.admin).ports?.ws}`,
            "ws://server.example.com/sensorThings",
          ]
        }
        return temp;
        default:
          break;
      }
  }

  public init() {
    if (isTest()) this.createVersion("v1.1");
  }
}

export const models = new Models();
