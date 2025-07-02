/**
 * Index Models Helpers
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export { Bigint } from "./bigint";
export { Bool } from "./bool";
export { Geometry } from "./geometry";
export { Jsonb } from "./jsonb";
export { Relation } from "./relation";
export { Result } from "./result";
export { Text } from "./text";
export { Texts } from "./texts";
export { Time } from "./time";
export { Timestamp } from "./timestamp";
export { Tmperiod } from "./tmperiod";

export function formatResultColuwn(options: { numeric: boolean; as: boolean; valueskeys: boolean }) {
    return `CASE
    WHEN JSONB_TYPEOF( "result"->'value') = 'number' THEN ("result"->${options.numeric == true ? "" : ">"}'value')::jsonb
    WHEN JSONB_TYPEOF( "result"->'value') = 'array'  THEN ("result"->'${options.valueskeys == true ? "valueskeys" : "value"}')::jsonb
    ELSE ("result"->'${options.valueskeys == true ? "valueskeys" : "value"}')::jsonb
    END${options.as === true ? ' AS "result"' : ""}`;
}
