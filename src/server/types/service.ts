/**
 * service interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Isynonyms, typeExtensions } from ".";
import { EState } from "../enums";
import { IdbConnection } from "./dbConnection";
export interface Iservice {
    date: string; // date write
    name: string; // name of the config file
    key?: string; // key for crypto
    ports?: {
        // server port
        http: number; // API http port
        tcp: number; // tcp port for mqtt
        ws: number; // web socket
    };
    pg: IdbConnection; // postgresSql connection
    apiVersion: string; // api version / model
    date_format: string; // formating date
    nb_page: number; // number of items by page
    nb_graph: number; // number of items max for graph
    options: string[]; // Options see Enum EOptions
    extensions: typeof typeExtensions; // extensions see Enum EExtensions
    alias: string[]; // alias name of the service
    synonyms: Isynonyms | undefined;
    csvDelimiter: ";" | ","; // csv format delimiter
    users: JSON | undefined; // users list
    status: EState; // status of the service
    _partitioned: boolean;
    _lora: boolean;
    _unique: boolean;
    _numeric: boolean;
}
