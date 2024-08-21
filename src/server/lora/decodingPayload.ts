/**
 * decodingPayload for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- decodingPayload for odata -----------------------------------!");

import { log } from "../log";
import { errors } from "../messages";
import { ILoraDecodingResult } from "../types";

export const decodingPayload = ( decoder: { name: string; code: string; nomenclature: string }, payload: string ): ILoraDecodingResult | undefined => {
  console.log(log.debug_head("decodingPayload"));
  if (decoder.name && decoder.nomenclature && decoder.code != 'undefined') {
    try {
      const F = new Function( "input", "nomenclature", `${String(decoder.code)}; return decode(input, nomenclature);` );
      let nomenclature = "";
      if (decoder.nomenclature.trim() != "")
      try {
        nomenclature = JSON.parse(JSON.parse(decoder.nomenclature));
      } catch (error) {
        nomenclature = JSON.parse(decoder.nomenclature);
      }
      const result = F( payload, decoder.nomenclature === "{}" || decoder.nomenclature === "" ? null : nomenclature);
      return { decoder: decoder.name, result: result };
    } catch (error) {
      console.log(error);
      return {
        decoder: decoder.name,
        result: undefined,
        error: errors.DecodingPayloadError,
      };
    }
  }
};
