import { serverConfig } from "../configuration";
import { ADMIN, TEST } from "../constants";
import { log } from "../log";
import { _STREAM } from "../db/constants";
import { executeSqlValues } from "../db/helpers";
import { asJson } from "../db/queries";
import { EColumnType, EExtensions, EVersion, filterEntities } from "../enums";
import { addDoubleQuotes, deepClone, isTest } from "../helpers";
import { errors, msg } from "../messages";
import { IconfigFile, Ientities, Ientity, IstreamInfos, koaContext } from "../types";
import fs from "fs";
import conformance from "./conformance.json";
import { FeatureOfInterest, Thing, Location, Config, CreateFile, CreateObservation, Datastream, Decoder, HistoricalLocation, HistoricalObservation, Log, Lora, MultiDatastream, MultiDatastreamObservedProperty, Observation, Sensor, User, LocationHistoricalLocation, ObservedProperty, ThingLocation } from "./entities";

const testVersion = (input: string) => Object.keys(Models.models).includes(input);

class Models {
  static models : { [key: string]: Ientities; } = {};
  // Create Object FOR v1.0
  constructor() { 
      Models.models[EVersion.v1_0] = {
          Things: Thing,        
          FeaturesOfInterest: FeatureOfInterest,        
          Locations: Location,        
          HistoricalLocations: HistoricalLocation,        
          locationsHistoricalLocations: LocationHistoricalLocation,        
          ObservedProperties: ObservedProperty,        
          Sensors: Sensor,        
          Datastreams: Datastream,        
          MultiDatastreams: MultiDatastream,        
          MultiDatastreamObservedProperties: MultiDatastreamObservedProperty,        
          Observations: Observation,        
          HistoricalObservations: HistoricalObservation,        
          ThingsLocations: ThingLocation,        
          Decoders: Decoder,        
          Loras: Lora,        
          Logs: Log,        
          Users: User,        
          Configs: Config,        
          CreateObservations: CreateObservation,        
          CreateFile: CreateFile,
      };                
  }

  escape(input: string, ignore?: string) {
    let pattern = "";
    const map = {
        '>': '&gt;'
      , '<': '&lt;'
      , "'": '&apos;'
      , '"': '&quot;'
      , '&': '&amp;'
    };
  
    if (input === null || input === undefined) return;
  
    ignore = (ignore || '').replace(/[^&"<>\']/g, '');
    pattern = '([&"<>\'])'.replace(new RegExp('[' + ignore + ']', 'g'), '');
  
    return input.replace(new RegExp(pattern, 'g'), function(str, item) {
      return map[item as keyof object];
    });
  }

  // create drawIO Model
  getDraw(ctx: koaContext) {
    const deleteId = (id: string) => {
      const start = `<mxCell id="${id}"`;
      const end = "</mxCell>";
      fileContent = fileContent.replace(`${start}${fileContent.split(start)[1].split(end)[0]}${end}`, "");      
    };
    const entities = Models.models[ctx.config.apiVersion];
    let fileContent = fs.readFileSync(__dirname + `/model.drawio`, "utf8");
    fileContent = fileContent.replace('&gt;Version&lt;', `&gt;version : ${ctx.config.apiVersion}&lt;`);
    if (!ctx.config.extensions.includes(EExtensions.logs)) deleteId("124");
    if (!ctx.config.extensions.includes(EExtensions.multiDatastream)) {
      ["114" ,"115" ,"117" ,"118" ,"119" ,"116" ,"120" ,"121"].forEach(e => deleteId(e));
      fileContent = fileContent.replace(`&lt;hr&gt;COLUMNS.${entities.MultiDatastreams.name}`, "");
      fileContent = fileContent.replace(`&lt;hr&gt;COLUMNS.${entities.MultiDatastreams.name}`, "");
      fileContent = fileContent.replace(`&lt;strong&gt;${entities.MultiDatastreams.singular}&lt;/strong&gt;`, "");
    }
    Object.keys(entities).forEach((strEntity: string) => {
      fileContent = fileContent.replace(`COLUMNS.${entities[strEntity].name}`, this.getColumnListNameWithoutId(entities[strEntity]).map((colName: string) => `&lt;p style=&quot;margin: 0px; margin-left: 8px;&quot;&gt;${colName}: ${entities[strEntity].columns[colName].type.toUpperCase()}&lt;/p&gt;`).join(""));
    });

    return fileContent;
  }
  
  async getInfos(ctx: koaContext) {
    const temp = serverConfig.getInfos(ctx, ctx.config.name)
    const result: Record<string, any> = {
      ... temp,
      ready : ctx.config._connection ? true : false,
      Postgres: {}
    };
    const extensions: Record<string, any> = {};
    switch (ctx.config.apiVersion) {
      case EVersion.v1_1:
          result["Ogc link"] = "https://docs.ogc.org/is/18-088/18-088.html";
        break;
        default:
          result["Ogc link"] = "https://docs.ogc.org/is/15-078r6/15-078r6.html";
        break;
    }
    if (ctx.config.extensions.includes(EExtensions.tasking)) extensions["tasking"] = "https://docs.ogc.org/is/17-079r1/17-079r1.html";
    if (ctx.config.extensions.includes(EExtensions.logs)) extensions["logs"] = `${ctx.decodedUrl.linkbase}/${ctx.config.apiVersion}/Logs`;
    
    result["extensions"] = extensions;
    result["options"] = ctx.config.options;
    await executeSqlValues(ctx.config, `
    select version(), 
    (SELECT ARRAY(SELECT extname||'-'||extversion AS extension FROM pg_extension) AS extension),
    (SELECT c.relname||'.'||a.attname FROM pg_attribute a JOIN pg_class c ON (a.attrelid=c.relfilenode) WHERE a.atttypid = 114)
    ;`
    ).then(res => {
      result["Postgres"]["version"] = res[0 as keyof object];
      result["Postgres"]["extensions"] = res[1 as keyof object];
    });


    return result;
  }
    // Get multiDatastream or Datastrems infos in one function
  public async getStreamInfos(config: IconfigFile, input: Record<string, any> ): Promise<IstreamInfos | undefined> {
    const stream: _STREAM = input["Datastream"] ? "Datastream" : input["MultiDatastream"] ? "MultiDatastream" : undefined;
    if (!stream) return undefined;
    const streamEntity = models.getEntityName(config, stream); 
    if (!streamEntity) return undefined;
    const foiId: bigint | undefined = input["FeaturesOfInterest"] ? input["FeaturesOfInterest"] : undefined;
    const searchKey = input[models.DBFull(config)[streamEntity].name] || input[models.DBFull(config)[streamEntity].singular];
    const streamId: string | undefined = isNaN(searchKey) ? searchKey["@iot.id"] : searchKey;
    if (streamId) {
      const query = `SELECT "id", "observationType", "_default_foi" FROM ${addDoubleQuotes(models.DBFull(config)[streamEntity].table)} WHERE id = ${BigInt(streamId)} LIMIT 1`;
      return executeSqlValues(config, asJson({ query: query, singular: true, strip: false, count: false }))
        .then((res: object) => {        
          return res ? {
            type: stream,
            id: res[0 as keyof object]["id"],
            observationType: res[0 as keyof object]["observationType"],
            FoId: foiId ? foiId : res[0 as keyof object]["_default_foi"],
          } : undefined;
        })
        .catch((error) => {
          console.log(error);
          return undefined;
        });
    }
  }

  private version1_1(input: Ientities): Ientities {
    const makeJson = (name:string) => {
      return {
        create : "jsonb NULL",
        alias() {
          return `"${name}"`;
        },
        type: "json"
      };
    };

    ["Things", "Locations", "FeaturesOfInterest", "ObservedProperties", "Sensors", "Datastreams", "MultiDatastreams"]
      .forEach((e: string) => { input[e].columns["properties"] = makeJson("properties"); });
  
    input.Locations.columns["geom"] = {
      create: "geometry NULL",
      alias() {
        return `"geom"`;
      },
      type: "json",
    };
    return input;
  }
  
  public isVersionExist(nb: string): boolean{
    if (testVersion(nb) === true) return true;
    if (this.createVersion(nb) === true ) return true;
    throw new Error(msg(errors.wrongVersion, nb));      
  }

  public createVersion(nb: string): boolean{
    switch (nb) {
      case "1.1":          
      case "v1.1":          
      case EVersion.v1_1:          
        Models.models[EVersion.v1_1] = this.version1_1(deepClone(Models.models[EVersion.v1_0]));
    } 
    return testVersion(nb);
  }
  
  private filtering(config: IconfigFile) {    
    return Object.fromEntries(Object.entries(Models.models[config.apiVersion]).filter(([, v]) => Object.keys(filterEntities(config.extensions)).includes(v.name))) as Ientities;
  }

  public version(config: IconfigFile): string {
    if (config && config.apiVersion && testVersion(config.apiVersion)) return config.apiVersion;
    throw new Error(msg(errors.wrongVersion, config.apiVersion));
  }

  public filteredModelFromConfig(config: IconfigFile, ): Ientities {
    if (testVersion(config.apiVersion) === false) this.createVersion(config.apiVersion);
    return config.name === ADMIN ? this.DBAdmin(config) : this.filtering(config);
  }
  
  public DBFull(config: IconfigFile | string): Ientities {
    if (typeof config === "string") {
      const nameConfig = serverConfig.getConfigNameFromName(config);
      if (!nameConfig) throw new Error(errors.configName);
      if (testVersion(serverConfig.getConfig(nameConfig).apiVersion) === false) this.createVersion(serverConfig.getConfig(nameConfig).apiVersion);
      config = serverConfig.getConfig(nameConfig);
    }  
    return Models.models[config.apiVersion];
  }
  
  public DBAdmin(config: IconfigFile):Ientities {
    const entities = Models.models[EVersion.v1_0];
    return Object.fromEntries(Object.entries(entities)) as Ientities;

    // return Object.fromEntries(Object.entries( Models.models[EVersion.v1_0]));
  } 

  public isSingular(config: IconfigFile, input: string): boolean { 
    if (config && input) {
      const entityName = this.getEntityName(config, input); 
      return entityName ? Models.models[config.apiVersion][entityName].singular == input : false; 
    }          
    return false;
  }

  public getEntityName(config: IconfigFile, search: string): string | undefined {
    if (config && search) {        
      const tempModel = Models.models[config.apiVersion];
      const testString: string | undefined = search
          .trim()
          .match(/[a-zA-Z_]/g)
          ?.join("");

      return tempModel && testString
          ? tempModel.hasOwnProperty(testString)
          ? testString
          : Object.keys(tempModel).filter(
              (elem: string) =>
              tempModel[elem].table == testString.toLowerCase() ||
              tempModel[elem].singular == testString
              )[0]
          : undefined;
    }
  }

  public getEntity = (config: IconfigFile, entity: Ientity | string): Ientity | undefined => {
    if (config && entity) {
      if (typeof entity === "string") {
        const entityName = this.getEntityName(config, entity.trim());
        if (!entityName) return;
        entity = entityName;
      } 
      return (typeof entity === "string") ? Models.models[config.apiVersion][entity] : Models.models[config.apiVersion][entity.name];
    }
  };
  
  public getRelationColumnTable = (config: IconfigFile, entity: Ientity | string, test: string): EColumnType | undefined => {
    if (config && entity) {
      const tempEntity = this.getEntity(config, entity);
      if (tempEntity)
          return tempEntity.relations.hasOwnProperty(test)
          ? EColumnType.Relation
          : tempEntity.columns.hasOwnProperty(test)
              ? EColumnType.Column
              : undefined;
          // return tempEntity.columns.hasOwnProperty(test)
          // ? EColumnType.Column
          // : tempEntity.columns.hasOwnProperty(test)
          //     ? EColumnType.Relation
          //     : undefined;
    }      
  };

  public getSelectColumnList(input: Ientity) {
      return Object.keys(input.columns).filter((word) => !word.includes("_")).map((e: string) => `${addDoubleQuotes(input.table)}.${addDoubleQuotes(e)}`);
  }

  getColumnListNameWithoutId(input: Ientity) {
    return Object.keys(input.columns).filter((word) => !word.includes("_") && !word.includes("id")); 
  }

  public isColumnType(config: IconfigFile, entity: Ientity | string, column: string , test: string): boolean {
    if (config && entity) {
      const tempEntity = this.getEntity(config, entity);
      return tempEntity && tempEntity.columns[column] ? (tempEntity.columns[column].type.toLowerCase() === test.toLowerCase()) : false;
    }
    return false;
  }

  public getRoot(ctx: koaContext) {
    console.log(log.whereIam());
    let expectedResponse: object[] = [];
    Object. keys(ctx.model)
    .filter((elem: string) => ctx.model[elem].order > 0)
    .sort((a, b) => (ctx.model[a].order > ctx.model[b].order ? 1 : -1))
    .forEach((value: string) => {
        expectedResponse.push({
          name: ctx.model[value].name,
          url: `${ctx.decodedUrl.linkbase}/${ctx.config.apiVersion}/${value}`,
        });
      });
    
    switch (ctx.config.apiVersion) {
      case EVersion.v1_0:
        return {
          value : expectedResponse.filter((elem) => Object.keys(elem).length)
        };    
      case EVersion.v1_1:
        expectedResponse = expectedResponse.filter((elem) => Object.keys(elem).length);    
        const list:string[] = [];
        list.push(conformance["1.1"].root);
        list.push("https://docs.ogc.org/is/18-088/18-088.html#uri-components");
        list.push("https://docs.ogc.org/is/18-088/18-088.html#resource-path");
        list.push("https://docs.ogc.org/is/18-088/18-088.html#requesting-data");
        list.push("https://docs.ogc.org/is/18-088/18-088.html#create-update-delete");
        // conformance.push("https://docs.ogc.org/is/18-088/18-088.html#batch-requests");




        list.push(`"http://www.opengis.net/spec/iot_sensing/1.1/req/receive-updates-via-mqtt/receive-updates": { "endpoints": [ "mqtt://server.example.com:1833", "ws://server.example.com/sensorThings", ]`);







        if (ctx.config.extensions.includes(EExtensions.multiDatastream)) list.push("https://docs.ogc.org/is/18-088/18-088.html#multidatastream-extension");
        if (ctx.config.extensions.includes(EExtensions.mqtt)) list.push("https://docs.ogc.org/is/18-088/18-088.html#create-observation-dataarray");
        // conformance.push("https://docs.ogc.org/is/18-088/18-088.html#mqtt-extension");
        list.push("http://docs.oasis-open.org/odata/odata-json-format/v4.01/odata-json-format-v4.01.html");
        list.push("https://datatracker.ietf.org/doc/html/rfc4180");
        const temp: Record<string, any>  =  {
          "value" : expectedResponse.filter((elem) => Object.keys(elem).length),
          "serverSettings" : {
            "conformance" : list,
          }
        };
        
        temp[`${ctx.decodedUrl.linkbase}/${ctx.config.apiVersion}/req/receive-updates-via-mqtt/receive-updates`] = 
        {
          "endpoints": [
            "mqtt://server.example.com:1833",
            "ws://server.example.com/sensorThings",
          ]
        }
        return temp;
        
        default:
          break;
      }
  }

  public init() {    
    if (isTest()) {      
      this.createVersion(serverConfig.getConfig(TEST).apiVersion);
    }
  }
}

export const models = new Models();
