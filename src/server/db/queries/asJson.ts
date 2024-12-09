/**
 * asJson.
 *
 * @copyright 2020-present Inrae
 * @review 29-10-2024
 * @author mario.adam@inrae.fr
 *
 */
export const asJson = (input: { query: string; singular: boolean; count: boolean; strip: boolean ; fullCount?: string; fields?:  string[]; }): string =>
  input.query.trim() === ""
    ? ""
    : `SELECT ${ input.count == true 
      ? `${input.fullCount 
          ? `(${input.fullCount})` 
          : "COUNT(t)"},\n\t` 
      : "" }${input.fields 
        ? input.fields.join(",\n\t") 
        : ""}COALESCE(${ input.singular === true 
          ? "ROW_TO_JSON" 
          : `${input.strip === true ? "JSON_STRIP_NULLS(" : "" } JSON_AGG` }(t)${input.strip === true ? ")" : "" }, '${ input.singular === true 
            ? "{}" 
            : "[]" }') AS results\n\tFROM (\n\t${input.query}) AS t`;