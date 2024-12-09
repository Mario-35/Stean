/**
 * asCsv.
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author mario.adam@inrae.fr
 *
 */

export const asCsv = (sql: string, csvDelimiter: ";" | ","): string => `COPY (${sql}) TO STDOUT WITH (FORMAT CSV, NULL "NULL", HEADER, DELIMITER '${csvDelimiter}')`;
  