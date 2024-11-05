import { IKeyBoolean, Iservice } from "../../types";

/**
 * entity Thing
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
export const _idBig = "BIGINT GENERATED ALWAYS AS IDENTITY";
export const _idRel = "BIGINT NOT NULL";
export const _tz = "TIMESTAMPTZ NULL";
export function _text(def?: string): string { return `TEXT NOT NULL${def ? ` DEFAULT '${def}'::TEXT` : ''}`};

export function _result(service: Iservice , test: IKeyBoolean | undefined) {
    if (!test) return "result";  
    if (test["valueskeys"] && test["valueskeys"] === true) 
      return `COALESCE("result"-> 'valueskeys', "result"-> 'value')${test && test["as"] === true ? ` AS "result"`: ''}`;
    if (test["numeric"] && test["numeric"] === true)
      return`CASE 
      WHEN jsonb_typeof("result"-> 'value') = 'number' THEN ("result"->>'value')::numeric 
      WHEN jsonb_typeof("result"-> 'value') = 'array' THEN ("result"->>'value')[0]::numeric 
      END${test && test["as"] === true ? ` AS "result"`: ''}`;
    return `COALESCE("result"->'quality', "result"->'value')${test && test["as"] === true ? ` AS "result"`: ''}`;
  }