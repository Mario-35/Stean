/**
 * entities Enum
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EExtensions } from ".";
enum EnumBaseEntities {    
    Things = 'Things',
    FeaturesOfInterest = 'FeaturesOfInterest',
    Locations = 'Locations',
    HistoricalLocations = 'HistoricalLocations',
    LocationsHistoricalLocations = 'LocationsHistoricalLocations',
    ObservedProperties = 'ObservedProperties',
    Sensors = 'Sensors',
    Datastreams = 'Datastreams',
    Observations = 'Observations',
    HistoricalObservations = 'HistoricalObservations',
    ThingsLocations = 'ThingsLocations',
    CreateObservations = 'CreateObservations',
    Services = 'Services' 
}
enum EnumMultiDatastreamEntities {
    MultiDatastreams = 'MultiDatastreams',
    MultiDatastreamObservedProperties = 'MultiDatastreamObservedProperties'
}
enum EnumUsersEntities {
    Users = 'Users',
}
enum EnumLoraEntities {
    Decoders = 'Decoders',
    Loras = 'Loras'
}
enum EnumLogEntities {
    Logs = 'Logs'
}
enum EnumFileEntities {
    Files = 'Files',
    Lines = 'Lines',
    CreateFile = 'CreateFile'
}

export const filterEntities = (exts: string[], name?: string) => {    
    let res = (exts.includes(EExtensions.base)) ? EnumBaseEntities : {};
    if (exts.includes(EExtensions.logs)) res = {... res, ... EnumLogEntities};
    if (exts.includes(EExtensions.multiDatastream)) res = {... res, ... EnumMultiDatastreamEntities};
    if (exts.includes(EExtensions.lora)) res = {... res, ... EnumLoraEntities};
    if (exts.includes(EExtensions.file)) res = {... res, ... EnumFileEntities};
    if (exts.includes(EExtensions.users)) res = {... res, ... EnumUsersEntities};
    return res;
}
export type allEntitiesType = EnumBaseEntities | EnumMultiDatastreamEntities | EnumUsersEntities |  EnumLoraEntities | EnumLogEntities | EnumFileEntities;
export const allEntities: Record<string, any> = { ...EnumBaseEntities, ... EnumMultiDatastreamEntities, ... EnumUsersEntities, ... EnumLoraEntities, ... EnumLogEntities, ... EnumFileEntities};
