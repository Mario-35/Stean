/**
 * csvImport interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- csvImport interface -----------------------------------!\n");

export interface IcsvImport {
    header:   boolean;
    dateSql:  string;
    columns:  string[];
  }