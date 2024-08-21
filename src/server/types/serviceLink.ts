/**
 * IserviceInfos interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- IserviceInfos interface -----------------------------------!");

export interface IserviceInfos {
    protocol: string; // protocol http or https
    linkBase: string; // linkBase of the service
    version:  string; // api version
    root:     string; // root url
    model:    string; // url to drawio
  }