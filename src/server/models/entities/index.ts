/**
 * Index Entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Ientity } from "../../types";
import { createBlankEntity } from "../helpers";
 
export const Service: Ientity = createBlankEntity("Services");
export const CreateObservation:Ientity = createBlankEntity("CreateObservations");
export const CreateFile: Ientity = createBlankEntity("CreateFile");
export { Datastream } from "./datastream";
export { Decoder } from "./decoder";
export { FeatureOfInterest } from "./featureOfInterest";
export { HistoricalLocation } from "./historicalLocation";
export { Location } from "./location";
export { LocationHistoricalLocation } from "./locationHistoricalLocation";
export { Log } from "./log";
export { Lora } from "./lora";
export { MultiDatastream } from "./multiDatastream";
export { MultiDatastreamObservedProperty } from "./multiDatastreamObservedProperty";
export { Observation } from "./observation";
export { ObservedProperty } from "./observedProperty";
export { Sensor } from "./sensor";
export { Thing } from "./thing";
export { ThingLocation } from "./thingLocation";
export { User } from "./user";
export { File } from "./file";
export { Line } from "./line";
