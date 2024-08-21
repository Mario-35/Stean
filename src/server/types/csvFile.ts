/**
 * csvFile interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- csvFile interface -----------------------------------!");
import { IcsvColumn, IstreamInfos } from ".";

export interface IcsvFile {
    filename:   string;
    tempTable:  string;
    stream:     IstreamInfos[];
    columns:    IcsvColumn[];
    header:     string;
}
