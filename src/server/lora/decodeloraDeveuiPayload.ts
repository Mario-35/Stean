/**
 * decodeloraDeveuiPayload for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { decodingPayload } from ".";
import { executeSql } from "../db/helpers";
import { queries } from "../db/queries";
import { EErrors, EInfos } from "../enums";
import { logging } from "../log";
import { ILoraDecodingResult, Iservice } from "../types";

export const decodeloraDeveuiPayload = async (service: Iservice, loraDeveui: string, payload: string): Promise<ILoraDecodingResult | undefined> => {
    logging.message(`${EInfos.decodingPayload} : [${loraDeveui}]`, payload).toLogAndFile();
    return await executeSql(service, queries.getDecoderFromDeveui(loraDeveui))
        .then((res: Record<string, any>) => {
            try {
                return decodingPayload({ ...res[0] }, payload);
            } catch (error) {
                logging.error(EErrors.DecodingPayloadError, error).toLogAndFile();
                return undefined;
            }
        })
        .catch(() => {
            return {
                decoder: "undefined",
                result: undefined,
                error: EErrors.DecodingPayloadError
            };
        });
};
