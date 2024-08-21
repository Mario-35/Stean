/**
 * entity HistoricalObservation.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity HistoricalObservation -----------------------------------!");

import { createEntity } from ".";
import { ERelations } from "../../enums";
import { IconfigFile, Ientity, IKeyBoolean } from "../../types";
import { _idBig } from "./constants";
import { addDoubleQuotes } from "../../helpers";
import { _ID } from "../../db/constants";

  export const HistoricalObservation:Ientity  = createEntity("HistoricalObservations", {
    createOrder: -1,
    order: -1,
    orderBy: `"id"`,
    columns: {
      id: {
        create: _idBig,
        alias(config: IconfigFile, test: IKeyBoolean) {
           return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${addDoubleQuotes(_ID)}`: ''}` ;
        },
        type: "bigint"
      },
      validTime: {
        create: "timestamptz DEFAULT CURRENT_TIMESTAMP",
        alias() {},
        type: "date"
      },
      _result: {
        create: "JSONB NULL",
        alias() {},
        type: "json"
      },
      observation_id: {
        create: "BIGINT NULL",
        alias() {},
        type: "bigint"
      },
    },
    constraints: {
      HistoricalObservations_pkey: 'PRIMARY KEY ("id")',
      HistoricalObservations_id_fkey:
        'FOREIGN KEY ("observation_id") REFERENCES "observation"("id") ON UPDATE CASCADE ON DELETE CASCADE',
    },
    indexes: {
      HistoricalObservations_observation_id:
        'ON public."historicalobservation" USING btree ("observation_id")',
    },
    relations: {
      Observations: {
        type: ERelations.belongsTo,
        expand: `"observation"."id" = "historicalobservation"."observation_id"`,
        link: "err: 501 : Not Implemented.",        
        entityName: "Observations",
        tableName: "observation",
        relationKey: "observation_id",
        entityColumn: "id",
        tableKey: "id",
      },
    },
  });