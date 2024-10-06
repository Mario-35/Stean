/**
 * Index Queries.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Index Queries -----------------------------------!\n");
export { createIdList } from "./createIdList";
export { asDataArray } from "./asDataArray";
export { asCsv } from "./asCsv";
export { asJson } from "./asJson";
export { observationResultCsv } from "./observationResultCsv";
export { asGeoJSON } from "./asGeoJSON";
export { graphDatastream } from "./graphDatastream";
export { graphMultiDatastream } from "./graphMultiDatastream";
export { interval } from "./interval";
export { multiDatastreamFromDeveui } from "./multiDatastreamFromDeveui";
export { multiDatastreamKeys } from "./multiDatastreamKeys";
export { multiDatastreamsUnitsKeys } from "./multiDatastreamsUnitsKeys";
export { streamFromDeveui } from "./streamFromDeveui";
export { testId } from "./testId";
export { resultKeys } from "./resultKeys";
export { multiDatastreamUoM } from "./multiDatastreamUoM";

export const queries = Object.freeze({
    datastreamByName : `SELECT id FROM "datastream" WHERE "name" = '@STR@' LIMIT 1`
});


