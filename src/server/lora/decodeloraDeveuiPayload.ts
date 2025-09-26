/**
 * decodeloraDeveuiPayload for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { decodingPayload } from ".";
import { executeSql } from "../db/helpers";
import { logging } from "../log";
import { errors } from "../messages";
import { DECODER, LORA } from "../models/entities";
import { ILoraDecodingResult, Iservice } from "../types";

export const decodeloraDeveuiPayload = async (service: Iservice, loraDeveui: string, payload: string): Promise<ILoraDecodingResult | undefined> => {
    logging.debug().message(`decodeLoraPayload deveui : [${loraDeveui}]`, payload).to().log().file();
    return await executeSql(
        service,
        `SELECT "name", "code", "nomenclature", "synonym" FROM "${DECODER.table}" WHERE id = (SELECT "decoder_id" FROM "${LORA.table}" WHERE "deveui" = '${loraDeveui}') LIMIT 1`
    )
        .then((res: Record<string, any>) => {
            try {
                return decodingPayload({ ...res[0] }, payload);
            } catch (error) {
                return undefined;
            }
        })
        .catch(() => {
            return {
                decoder: "undefined",
                result: undefined,
                error: errors.DecodingPayloadError
            };
        });
};
