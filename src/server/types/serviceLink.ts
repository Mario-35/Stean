/**
 * IserviceInfos interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Iservice } from "./service";

// import { Isynonyms } from "./synonyms";

export interface IserviceInfos {
    protocol: string; // protocol http or https
    linkBase: string; // linkBase of the service
    root: string; // root url
    model: string; // url to drawio
    service: Iservice;
}
