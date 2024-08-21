/**
 * entity Thing
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity Thing -----------------------------------!");

export const _idBig = "BIGINT GENERATED ALWAYS AS IDENTITY";
export const _idRel = "BIGINT NOT NULL";
export const _tz = "TIMESTAMPTZ NULL";
export function _text(def?: string): string { return `TEXT NOT NULL${def ? ` DEFAULT '${def}'::TEXT` : ''}`};
