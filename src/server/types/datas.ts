import { IKeyString, IqueryOptions, Iuser } from ".";

/**
 * Idatas interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
export interface Idatas { 
    url: string; 
    login?: boolean; 
    connection?: string; 
    queryOptions?: IqueryOptions;
    user?: Iuser; 
    body?: any; 
    why?: IKeyString;
    default?: string | string[];
    message?: string
  }