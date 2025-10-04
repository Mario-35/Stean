/**
 * Index Queries.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export { createIdList } from "./createIdList";
export { asDataArray } from "./asDataArray";
export { asJson } from "./asJson";
export { asGeoJSON } from "./asGeoJSON";
export { graphDatastream } from "./graphDatastream";
export { graphMultiDatastream } from "./graphMultiDatastream";
export { interval } from "./interval";
export { multiDatastreamFromDeveui } from "./multiDatastreamFromDeveui";
export { multiDatastreamKeys } from "./multiDatastreamKeys";
export { multiDatastreamsUnitsKeys } from "./multiDatastreamsUnitsKeys";
export { streamFromDeveui } from "./streamFromDeveui";
export { resultKeys } from "./resultKeys";
export { multiDatastreamUoM } from "./multiDatastreamUoM";
export const createExtension = (name: string): string => `CREATE EXTENSION IF NOT EXISTS ${name}`;
export const createTableService = `CREATE TABLE public.services ( "name" text NOT NULL, "datas" jsonb NULL, CONSTRAINT services_unik_name UNIQUE (name) ); CREATE INDEX services_name ON public.services USING btree (name);`;
export const drop = (table: string): string => `DROP TABLE "${table}";`;
export const createTrigger = (table: string, triggerName: string): string =>
    `CREATE TRIGGER "${table}_${triggerName}" BEFORE INSERT OR DELETE ON "${table}" FOR EACH ROW EXECUTE PROCEDURE ${triggerName}();`;
export const dropTrigger = (table: string, triggerName: string): string => `DROP TRIGGER IF EXISTS "${table}_${triggerName}" ON "${table}";`;
export const asCsv = (sql: string, csvDelimiter: ";" | ","): string => `COPY (${sql}) TO STDOUT WITH (FORMAT CSV, NULL "NULL", HEADER, DELIMITER '${csvDelimiter}')`;
