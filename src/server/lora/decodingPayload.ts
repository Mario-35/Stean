/**
 * decodingPayload for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { _DEBUG } from "../constants";
import { EErrors } from "../enums";
import { logging } from "../log";
import { ILoraDecodingResult } from "../types";

export const decodingPayload = (decoder: { name: string; code: string; nomenclature: string }, payload: string): ILoraDecodingResult | undefined => {
    console.log(logging.debug().head("decodingPayload").to().text());
    try {
        const F = new Function("input", "nomenclature", `${String(decoder.code)}; return decode(input, nomenclature);`);
        let nomenclature = "";
        if (decoder.nomenclature.trim() != "")
            try {
                nomenclature = JSON.parse(decoder.nomenclature);
            } catch (error) {
                nomenclature = JSON.parse(decoder.nomenclature);
            }
        const result = F(payload, decoder.nomenclature === "{}" || decoder.nomenclature === "" ? null : nomenclature);
        return { decoder: decoder.name, result: result };
    } catch (error) {
        console.log(error);
        return {
            decoder: decoder.name,
            result: undefined,
            error: EErrors.DecodingPayloadError
        };
    }
};
