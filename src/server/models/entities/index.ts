/**
 * Index Entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EentityType } from "../../enums";
import { Ientity } from "../../types";
import { createBlankEntity } from "../helpers";

// Entities are in uppercase to have a difference with classes entities

export const SERVICE: Ientity = createBlankEntity("Services");
export const CREATEOBSERVATION: Ientity = createBlankEntity("CreateObservations");
export { DATASTREAM } from "./datastream";
export { DECODER } from "./decoder";
export { FEATUREOFINTEREST } from "./featureOfInterest";
export { HISTORICALLOCATION } from "./historicalLocation";
export { LOCATION } from "./location";
export { LOCATIONHISTORICALLOCATION } from "./locationHistoricalLocation";
export { LORA } from "./lora";
export { MULTIDATASTREAM } from "./multiDatastream";
export { MULTIDATASTREAMOBSERVEDPROPERTY } from "./multiDatastreamObservedProperty";
export { OBSERVATION } from "./observation";
export { OBSERVEDPROPERTY } from "./observedProperty";
export { SENSOR } from "./sensor";
export { THING } from "./thing";
export { THINGLOCATION } from "./thingLocation";
export { USER } from "./user";
export { LOG } from "./log";
export const _BLANKENTITY: Ientity = {
    name: "",
    singular: "",
    table: "",
    constraints: {},
    indexes: {},
    orderBy: "",
    createOrder: -1,
    type: EentityType.blank,
    order: 0,
    columns: {},
    relations: {}
};
