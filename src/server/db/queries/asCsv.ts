/**
 * asCsv.
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author formatPgString.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- asCsv -----------------------------------!\n");

export const asCsv = (sql: string): string => 
`COPY (
    ${sql}
) TO STDOUT WITH (FORMAT CSV, NULL "NULL", HEADER, DELIMITER ';')`;
  