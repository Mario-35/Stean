/**
 * asJson.
 *
 * @copyright 2020-present Inrae
 * @review 29-10-2024
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant } from "../../enums";

export const asJson = (input: { query: string; singular: boolean; count: boolean; strip: boolean; fullCount?: string; fields?: string[] }): string =>
    input.query.trim() === ""
        ? ""
        : `SELECT ${input.count == true ? `${input.fullCount ? `(${input.fullCount})` : `COUNT(t) AS "${EConstant.count}"`},${EConstant.return}${EConstant.tab}` : ""}${
              input.fields ? input.fields.join(`,${EConstant.return}${EConstant.tab}`) : ""
          }COALESCE(${input.singular === true ? "ROW_TO_JSON" : `${input.strip === true ? "JSON_STRIP_NULLS(" : ""} JSON_AGG`}(t)${input.strip === true ? ")" : ""}, '${
              input.singular === true ? "{}" : "[]"
          }') AS value${EConstant.return}${EConstant.tab}FROM (${EConstant.return}${EConstant.tab}${input.query}) AS t`;
