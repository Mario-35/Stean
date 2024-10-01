/**
 * returnFormat interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- returnFormat interface -----------------------------------!\n");

import { koaContext } from ".";
import { PgVisitor } from "../odata/visitor";

 export interface IreturnFormat {
    name:                                               string; // name of the format (extension) default JSON
    type:                                               string; // type of format
    format(input: string | object, ctx?: koaContext):   string | object; // formating datas
    generateSql(input: PgVisitor):                      string | undefined; // generate postgresSql query
}