/**
 * asCsv.
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author formatPgString.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- asCsv. -----------------------------------!");

export const asCsv = (sql: string): string => `COPY (
  ${sql}
  ) to stdout WITH (FORMAT CSV, NULL "NULL", HEADER, DELIMITER ';')`;
  