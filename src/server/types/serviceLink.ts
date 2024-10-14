/**
 * IserviceInfos interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
export interface IserviceInfos {
    protocol: string; // protocol http or https
    linkBase: string; // linkBase of the service
    version:  number; // api version
    root:     string; // root url
    model:    string; // url to drawio
  }