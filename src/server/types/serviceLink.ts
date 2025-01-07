
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
    version:  string; // api version
    root:     string; // root url
    model:    string; // url to drawio
    service:  {
      apiVersion: string;
      date_format: string;
      nb_page: number;
      extensions: string[];
      options: string[];
      csvDelimiter: string;
    },
    stats: JSON;
  }