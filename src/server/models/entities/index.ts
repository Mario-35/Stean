/**
 * Index Entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Index Entity -----------------------------------!");

import { allEntities } from "../../enums";
import { errors, msg } from "../../messages";
import { Ientity, IentityCore } from "../../types";

const singular = (input: string) : string => {
  if (input.endsWith("ies")) input = input.slice(0, -3) + "y";
  if (input.endsWith("s")) input = input.slice(0, -1);
  return input.split("").map((e, i) => {
    if (!(e === "s" && /^[A-Z]*$/.test(input[i+1]) ) )return e;      
  }).join("").trim();
};

export const createEntity = (name: string, datas: IentityCore | number) : Ientity => {
  const entity= allEntities[name];
    if (entity) {
      const t = singular(entity);
      return (typeof datas !== "number") ? {
        name: name,
        singular: t,
        table: t.toLowerCase(),
        ... datas
      } :  {
        name: name,
        singular: t,
        table: "",
        createOrder: 99,
        order: datas,
        orderBy: "",
        columns: {},
        relations: {},
        constraints: {},
        indexes: {},
      };
    }
    throw new Error(msg( errors.noValidEntity, name));
};
  
export const Config: Ientity = createEntity("Configs", 0);
export const CreateFile: Ientity = createEntity("CreateFile", 99);
export const CreateObservation:Ientity = createEntity("CreateObservations", 0);
export { Datastream } from "./datastream";
export { Decoder } from "./decoder";
export { FeatureOfInterest } from "./featureOfInterest";
export { HistoricalLocation } from "./historicalLocation";
export { HistoricalObservation } from "./historicalObservation";
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