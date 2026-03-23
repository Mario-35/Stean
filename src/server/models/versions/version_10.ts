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
import { Core } from "./core";

export class version_10 extends Core {

    constructor() {
        super();
    }

    createVersion(verStr: string, service: Iservice): Ientities {
        return this.makeModel(
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
    }

}
