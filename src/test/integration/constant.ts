/**
 * Constant for TDD
 *
 * @copyright 2020-present Inrae
 * @review 29-10-2024
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Constant for TDD -----------------------------------!");

import fs from "fs";
import path from "path";
import { TEST } from "../../server/constants";
import { Ientity } from "../../server/types";
import util from "util";
import apidocJson from "../apidoc.json";
import { models } from "../../server/models";
let NB = 0;
export const nbAdd = () => {return `${++NB}`};
export const identification = { "username": "stean", "password": "stean" };
export const testVersion = "v1.1";
let nb = 0;
export function getNB(message: string): string {nb +=1; return `${message} ${String(nb)}`;} 
export const _RAWDB = models.DBFull(TEST);
export const nbColor = "\x1b[36m";
export const nbColorTitle = "\x1b[35m";
export const testLog = (input: any) => {
    process.stdout.write(util.inspect(input, { showHidden: false, depth: null, colors: false, }));
}
export const proxy = (moi: boolean) => moi !== true ? 'http://localhost:8029/test' : `${apidocJson.proxy}/`;
import packageJson from "../../../package.json";
export const VERSION = packageJson.version;

const createJSON = (data: any) => JSON.stringify(data, null, 4).replace(/[\n]+/g, "|\t");

export interface Iinfos {
    api: string;
    apiName: string;
    apiPermission?: string;
    apiDescription: string;
    apiReference?: string;
    apiExample: {[key: string]: string};
    apiSuccess?: string[];
    apiParam?: string[];
    apiParamExample?: Record<string, any>;
}

export const keyTokenName = "jwt-session";
export interface IApiInput {
    api: string;
    apiName: string;
    apiDescription: string;
    apiReference?: string;
    apiPermission?: string;
    apiExample?: {[key: string]: string};
    apiError?: string[];
    apiParam?: string[];
    apiSuccess?: string[];
    apiParamExample?: Record<string, any>;
    result: any;
}

export const defaultPostPatch = (lang: string, method: string, request: string, data: any): string => {
    switch (lang.toUpperCase()) {
        case "CURL":
            return `curl -X ${method.toUpperCase()} -H 'Content-Type: application/json' -d '${createJSON(data)}}' proxy${request}`;
        case "JAVASCRIPT":
            return `const response = await fetch("proxy${request}", {|\tmethod: "${method.toUpperCase()}",|\theaders: {|\t    "Content-Type": "application/json",|\t},|\tbody:${createJSON(
                data
            )}|});|const valueJson = await response.json();|const valueTxt = await response.text();`;
        case "PYTHON":
            return `import requests|import json|response_API = requests.${method}('proxy${request}', (headers = { "Content-Type": "application/json" }), (data = :${createJSON(
                data
            )}))|data = response_API.text|parse_json = json.loads(data)|print(parse_json)`;
    }
    return "";
};

export const defaultPost = (lang: string, request: string, data: any): string => {
    return defaultPostPatch(lang, "post", request, data);
};

export const defaultPatch = (lang: string, request: string, data: any): string => {
    return defaultPostPatch(lang, "patch", request, data);
};

export const defaultDelete = (lang: string, request: string): string => {
    switch (lang.toUpperCase()) {
        case "CURL":
            return `curl -DELETE "proxy${request}"`;
        case "JAVASCRIPT":
            return `const response = await fetch("proxy${request}", {|\tmethod: "DELETE"|});|const valueJson = await response.json();|const valueTxt = await response.text();`;
        case "PYTHON":
            return `import requests|import json|response_API = requests.delete('proxy${request}')|data = response_API.text|parse_json = json.loads(data)|print(parse_json)`;
    }
    return "";
};

export const defaultGet = (lang: string, request: string): string => {
    switch (lang.toUpperCase()) {
        case "CURL":
            return `curl -GET "proxy${request}"`;
        case "JAVASCRIPT":
            return `const response = await fetch("proxy${request}", {|\tmethod: "GET",|\theaders: {|\t    "Content-Type": "application/json",|\t},|});|const valueJson = await response.json();|const valueTxt = await response.text();`;
        case "PYTHON":
            return `import requests|import json|response_API = requests.get('proxy${request}')|data = response_API.text|parse_json = json.loads(data)|print(parse_json)`;
    }
    return "";
};

export interface IApiDoc {
    api: string;
    apiDescription: string;
    apiVersion: string;
    apiName: string;
    apiGroup: string;
    apiParam?: string[];
    apiError?: string[];
    apiSuccess?: string[];
    apiExample?: {[key: string]: string};
    apiParamExample?: string;
    apiSuccessExample?: string;
    apiErrorExample?: string;
    apiUse?: string;
    apiPermission?: string;
    text?: string;
    apiSampleRequest?: string;
}

const _HEADERS: { [key: string]: string } = {
    apiParamExample: "{json} Request-Example:",
    apiSuccessExample: "{json} Success-Response:",
    apiErrorExample: "{json} Error-Response:"
};

export const prepareToApiDoc = (input: IApiInput, Entity: string): IApiDoc => {
    return {
        api: input.api,
        apiVersion: "1.1.0",
        apiName: input.apiName,
        apiPermission: input.apiPermission,
        apiGroup: Entity,
        apiDescription: `${input.apiDescription} ${input.apiReference ? ` <a href="${input.apiReference}" target="_blank">[${input.apiReference.includes("docs.ogc.org") ? "OGC " : ""}reference]</a>` : ""}`,
        apiExample: input.apiExample,
        apiError: input.apiError,
        apiParam: input.apiParam,
        apiSuccess: input.apiSuccess,
        apiParamExample: input.apiParamExample ? JSON.stringify(input.apiParamExample, null, 4) : undefined,
        apiSampleRequest: input.api.startsWith("{get}") && input.apiExample ? `proxy${input.apiExample.http}` : "",
        apiSuccessExample:
            input.result.type === "text/plain" || input.result.type === "text/csv"
                ? input.result.text
                : input.result && input.result.body
                ? JSON.stringify(input.result.body, null, 4)
                : undefined
    };    
};

export const generateApiDoc = (input: IApiDoc[], filename: string): boolean => {
    const createExamplesLines = (input: string) => {
        const tempLines = input.split("|");
        tempLines.forEach((elemTemp: string) => {
            lines.push(`*          ${elemTemp.replace(/[\t]+/g, "   ")}`);
        });
    };
    const proxy = apidocJson.proxy + "/";

    const lines: string[] = [];

    lines.push("/**");
    lines.push("* @apiDefine admin:computer User access only");
    lines.push("* This optional description belong to to the group admin.");
    lines.push("*/");
    lines.push("");

    input.forEach((element: IApiDoc) => {
        lines.push("/**");
        for (const [key, value] of Object.entries(element)) {
            if (key === "apiSuccess" && value) {
                value.forEach((tab: string) => {
                    lines.push(`*    @apiSuccess ${tab}`);
                });
            } else if (key === "apiParam" && value) {
                value.forEach((tab: string) => {
                    lines.push(`*    @apiParam ${tab}`);
                });
            } else if (key === "apiPermission " && value) {
                lines.push(`*    @apiPermission value`);
            } else if (key === "apiExample" && value) {
                Object.keys(value).forEach((elem: string) => {
                    lines.push(`*    @${key} {${elem}} ${elem}`);
                    switch (elem) {
                        case "http":
                            createExamplesLines(`${proxy}${value[elem]}`);
                            break;
                        case "curl":
                        case "javascript":
                        case "python":
                            createExamplesLines(value[elem].replace("KEYHTTP", value.http).replace("proxy", proxy).replace("KEYDATA", element.apiParamExample));
                            break;
                    }
                });
            } else if (key === "apiError" && value) {
                value.forEach((tab: string) => {
                    lines.push(`*    @apiError ${tab}`);
                });
            } else if (Object.keys(_HEADERS).includes(key) && value) {
                lines.push(`*    @${key} ${_HEADERS[key]}`);
                const successLines: string[] = value.split("\n");
                successLines.forEach((successLine: string) => {
                    lines.push(`*    ${successLine}`);
                });
            } else if (value) {
                lines.push(`*    @${key} ${value}`);
            }
        }

        lines.push("*/\n");
    });
    lines.forEach((element, index) => {
        lines[index] = element.replace("proxy", proxy);
    });
    filename = "../apiDocs/" + filename;
    fs.writeFileSync(path.resolve(__dirname, filename), `${lines.join("\n")}`, {
        encoding: "utf-8"
    });

    return true;
};

export const limitResult = (input: Record<string, any>, keyName?: string) => {  
    const key:string = keyName || "value";
    if (input["body"][key]) input["body"][key] = [input["body"][key][0], input["body"][key][1], "..."];
    return input;
};

const definitions = {
    properties : "A JSON Object containing user-annotated properties as key-value pairs.",
    id : "Is the system-generated identifier of an entity. id is unique among the entities of the same entity type in a SensorThings service.",
    selfLink : "selfLink is the absolute URL of an entity that is unique among all other entities.",
    navigationLink : "navigationLink is the relative or absolute URL that retrieves content of related entities."
    
};

const types = {
    id : "BigInt"
};
export const infos: Record<string, any>  = {
    Things: {
        definition: "A Thing is an object of the physical world (physical Things) or the information world (virtual Things) that is capable of being identified and integrated into communication networks<br>Thing is a good starting point to start creating the SensorThings model structure.<br><br>A Thing has Locations and one or more Datastreams to collect Observations. A minimal Thing can be created without a Location and Datastream and there are options to create a Things with a nested linked Location and Datastream.",
        reference: "https://docs.ogc.org/is/18-088/18-088.html#thing",
        columns: {
            id: definitions.id,
            name: "A property provides a label for Thing entity, commonly a descriptive name.",
            description: "This is a short description of the corresponding Thing entity.",
            properties: definitions.properties,
        },
        type: {
            id: types.id,
            name: "CharacterString",
            description: "CharacterString",
            properties: "JSON Object",
            Locations: "Many optional to many optional",
            HistoricalLocations: "One mandatory to many optional",
            Datastreams: "One mandatory to many optional",
            MultiDatastreams: "One mandatory to many optional",
        },
        relations: {
            Locations: "The Location entity locates the Thing. Multiple Things MAY be located at the same Location. A Thing MAY not have a Location. A Thing SHOULD have only one Location.</br> However, in some complex use cases, a Thing MAY have more than one Location representations. In such case, the Thing MAY have more than one Locations. These Locations SHALL have different encodingTypes and the encodingTypes SHOULD be in different spaces (e.g., one encodingType in Geometrical space and one encodingType in Topological space). ",
            HistoricalLocations: "A Thing has zero-to-many HistoricalLocations. A HistoricalLocation has one-and-only-one Thing.",
            Datastreams: "A Thing MAY have zero-to-many Datastreams.",
            MultiDatastreams: "A Thing MAY have zero-to-many MultiDatastreams."
        }
    },

    FeaturesOfInterest: {
        definition: "An Observation results in a value being assigned to a phenomenon. The phenomenon is a property of a feature, the latter being the FeatureOfInterest of the Observation [OGC and ISO 19156:2011]. In the context of the Internet of Things, many Observations’ FeatureOfInterest can be the Location of the Thing. For example, the FeatureOfInterest of a wifi-connect thermostat can be the Location of the thermostat (i.e., the living room WHERE the thermostat is located in). In the case of remote sensing, the FeatureOfInterest can be the geographical area or volume that is being sensed.",
        reference: "https://docs.ogc.org/is/18-088/18-088.html#featureofinterest",
        columns: {
            id: definitions.id,
            name: "A property provides a label for FeatureOfInterest entity, commonly a descriptive name.",
            description: "The description about the FeatureOfInterest.",
            encodingType: "The encoding type of the feature property.</br>Its value is one of the ValueCode enumeration (see Table 7 for the available ValueCode).",
            feature: "The detailed description of the feature. The data type is defined by encodingType. ",
            properties: definitions.properties,
        },
        relations: {
            Observations: "An Observation observes on one-and-only-one FeatureOfInterest. One FeatureOfInterest could be observed by zero-to-many Observations.",
            Locations: "id",
        },
    },

    Locations: {
        definition: `The Location entity locates the Thing(s) it associated with.<br>A Thing’s Location entity is defined as the last known location of the Thing.<br>
        A Thing can have multiple Locations if all Locations are different representations of same Location with different encodingType`,
        reference: "https://docs.ogc.org/is/18-088/18-088.html#location",
        columns: {
            id: definitions.id,
            name: "A property provides a label for Location entity, commonly a descriptive name.",
            description: "The description about the Location.",
            encodingType: "The encoding type of the Location property. Its value is GeoJSON.",
            location: "The location type is defined by encodingType.",
            geom: "json",
            properties: definitions.properties
        },
        relations: {
            Things: "Multiple Things MAY locate at the same Location. A Thing MAY not have a Location.",
            HistoricalLocations: "A Location can have zero-to-many HistoricalLocations. One HistoricalLocation SHALL have one or many Locations.",
        }
    },

    HistoricalLocations: {
        definition: "A Thing’s HistoricalLocation entity set provides the times of the current (last known) and previous locations of the Thing.",
        reference: "https://docs.ogc.org/is/18-088/18-088.html#historicallocation",
        columns: {
            id: definitions.id,
            time: "The time when the Thing is known at the Location.",
        },
        relations: {
            Things:  "A HistoricalLocation has one-and-only-one Thing. One Thing MAY have zero-to-many HistoricalLocations.",
            Locations: "A Location can have zero-to-many HistoricalLocations. One HistoricalLocation SHALL have one or many Locations."
        }
    },

    LocationsHistoricalLocations: {
        name: "LocationsHistoricalLocations",
        singular: "LocationHistoricalLocation",
        table: "Locationhistoricallocation",
        order: -1,
        columns: {
            location_id: "BIGINT NOT NULL",
            historicallocation_id: "BIGINT NOT NULL"
        },
        relations: {}
    },

    ObservedProperties: {
        definition: "An ObservedProperty specifies the phenomenon of an Observation.",
        reference: "https://docs.ogc.org/is/18-088/18-088.html#observedproperty",
        columns: {
            id: definitions.id,
            name: "A property provides a label for ObservedProperty entity, commonly a descriptive name.",
            definition: "The URI of the ObservedProperty. Dereferencing this URI SHOULD result in a representation of the definition of the ObservedProperty.",
            description: "A description about the ObservedProperty.",
            properties: definitions.properties
        },
        relations: {
            Datastreams: "The Observations of a Datastream observe the same ObservedProperty. The Observations of different Datastreams MAY observe the same ObservedProperty.",
            MultiDatastreams: "The Observations of a MultiDatastreams observe the same ObservedProperty. The Observations of different MultiDatastreams MAY observe the same ObservedProperty."
        }
    },

    Sensors: {
        definition: "A Sensor is an instrument that observes a property or phenomenon with the goal of producing an estimate of the value of the property3.",
        reference: "https://docs.ogc.org/is/18-088/18-088.html#sensor",
        columns: {
            id: definitions.id,
            name: "A property provides a label for Sensor entity, commonly a descriptive name.",
            description: "The description of the Sensor entity.",
            encodingType: "The encoding type of the metadata property. Its value is one of the ValueCode enumeration (see Table 15 for the available ValueCode).",
            metadata: "The detailed description of the Sensor or system. The metadata type is defined by encodingType.",
            properties: definitions.properties,
        },
        relations: {
            Datastreams: "The Observations of a Datastream are measured with the same Sensor. One Sensor MAY produce zero-to-many Observations in different Datastreams.",
            MultiDatastreams: "The Observations of a MultiDatastreams are measured with the same Sensor. One Sensor MAY produce zero-to-many Observations in different MultiDatastreams."
        }
    },

    Datastreams: {
        definition: "A Datastream groups a collection of Observations measuring the same ObservedProperty and produced by the same Sensor.",
        reference: "https://docs.ogc.org/is/18-088/18-088.html#datastream",
        columns: {
            id: definitions.id,
            name: "A property provides a label for Datastream entity, commonly a descriptive name.",
            description: "The description of the Datastream entity.",
            observationType: "The type of Observation (with unique result type), which is used by the service to encode observations.",
            unitOfMeasurement: "A JSON Object containing three key-value pairs. The name property presents the full name of the unitOfMeasurement; the symbol property shows the textual form of the unit symbol; and the definition contains the URI defining the unitOfMeasurement.</br></br>The values of these properties SHOULD follow the Unified Code for Unit of Measure (UCUM)." ,
            observedArea: "The spatial bounding box of the spatial extent of all FeaturesOfInterest that belong to the Observations associated with this Datastream.",
            phenomenonTime: "The temporal interval of the phenomenon times of all observations belonging to this Datastream.",             
            resultTime: "The temporal interval of the result times of all observations belonging to this Datastream.",
            properties: definitions.properties
        },
        relations: {
            Thing:  "A Thing has zero-to-many Datastreams. A Datastream entity SHALL only link to a Thing as a collection of Observations.",
            Sensor: "The Observations in a Datastream are performed by one-and-only-one Sensor. One Sensor MAY produce zero-to-many Observations in different Datastreams.",
            ObservedProperty: "The Observations of a Datastream SHALL observe the same ObservedProperty. The Observations of different Datastreams MAY observe the same ObservedProperty.",
            Observations: "A Datastream has zero-to-many Observations. One Observation SHALL occur in one-and-only-one Datastream.",
            Loras: "The Lora of a Datastream SHALL Have only one."
        }
    },

    MultiDatastreams: {
        definition: `MultiDatastream entity is an extension to handle complex observations when the result is an array.<br><img src="./assets/multi.jpg" alt="MultiDatastream"></br>multi-datastream constraints</br></br>The size and the order of each element of a MultiDatastream’s unitOfMeasurements array (i.e., MultiDatastream(id)/unitOfMeasurements) SHALL match the size and the order of each element of the related ObservedProperties collection (i.e., MultiDatastreams(id)/ObservedProperties).</br></br>The size and the order of each element of a MultiDatastream’s unitOfMeasurements array (i.e., MultiDatastreams(id)/unitOfMeasurements) SHALL match the size and the order of each element of all related Observations’ result (i.e., MultiDatastreams(id)/Observations?$select=result).</br></br>The size and the order of each element of a MultiDatastream’s unitOfMeasurements array (i.e., MultiDatastreams(id)/unitOfMeasurements) SHALL match the size and the order of each element of the MultiDatastream’s multiObservationDataTypes array (i.e., MultiDatastreams(id)/multiObservationDataTypes).</br></br> When a complex result’s element does not have a unit of measurement (e.g., a OM_TruthObservation type), the corresponding unitOfMeasurement element SHALL have null values.`,
        reference: "https://docs.ogc.org/is/18-088/18-088.html#multidatastream-extension",
        columns: {
            id: definitions.id,
            name: "A property provides a label for Datastream entity, commonly a descriptive name.",
            description: "The description of the Datastream entity.",
            unitOfMeasurements: "A JSON array of JSON objects that containing three key-value pairs. The name property presents the full name of the unitOfMeasurement; the symbol property shows the textual form of the unit symbol; and the definition contains the URI defining the unitOfMeasurement. (see Req 42 for the constraints between unitOfMeasurement, multiObservationDataType and result).",
            observationType: "The type of Observation (with unique result type), which is used by the service to encode observations.",
            multiObservationDataTypes: "This property defines the observationType of each element of the result of a complex Observation.",
            observedArea: "The spatial bounding box of the spatial extent of all FeatureOfInterests that belong to the Observations associated with this MultiDatastream.",
            phenomenonTime: "The temporal interval of the phenomenon times of all observations belonging to this MultiDatastream.",
            resultTime: "The temporal interval of the result times of all observations belonging to this MultiDatastream.",
            properties: definitions.properties
        },
        relations: {
            Thing: "A Thing has zero-to-many MultiDatastream. A MultiDatastream entity SHALL only link to a Thing as a collection of Observations.",
            Sensor: "The Observations in a MultiDatastream are performed by one-and-only-one Sensor. One Sensor MAY produce zero-to-many Observations in different MultiDatastreams.",
            Observations: "A MultiDatastream has zero-to-many Observations. One Observation SHALL occur in one-and-only-one MultiDatastream.",
            ObservedProperties: "The Observations of a MultiDatastream SHALL observe the same ObservedProperties entity set.",
            Loras: "id"
        }
    },

    MultiDatastreamObservedProperties: {
        name: "MultiDatastreamObservedProperties",
        singular: "MultiDatastreamObservedProperty",
        table: "multidatastreamobservedproperty",
        order: -1,
        columns: {
            multidatastream_id: {
                create: "BIGINT NOT NULL"
            },
            observedproperty_id: {
                create: "BIGINT NOT NULL"
            }
        },
        admin: false,
        relations: {},
        constraints: {
            multidatastreamobservedproperty_pkey: 'PRIMARY KEY ("multidatastream_id", "observedproperty_id")',
            multidatastreamobservedproperty_multidatastream_id_fkey:
                'FOREIGN KEY ("multidatastream_id") REFERENCES "multidatastream"("id") ON UPDATE CASCADE ON DELETE CASCADE',
            multidatastreamobservedproperty_observedproperty_id_fkey:
                'FOREIGN KEY ("observedproperty_id") REFERENCES "observedproperty"("id") ON UPDATE CASCADE ON DELETE CASCADE'
        },
        indexes: {
            multidatastreamobservedproperty_multidatastream_id: 'ON public."multidatastreamobservedproperty" USING btree ("multidatastream_id")',
            multidatastreamobservedproperty_observedproperty_id: 'ON public."multidatastreamobservedproperty" USING btree ("observedproperty_id")'
        }
    },

    Observations: {
        definition: `An Observation is the act of measuring or otherwise determining the value of a property.<br>An Observation in SensorThings represents a single Sensor reading of an ObservedProperty.<br>A physical device, a Sensor, sends Observations to a specified Datastream.<br>An Observation requires a FeatureOfInterest entity, if none is provided in the request, the Location of the Thing associated with the Datastream, will be assigned to the new Observation as the FeatureOfInterest`,
        reference: "https://docs.ogc.org/is/18-088/18-088.html#observation",

        columns: {
            id: definitions.id,
            phenomenonTime: "The time instant or period of when the Observation happens.</br> Note: Many resource-constrained sensing devices do not have a clock. As a result, a client may omit phenonmenonTime when POST new Observations, even though phenonmenonTime is a mandatory property. When a SensorThings service receives a POST Observations without phenonmenonTime, the service SHALL assign the current server time to the value of the phenomenonTime.",
            result: "The estimated value of an ObservedProperty from the Observation. Any (depends on the observationType defined in the associated Datastream or MultiDatastream)",
            resultTime: "The time of the Observation’s result was generated.</br>Note: Many resource-constrained sensing devices do not have a clock. As a result, a client may omit resultTime when POST new Observations, even though resultTime is a mandatory property. When a SensorThings service receives a POST Observations without resultTime, the service SHALL assign a null value to the resultTime.",
            resultQuality: "Describes the quality of the result.",
            validTime: "The time period during which the result may be used.",
            parameters: "Key-value pairs showing the environmental conditions during measurement."
        },
        relations: {
            Datastream: "A Datastream can have zero-to-many Observations. One Observation SHALL occur in one-and-only-one Datastream.",
            MultiDatastream: "A MultiDatastream can have zero-to-many Observations. One Observation SHALL occur in one-and-only-one MultiDatastream.",
            FeatureOfInterest: "An Observation observes on one-and-only-one FeatureOfInterest. One FeatureOfInterest could be observed by zero-to-many Observations."
        }
    },

    HistoricalObservations: {
    },

    ThingsLocations: {
        name: "ThingsLocations",
        singular: "ThingLocation",
        table: "thinglocation",
        order: -1,
        columns: {
            thing_id: {
                create: "BIGINT NOT NULL"
            },
            location_id: {
                create: "BIGINT NOT NULL"
            }
        },
        admin: false,
        relations: {},
        constraints: {
            thinglocation_pkey: 'PRIMARY KEY ("thing_id", "location_id")',
            thinglocation_location_id_fkey: 'FOREIGN KEY ("location_id") REFERENCES "location"("id") ON UPDATE CASCADE ON DELETE CASCADE',
            thinglocation_thing_id_fkey: 'FOREIGN KEY ("thing_id") REFERENCES "thing"("id") ON UPDATE CASCADE ON DELETE CASCADE'
        },
        indexes: {
            thinglocation_location_id: 'ON public."thinglocation" USING btree ("location_id")',
            thinglocation_thing_id: 'ON public."thinglocation" USING btree ("thing_id")'
        }
    },

    Decoders: {
    },

    Loras: {
        definition: "Lora is an extension for adding observations in sensorThings from LORA sensors, the link with sensor is done by deveui (the unique ID of lora sensor) in things properties",
        reference: "",
        columns: {
            id: definitions.id,
            name: "A property provides a label for Lora sensor, commonly a descriptive name.",
            description: "This is a short description of the corresponding Lora sensor.",
            properties: definitions.properties,
            deveui: "The DevEUI is a 64-bit globally-unique Extended Unique Identifier (EUI-64) assigned by the manufacturer, or the owner, of the end-device.",
        },
        relations: {
            Datastream: "A Lora can have zero-to-many Datastreams. One Datastream SHALL occur in one-and-only-one Lora.",
            MultiDatastream: "A Lora can have one-and-only-one MultiDatastream. One MultiDatastream SHALL occur in one-and-only-one Lora.",
            Decoder:  "A Decoder can have zero-to-many Lora. One Lora SHALL occur in one-and-only-one Decoder.",
        }
    },

    Users: {
    },

    Services: {
        definition: `Service is an extension that  represent the configuration of one service and the possibility to create a new service with an assistant with the route /service:<br><table><tr><td class="noBorder">The screen below appear</td><td class="noBorder">and after admin postgres connection ok</td><tr><td class="noBorder"><img src="./assets/admin.jpg" alt="admin login"></td><td class="noBorder"><img src="./assets/service.jpg" alt="service"></td></tr></table>`,
        columns: {
            name: "Name of the service.",
            apiVersion: "version of the model",
            date_format: "date format",
            nb_page: "Default number of item by page for pagination",
            alias: "List of alias for calling the API",
            extensions: "List of extensions",
            options: "List of options",
            pg: `<pre>{
                "host": "Postgres Host",
                "port": "Postgres Port",
                "user": "Postgres username to create",
                "password": "Postgres password to create",
                "database": "Name of the database (create it if not exist)",
                "retry": "number of connection retry",
                "tunnel": {
                    "sshConnection": {
                        "host": "Distant host",
                        "username": "Distant username",
                        "password": "Distant password",
                        "port": "Distant ssh port"
                    },
                    "forwardConnection": {
                        "srcAddr": "forward Connection source address",
                        "srcPort": "forward Connection source port",
                        "dstAddr": "forward Connection distant address",
                        "dstPort": "forward Connection distant port"
                    }
                }
            }</pre>
            `,
        }
    },
    
    CreateObservations: {
    },    

    CreateFile: {
    }   ,
    
    Logs: {
        definition: "Logs is an extension for adding Logs to trace errors, note that order is desc to view last logs on top.",
        reference: "",
        columns: {
            id: definitions.id,
            date: "The Date time of the logs.",
            method: "Verb method GET, POST, PATCH, DELETE",
            code: "HTTP return code.",
            url: "Original url.",
            datas: "Datas posted.",
            database: "Name of the database.",
            returnid: "Id return.",
            error: "API error.",
        },
        relations: {}
    },
};

export const listOfColumns = (inputEntity: Ientity) => {    
    const success:string[] = [];
    const params:string[] = [];
    const infosEntity: Record<string, any> = infos[inputEntity.name];
    Object.keys(infosEntity.columns).forEach((elem: string) => {
        const optional = (inputEntity.columns[elem] && inputEntity.columns[elem].create.includes("NOT NULL")) ? elem : `[${elem}]`;
        success.push(`{${inputEntity.columns[elem] && inputEntity.columns[elem].type ? inputEntity.columns[elem].type : "none"}} ${elem} ${infosEntity["columns"][elem] || elem}`);
        if (inputEntity.columns[elem] && !inputEntity.columns[elem].create.includes("GENERATED"))
            params.push(`{${inputEntity.columns[elem].type}} ${optional} ${infosEntity["type"] && infosEntity["type"][elem] ? infosEntity["type"][elem] : ""}`);
    });
    Object.keys(inputEntity.relations).forEach((elem: string) => {
        const optional = (inputEntity.columns[elem] && inputEntity.columns[elem].create.includes("NOT NULL")) ? elem : `[${elem}]`;
        success.push(`{relation} ${elem} ${infosEntity["relations"][elem] || ""}`);
        params.push(`{relation} ${optional} ${infosEntity["type"] && infosEntity["type"][elem] ? infosEntity["type"][elem] : ""}`);
    });
    return {
        success, params
    };
};

export const blank = (nb: number) => '</br>'.repeat(nb);
export const showHide = (name: string, content: string) => `<input id="show${name}" type=checkbox> <label for="show${name}">Click for Help</label> <span id="content${name}">${content}</span>`;
export const apiInfos = {
    "0" : `List of some code values used for identifying observations result types defined in the Datastream or MultiDatastream observationType.</b> <table> <thead> <tr> <th style="width: 20%">Type (O&M 2.0)</th> <th style="width: 70%">Value Code</th> <th style="width: 10%">Result</th> </tr> </thead> <tbody> <tr> <td>OM_CategoryObservation</td> <td>http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_CategoryObservation</td> <td>URI</td> </tr> <tr> <td>OM_CountObservation</td> <td>http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_CountObservation</td> <td>integer</td> </tr> <tr> <td>OM_Measurement</td> <td>http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement</td> <td>double</td> <tr> <td>OM_complexObservation</td> <td>http://www.opengis.net/def/observation-type/ogc-om/2.0/om_complex-observation</td> <td>array of double</td> </tr> <tr> <td>OM_Observation</td> <td>http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation</td> <td>any</td> </tr> <tr> <td>OM_TruthObservation</td> <td>http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_TruthObservation</td> <td>boolean</td> </tr> <tr> <td>OM_SWEArrayObservation</td> <td>http://www.opengis.net/def/observation-type/ogc-omxml/2.0/swe-array-observation</td> <td>array</td> </tr> </tbody> </table>`, "9.2.2" : "To address to an entity set, users can simply put the entity set name after the service root URI. The service returns a JSON object with a property of value. The value of the property SHALL be a list of the entities in the specified entity set.",
    "1" : `List of Options : <table> <thead> <tr> <th style="width: 20%">Option</th> <th style="width: 70%">Description</th> </tr> </thead> <tbody> <tr> <td>canDrop</td> <td>Can drop database (usefull when setting system)</td> </tr> <tr> <td>stripNull</td> <td>Remove null value to json</td> </tr> <tr> <td>forceHttps</td> <td>add s to http:</td> </tr> </tbody> </table>`,
    "2" : `List of Extensions : <table> <thead> <tr> <th style="width: 20%">Option</th> <th style="width: 70%">Extensions</th> </tr> </thead> <tbody> <tr> <td>base</td> <td>Core Sensorthings</td> </tr> <tr> <td>logs</td> <td>Add log entity to save logs</td> </tr> <tr> <td>users</td> <td>Add users mangement</td> </tr> <tr> <td>lora</td> <td>Add lora to manage lora sensors</td> </tr> <tr> <td>multiDatastream</td> <td>Add multiDatastream extension</td> </tr> <tr> <td>highPrecision</td> <td>Result are on float8 instead of float4</td> </tr> <tr> <td>mqtt</td> <td>Not use yet</td> </tr> <tr> <td>tasking</td> <td>Not use yet</td> </tr> </tbody> </table>`,
    "9.2.3" : "Users can address to a specific entity in an entity set by place the unique identifier of the entity between brace symbol “()” and put after the entity set name. The service then returns the entity with all its properties.",
    "9.2.4" : "Users can address to a property of an entity by specifying the property name after the URI addressing to the entity. The service then returns the value of the specified property. If the property has a complex type value, properties of that value can be addressed by further property name composition.</br>If the property is single-valued and has the null value, the service SHALL respond with 204 No Content. If the property is not available, for example due to permissions, the service SHALL respond with 404 Not Found.",
    "9.2.5" : "To address the raw value of a primitive property, clients append a path segment containing the string $value to the property URL.",
    "9.2.6" : "As the entities in different entity sets may hold some relationships, users can request the linked entities by addressing to a navigation property of an entity. The service then returns one or many entities that hold a certain relationship with the specified entity.",
    "9.2.7" : "As the entities in different entity sets may hold some relationships, users can request the linked entities’ selfLinks by addressing to an association link of an entity. An associationLink can be used to retrieve a reference to an entity or an entity set related to the current entity. Only the selfLinks of related entities are returned when resolving associationLinks.",
    "9.2.8" : "As users can use navigation properties to link from one entity set to another, users can further extend the resource path with unique identifiers, properties, or links (i.e., Usage 3, 4 and 6).",
    "9.3.2.1" : "The $expand system query option indicates the related entities to be represented inline. The value of the $expand query option SHALL be a comma separated list of navigation property names. Additionally, each navigation property can be followed by a forward slash and another navigation property to enable identifying a multi-level relationship.",
    "9.3.2.2" : "The $select system query option requests the service to return only the properties explicitly requested by the client. The value of a $select query option SHALL be a comma-separated list of selection clauses. Each selection clause SHALL be a property name (including navigation property names). In the response, the service SHALL return the specified content, if available, along with any available expanded navigation properties.",
    "9.3.3.1" : `The $orderby system query option specifies the order in which items are returned from the service. The value of the $orderby system query option SHALL contain a comma-separated list of expressions whose primitive result values are used to sort the items. A special case of such an expression is a property path terminating on a primitive property.
    ${blank(2)} The expression MAY include the suffix asc for ascending or desc for descending, separated from the property name by one or more spaces. If asc or desc is not specified, the service SHALL order by the specified property in ascending order.
    ${blank(2)} Null values SHALL come before non-null values when sorting in ascending order and after non-null values when sorting in descending order.
    ${blank(2)}Items SHALL be sorted by the result values of the first expression, and then items with the same value for the first expression SHALL be sorted by the result value of the second expression, and so on.`,    
    "9.3.3.2" : `The $top system query option specifies the limit on the number of items returned from a collection of entities. The value of the $top system query option SHALL be a non-negative integer n. The service SHALL return the number of available items up to but not greater than the specified value n.
    ${blank(2)}If no unique ordering is imposed through an $orderby query option, the service SHALL impose a stable ordering across requests that include $top.
    ${blank(2)}In addition, if the $top value exceeds the service-driven pagination limitation (i.e., the largest number of entities the service can return in a single response), the $top query option SHALL be discarded and the server-side pagination limitation SHALL be imposed.`,
    "9.3.3.3" : `The $skip system query option specifies the number for the items of the queried collection that SHALL be excluded from the result. The value of $skip system query option SHALL be a non-negative integer n. The service SHALL return items starting at position n+1.
    ${blank(2)}Where $top and $skip are used together, $skip SHALL be applied before $top, regardless of the order in which they appear in the request.
    ${blank(2)}If no unique ordering is imposed through an $orderby query option, the service SHALL impose a stable ordering across requests that include $skip.`,
    "9.3.3.4" : `The $count system query option with a value of true specifies that the total count of items within a collection matching the request SHALL be returned along with the result. A $count query option with a value of false (or not specified) hints that the service SHALL not return a count.
    ${blank(2)}The service SHALL return an HTTP Status code of 400 Bad Request if a value other than true or false is specified.
    ${blank(2)}The $count system query option SHALL ignore any $top, $skip, or $expand query options, and SHALL return the total count of results across all pages including only those results matching any specified $filter. Clients should be aware that the count returned inline may not exactly equal the actual number of items returned, due to latency between calculating the count and enumerating the last value or due to inexact calculations on the service.`,
    "9.3.3.5.1": `${blank(1)}<b>Comparison Operators</b>${blank(1)}<table> <thead> <tr> <th style="width: 10%">Operator</th> <th style="width: 35%">Description</th> <th style="width: 55%">Example</thead> <tbody> <tr> <td>eq</td> <td>Equal</td> <td>/Datastreams?$filter=unitOfMeasurement/name eq 'degree Celsius'</td> </tr> <tr> <td>ne</td> <td>Not equal</td> <td>/Datastreams?$filter=unitOfMeasurement/name ne 'degree Celsius'</td> </tr> <tr> <td>gt</td> <td>Greater than</td> <td>/Observations?$filter=result gt 20.0</td> </tr> <tr> <td>ge</td> <td>Greater than or equal</td> <td>/Observations?$filter=result ge 20.0</td> </tr> <tr> <td>lt</td> <td> Less than</td> <td>/Observations?$filter=result lt 100</td> </tr> <tr> <td>le</td> <td>Less than or equal</td> <td>/Observations?$filter=result le 100</td> </tr> </tbody> </table>
    <b>Logical Operators</b>${blank(1)}<table> <thead> <tr> <th style="width: 10%">Operator</th> <th style="width: 35%">Description</th> <th style="width: 55%">Example </thead> <tbody> <tr> <td>and</td> <td>Logical and</td> <td>/Observations?$filter=result le 3.5 and FeatureOfInterest/id eq 1</td> </tr> <tr> <td>or</td> <td>Logical or</td> <td>/Observations?$filter=result gt 20 or result le 3.5</td> </tr> <tr> <td>not</td> <td>Logical negation</td> <td>/Things?$filter=not startswith(description,'test')</td> </tr> </tbody> </table>
    <b>Arithmetic Operators</b>${blank(1)} <table> <thead> <tr> <th style="width: 10%">Operator</th> <th style="width: 35%">Description</th> <th style="width: 55%">Example </thead> <tbody> <tr> <td>add</td> <td>Addition</td> <td>/Observations?$filter=result add 5 gt 10</td> </tr> <tr> <td>sub</td> <td>Subtraction</td> <td>/Observations?$filter=result sub 5 gt 10</td> </tr> <tr> <td>mul</td> <td>Multiplication</td> <td>/Observations?$filter=result mul 2 gt 2000</td> </tr> <tr> <td>div</td> <td>Division</td> <td>/Observations?$filter=result div 2 gt 4</td> </tr> <tr> <td>mod</td> <td>Modulo</td> <td>/Observations?$filter=result mod 2 eq 0</td> </tr> </tbody> </table>    
    <b>Grouping Operators</b>${blank(1)} <table> <thead> <tr> <th style="width: 10%">Operator</th> <th style="width: 35%">Description</th> <th style="width: 55%">Example </thead> <tbody> <tr> <td>()</td> <td>Precedence grouping</td> <td>/Observations?$filter=(result sub 5) gt 10</td> </tr> </tbody> </table>`,
    "10.2" : `${blank(2)}To create an entity in a collection, the client SHALL send a HTTP POST request to that collection’s URL. The POST body SHALL contain a single valid entity representation.
    ${blank(2)}If the target URL for the collection is a navigationLink, the new entity is automatically linked to the entity containing the navigationLink.
    ${blank(2)}Upon successful completion, the response SHALL contain a HTTP location header that contains the selfLink of the created entity.
    ${blank(2)}Upon successful completion the service SHALL respond with either 201 Created, or 204 No Content.
    ${blank(2)}In addition, the link between entities SHALL be established upon creating an entity. Two use cases SHALL be considered: (1) link to existing entities when creating an entity, and (2) create related entities when creating an entity. The requests for these two use cases are described in the following subsection.
    ${blank(2)}When clients create resources in a SensorThings service, they SHALL follow the integrity constraints listed in Table 24. For example, a Datastream entity SHALL link to a Thing entity. When a client wants to create a Datastream entity, the client needs to either (1) create a linked Thing entity in the same request or (2) link to an already created Thing entity. The complete integrity constraints for creating resources are shown in the following table.
    ${blank(2)}Special case #1 - When creating an Observation entity that links to a FeatureOfInterest entity: Sometimes the FeatureOfInterest of an Observation is the Location of the Thing. For example, a wifi-connected thermostat’s temperature observation’s feature-of-interest can be the location of the smart thermostat, that is the room WHERE the smart thermostat is located in.
    ${blank(2)}In this case, when a client creates an Observation entity, the client SHOULD omit the link to a FeatureOfInterest entity in the POST body message and SHOULD not create a related FeatureOfInterest entity with deep insert. And if the service detects that there is no link to a FeatureOfInterest entity in the POST body message that creates an Observation entity, the service SHALL either (1) create a FeatureOfInterest entity by using the location property from the Location of the Thing entity when there is no FeatureOfInterest whose location property is from the Location of the Thing entity or (2) link to the FeatureOfInterest whose location property is from the Location of the Thing entity.
    ${blank(2)}Special case #2: In the context of IoT, many Observations’ resultTime and phenomenonTime cannot be distinguished or the resultTime is not available. In this case, when a client creates an Observation entity, the client MAY omit the resultTime and the service SHOULD assign a null value to the resultTime.
    ${blank(1)}<table> <thead> <tr> <th style="width: 30%">Scenario</th> <th style="width: 70%">Integrity Constraints</th> </tr> </thead> <tbody> <tr> <td>Create a Thing entity</td> <td></td> </tr> <tr> <td>Create a Location entity</td> <td></td> </tr> <tr> <td>Create a Datastream entity</td> <td>SHALL link to a Thing entity</br>SHALL link to a Sensor entity.</br>SHALL link to an ObservedProperty entity.</td> </tr> <tr> <td>Create a Sensor entity</td> <td></td> </tr> <tr> <td>Create an ObservedProperty entity</td> <td></td> </tr> <tr> <td>Create an Observation entity</td> <td>SHALL link to a Datastream or MultiDatastream entity.</br>SHALL link to a FeatureOfInterest entity. If no link specified, the service SHALL create a FeatureOfInterest entity from the content of the Location entities.</td> </tr> <tr> <td>Create a FeatureOfInterest entity</td> <td></td> </tr> </tbody> </table>`,
    "10.3" : `${blank(2)}In SensorThings PATCH is the preferred means of updating an entity. PATCH provides more resiliency between clients and services by directly modifying only those values specified by the client.
    ${blank(2)}The semantics of PATCH, as defined in [RFC5789], are to merge the content in the request payload with the entity’s current state, applying the update only to those components specified in the request body. The properties provided in the payload corresponding to updatable properties SHALL replace the value of the corresponding property in the entity. Missing properties of the containing entity or complex property SHALL NOT be directly altered.
    ${blank(2)}Services MAY additionally support PUT, but should be aware of the potential for data-loss in round-tripping properties that the client may not know about in advance, such as open or added properties, or properties not specified in metadata. Services that do not support PUT SHALL respond with an HTTP code 501 Not Implemented.
    ${blank(2)}Key and other non-updatable properties that are not tied to key properties of the principal entity, can be omitted from the request. If the request contains a value for one of these properties, the service SHALL ignore that value when applying the update.
    ${blank(2)}On success, the response SHALL be a valid success response.`,
    "10.2.1.1" : `A SensorThings API service, that supports entity creation, SHALL support linking new entities to existing entities upon creation. To create a new entity with links to existing entities in a single request, the client SHALL include the unique identifiers of the related entities associated with the corresponding navigation properties in the request body.
    ${blank(2)}In the case of creating an Observation whose FeatureOfInterest is the Thing’s Location (that means the Thing entity has a related Location entity), the request of creating the Observation SHOULD NOT include a link to a FeatureOfInterest entity. The service will first automatically create a FeatureOfInterest entity from the Location of the Thing and then link to the Observation.
    ${blank(2)}In the complex use case of a Thing has multiple Location representations, the service SHOULD decide the default Location encoding when an Observation’s FeatureOfInterest is the Thing’s Location.`,
    "10.2.1.2" : `${blank(2)}A request to create an entity that includes related entities, represented using the appropriate inline representation, is referred to as a "deep insert". A SensorThings service that supports entity creation SHALL support deep insert.
    ${blank(2)}If the inline representation contains a value for a computed property (i.e., id), the service SHALL ignore that value when creating the related entity.
    ${blank(2)}On success, the service SHALL create all entities and relate them. On failure, the service SHALL NOT create any of the entities.`,
    "10.4" : `${blank(1)} A successful DELETE request to an entity’s edit URL deletes the entity. The request body SHOULD be empty. Services SHALL implicitly remove relations to and from an entity when deleting it; clients need not delete the relations explicitly.
    ${blank(1)}Services MAY implicitly delete or modify related entities if required by integrity constraints.
    <table> <thead> <tr> <th style="width: 30%">Scenario</th> <th style="width: 70%">Integrity Constraints</th> </tr> </thead> <tbody> <tr> <td>Delete a Thing entity</td> <td>Delete all the Datastream and HistoricalLocation entities linked to the Thing entity.</td> </tr> <tr> <td>Delete a Location entity</td> <td>Delete all the HistoricalLocation entities linked to the Location entity</td> </tr> <tr> <td>Delete a Datastream entity</td> <td>Delete all the Observation entities linked to the Datastream entity.</td> </tr> <tr> <td>Delete a Sensor entity</td> <td>Delete all the Datastream entities linked to the Sensor entity.</td> </tr> <tr> <td>Delete an ObservedProperty entity</td> <td>Delete all the Datastream entities linked to the ObservedProperty entity.</td> </tr> <tr> <td>Delete an Observation entity</td> <td></td> </tr> <tr> <td>Delete a FeatureOfInterest entity</td> <td>Delete all the Observation entities linked to the FeatureOfInterest entity.</td> </tr> <tr> <td>Delete a HistoricalLocation entity entity</td> <td></td> </tr> </tbody> </table>`
};
