/**
 * service interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- service interface -----------------------------------!");

import postgres from "postgres";
import { typeExtensions, typeOptions } from ".";
import { EVersion } from "../enums";
import { IdbConnection } from "./dbConnection";

export interface Iservice {
    name:           string; // name of the config file
    key?:           string; // key for crypto
    ports?:         { // server port
                        http: number, // API http port
                        tcp: number, // tcp port for mqtt
                        ws: number, // web socket
                    }; 
    pg:             IdbConnection; // postgresSql connection
    apiVersion:     EVersion; // api version / model
    date_format:    string; // formating date
    nb_page:        number; // number of items by page
    options:        typeof typeOptions; // Options see Enum EOptions
    extensions:     typeof typeExtensions; // extensions see Enum EExtensions
    alias:          string[]; // alias name of the service
    _connection:    postgres.Sql<Record<string, unknown>> | undefined; // not in file only when running to store connection
}
