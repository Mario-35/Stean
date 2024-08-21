/**
 * ILoraDecodingResult interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- ILoraDecodingResult interface -----------------------------------!");

export interface ILoraDecodingResult { // decoding return result
    decoder:  string; // name of decoder 
    result?:  any; // result if exist
    error?:   unknown; // error if Exist
  }