/**
 * Model Maker
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { _STREAM } from "../../db/constants";
import { Iservice, Ientities } from "../../types";
import {
    CREATEOBSERVATION,
    DATASTREAM,
    FEATUREOFINTEREST,
    HISTORICALLOCATION,
    LOCATION,
    LOCATIONHISTORICALLOCATION,
    LOG,
    MULTIDATASTREAM,
    OBSERVATION,
    OBSERVEDPROPERTY,
    SENSOR,
    SERVICE,
    THING,
    THINGLOCATION,
    MULTIDATASTREAMOBSERVEDPROPERTY
} from "../entities";
import { Geometry, Jsonb } from "../types";
import { Core } from "./core";

export class version_11 extends Core {
    constructor() {
        super();
    }

    createVersion(service: Iservice): Ientities {
        const entities =  this.makeModel(
            [
                THING,
                FEATUREOFINTEREST,
                LOCATION,
                THINGLOCATION,
                HISTORICALLOCATION,
                LOCATIONHISTORICALLOCATION,
                OBSERVEDPROPERTY,
                SENSOR,
                DATASTREAM,
                MULTIDATASTREAM,
                OBSERVATION,
                SERVICE,
                LOG,
                CREATEOBSERVATION,
                MULTIDATASTREAMOBSERVEDPROPERTY
            ],
            service
        );
        ["Locations", "FeaturesOfInterest", "ObservedProperties", "Sensors", "Datastreams", "MultiDatastreams"].forEach((entityName: string) => {
            if (entities[entityName]) entities[entityName].columns["properties"] = new Jsonb().column();
        });
        // add geom to Location
        entities.Locations.columns["geom"] = new Geometry().column();
        return entities;
    }
}

