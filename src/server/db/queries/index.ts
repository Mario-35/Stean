/**
 * Index Queries.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant, EDataType } from "../../enums";
import { cleanStringComma, doubleQuotes, escapeSimpleQuotes, formatPgString, simpleQuotes } from "../../helpers";
import { DECODER, LORA, USER } from "../../models/entities";
import { PgVisitor, RootPgVisitor } from "../../odata/visitor";
import { Id } from "../../types";

class Queries {
    creatdeDB(name: string) {
        return `CREATE DATABASE ${name};`;
    }

    terminate(name: string) {
        return `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = '${name}';`;
    }
    dropDB(name: string) {
        return `DROP DATABASE IF EXISTS ${name};`;
    }
    insertConfig(name: string, datas: any) {
        return `INSERT INTO public.services ("name", "datas") VALUES('${name}', ${datas}) ON CONFLICT (name) DO UPDATE SET datas = ${datas};`;
    }

    updateConfig(name: string, datas: any) {
        return `UPDATE public.services SET "datas" = ${datas} WHERE "name" = '${name}';`;
    }

    deleteConfig(name: string) {
        return `DELETE FROM public.services WHERE "name" = '${name}';`;
    }

    logsAndTriggers(status: boolean) {
        return `SET session_replication_role = ${status === true ? "DEFAULT" : "replica"};`;
    }

    deleteFromId(table: string, id: Id | string) {
        return id ? `DELETE FROM "${table}" WHERE "id" = ${id} RETURNING id` : "";
    }

    getIdFromName(table: string, name: string) {
        return `SELECT id FROM "${table}" WHERE "name" = '${name}'`;
    }

    addNbToTable(table: string) {
        return `ALTER TABLE IF EXISTS "${table}" ADD COLUMN IF NOT EXISTS _nb BIGINT NULL;`;
    }

    updateNb(stream: string, all: boolean) {
        return `UPDATE "observation" SET _nb = row_number FROM ( SELECT ROW_NUMBER() OVER ( PARTITION BY ${stream}_id ORDER BY "phenomenonTime" ), id FROM "observation" WHERE ${stream}_id IS NOT NULL ) i WHERE "observation".id = i.id${
            all === true ? "" : " AND _nb IS NULL"
        };`;
    }

    logLevel(level: string) {
        return `SET client_min_messages TO ${level};`;
    }

    createExtension(name: string) {
        return `CREATE EXTENSION IF NOT EXISTS ${name}`;
    }
    drop(table: string) {
        return `DROP TABLE "${table}";`;
    }
    createTableService() {
        return `CREATE TABLE public.services ( "name" text NOT NULL, "datas" jsonb NULL, CONSTRAINT services_unik_name UNIQUE (name) ); CREATE INDEX services_name ON public.services USING btree (name);`;
    }
    createRole(name: string, password: string) {
        return `CREATE ROLE ${name} WITH PASSWORD '${password}' ${this.rights()}`;
    }

    rights() {
        return "SUPERUSER CREATEDB NOCREATEROLE INHERIT LOGIN NOREPLICATION NOBYPASSRLS CONNECTION LIMIT -1";
    }

    updateRole(name: string, password: string) {
        return `ALTER ROLE ${name} WITH PASSWORD '${password}' ${this.rights()}`;
    }

    countUser(name: string) {
        return `SELECT COUNT(*) FROM pg_user WHERE usename = '${name}';`;
    }

    createTrigger(table: string, triggerName: string) {
        return `CREATE TRIGGER "${table}_${triggerName}" BEFORE INSERT OR DELETE ON "${table}" FOR EACH ROW EXECUTE PROCEDURE ${triggerName}();`;
    }
    dropTrigger(table: string, triggerName: string) {
        return `DROP TRIGGER IF EXISTS "${table}_${triggerName}" ON "${table}";`;
    }
    asCsv(sql: string, csvDelimiter: ";" | ",") {
        return `COPY (${sql}) TO STDOUT WITH (FORMAT CSV, NULL "NULL", HEADER, DELIMITER '${csvDelimiter}')`;
    }
    asJson(input: { query: string; singular: boolean; count: boolean; strip: boolean; fullCount?: string; fields?: string[] }) {
        return input.query.trim() === ""
            ? ""
            : `SELECT ${input.count == true ? `${input.fullCount ? `(${input.fullCount})` : `COUNT(t) AS "${EConstant.count}"`},${EConstant.return}${EConstant.tab}` : ""}${
                  input.fields ? input.fields.join(`,${EConstant.return}${EConstant.tab}`) : ""
              }COALESCE(${input.singular === true ? "ROW_TO_JSON" : `${input.strip === true ? "JSON_STRIP_NULLS(" : ""} JSON_AGG`}(t)${input.strip === true ? ")" : ""}, '${
                  input.singular === true ? "{}" : "[]"
              }') AS value${EConstant.return}${EConstant.tab}FROM (${EConstant.return}${EConstant.tab}${input.query}) AS t`;
    }

    asDataArray(input: PgVisitor) {
        function castToText(colName: string) {
            colName = colName === EConstant.id ? "id" : colName;
            if (input.entity?.columns[colName])
                switch (input.entity.columns[colName].dataType) {
                    case EDataType.bigint:
                    case EDataType.smallint:
                    case EDataType.integer:
                    case EDataType.any:
                        return "";
                    default:
                        return "::text";
                }
            return "";
        }
        // create names
        const names: string[] = input.onlyRef === true ? [EConstant.selfLink] : input.toPgQuery()?.keys.map((e: string) => formatPgString(e)) || [];
        // loop subQuery
        if (input.includes)
            input.includes.forEach((include: PgVisitor) => {
                if (include.entity) names.push(include.entity.singular);
            });
        // Return SQL query
        return this.asJson({
            query: `SELECT (ARRAY[${EConstant.newline}\t${names
                .map((e: string) => simpleQuotes(escapeSimpleQuotes(e)))
                .join(`,${EConstant.newline}\t`)}]) AS "components", JSONB_AGG(allkeys) AS "dataArray" FROM (SELECT JSON_BUILD_ARRAY(${EConstant.newline}\t${names
                // .map((e: string) => doubleQuotes(e))
                .map((e: string) => `${doubleQuotes(e)}${castToText(e)}`)
                .join(`,${EConstant.newline}\t`)}) AS allkeys ${EConstant.return}${EConstant.tab}FROM (${input.toString()}) AS p) AS l`,
            singular: false,
            strip: false,
            count: true
        });
    }

    asGeoJSON(input: PgVisitor) {
        return `SELECT JSONB_BUILD_OBJECT(
        'type', 
        'FeatureCollection', 
        'features', 
        (${this.asJson({
            query: input.toString(),
            singular: false,
            strip: false,
            count: false
        })})) AS value;`;
    }

    createIdList(input: string): string[] {
        let result: string[] = [];
        if (input.includes(":")) {
            const f = input.split(":");
            for (let g = +f[0]; g <= +f[1]; g++) {
                result.push(String(g));
            }
        } else if (input.includes(",")) {
            result = input.split(",");
        } else result.push(String(input));
        return result.filter((e) => e.trim() != "");
    }

    interval(input: PgVisitor): string {
        return input.interval
            ? `WITH src as (
    ${input.toString()}
), 
range_values AS (
    SELECT 
        min(srcdate) as minval, 
        max(srcdate) as maxval 
    FROM 
        src
), 
time_range AS (
    SELECT 
        generate_series( minval :: timestamp, maxval :: timestamp, '${input.interval || "1 day"}' :: interval ):: TIMESTAMP WITHOUT TIME ZONE as step 
    FROM 
        range_values
) 
SELECT 
    ${input.intervalColumns ? input.intervalColumns.filter((e) => e != "").join(", ") : ""} 
FROM 
    src RIGHT JOIN time_range on srcdate = step`
            : input.toString();
    }

    graphDatastream(table: string, id: number | string | bigint, input: PgVisitor): string {
        const query = this.interval(input);
        const ids = typeof id === "string" ? this.createIdList(id) : [String(id)];
        const pgQuery = input.toPgQuery();
        return `SELECT ( 
                SELECT 
                  CONCAT( description, '|', "unitOfMeasurement" ->> 'name', '|', "unitOfMeasurement" ->> 'symbol' ) 
                FROM "${table}"
                  WHERE id = ${ids[0]} 
               ) AS infos, 
        STRING_AGG(concat, ',') AS datas 
        ${
            ids.length === 1
                ? `FROM (${query.replace("@GRAPH@", `CONCAT('[new Date("', TO_CHAR("resultTime", 'YYYY/MM/DD HH24:MI'), '"), ', "result"${input.ctx._.service._numeric ? '' : `->'value'`} ,']')`)}) AS z`
                : ` FROM (
                SELECT CONCAT( '[new Date("', TO_CHAR( date, 'YYYY/MM/DD HH24:MI' ), '"), ', ${ids.map((e, n) => `coalesce(y.res${n + 1},'null'),','`)}, ']' ) 
                  FROM (
                    SELECT 
                      DISTINCT COALESCE( ${ids.map((e, n) => `result${n + 1}.date`).join(",")} ) AS date, 
                      ${ids.map((e, n) => `COALESCE( result${n + 1}.res :: TEXT, 'null' ) AS res${n + 1}`).join(",")} FROM ${ids
                      .map(
                          (e, n) => `${n + 1 > 1 ? "FULL JOIN " : ""}
                      (
                        SELECT 
                          round_minutes("resultTime", 15) AS date, 
                          ${ids
                              .filter((e: string) => +e !== n + 1)
                              .map((e, n) => `null AS res${n + 1}`)
                              .join(",")}, 
                          result -> 'value' AS res 
                        FROM 
                          "datastream_id${ids[n]}"  
                        ORDER BY ${pgQuery && pgQuery.orderBy ? ` ${cleanStringComma(pgQuery.orderBy, ["ASC", "DESC"])}` : `"resultTime" ASC `}
                        ${input.limit ? `LIMIT ${input.limit}` : ``}
                      ) AS result${n + 1} ${n + 1 > 1 ? ` ON result${n}.date = result${n + 1}.date` : ""}`
                      )
                      .join(" ")} 
                  ) AS y
              ) AS z`
        }`;
    }

    graphMultiDatastream(table: string, id: string | bigint, input: PgVisitor): string {
        const query = this.interval(input);
        const ids = typeof id === "string" ? this.createIdList(id) : [String(id)];
        const pgQuery = input.toPgQuery();
        return ids.length === 1
            ? `WITH 
          src AS (
            SELECT 
              id, 
              description, 
              jsonb_array_elements("unitOfMeasurements")->>'name' AS name, 
              jsonb_array_elements("unitOfMeasurements")->>'symbol' AS symbol 
            FROM 
            (SELECT * FROM ${table} WHERE id = ${id} ) AS l
          ),  
          results AS (
            SELECT 
              src.id, 
              src.description, 
              src.name, 
              src.symbol, 
              (
                SELECT 
                  STRING_AGG(concat, ',') AS datas 
                FROM (
                    ${query.replace(
                        "@GRAPH@",
                        `CONCAT('[new Date("', round_minutes("resultTime", 5), '"), ', result->'value'->(select array_position(array(select jsonb_array_elements("unitOfMeasurements")->> 'name' FROM ( SELECT * FROM ${table} WHERE id = ${id} ) AS l), src.name)-1),']')`
                    )}
                    ) AS nop )
            FROM 
              "multidatastream" 
            INNER JOIN src ON multidatastream.id = src.id
          ) 
          SELECT * FROM results ${input.splitResult ? `WHERE name in ('${input.splitResult.join(EConstant.simpleQuotedComa)}')` : ``}`
            : `WITH 
      src AS (
        SELECT 
          id, 
          description, 
          jsonb_array_elements("unitOfMeasurements")->> 'name' AS name, 
          jsonb_array_elements("unitOfMeasurements")->> 'symbol' AS symbol 
        FROM 
        ( SELECT * FROM ${table} WHERE id = ${ids[0]} ) AS l
      ), 
      results AS (
        SELECT 
          src.id, 
          src.description, 
          src.name, 
          src.symbol, 
          (
            SELECT 
              STRING_AGG(concat, ',') AS datas 
            FROM 
              (
                SELECT 
                  CONCAT(
                    '[new Date("', 
                    TO_CHAR(date, 'YYYY/MM/DD HH24:MI'), 
                    '"), ', 
                    ${ids.map((e, n) => `coalesce(y.res${n + 1},'null'),','`)}, 
                    ']'
                  ) 
                FROM 
                  (
                    SELECT 
                      distinct COALESCE(
                        ${ids.map((e, n) => `result${n + 1}.date`).join(",")}
                      ) AS date, 
                      ${ids
                          .map(
                              (e, n) => `COALESCE(
                        result${n + 1}.res :: TEXT, 'null'
                      ) AS res${n + 1}`
                          )
                          .join(",")} 
                    FROM ${ids
                        .map(
                            (e, n) => `${n + 1 > 1 ? "FULL JOIN " : ""}
                    (
                      SELECT 
                        round_minutes("resultTime", 15) as date, 
                        ${ids
                            .filter((e: string) => +e !== n + 1)
                            .map((e, n) => `null as res${n + 1}`)
                            .join(",")} ,
                        result -> 'value' ->(
                          select 
                            array_position(
                              array(
                                select jsonb_array_elements("unitOfMeasurements")->> 'name' FROM ( SELECT * FROM multidatastream WHERE id = ${ids[n]} ) as one
                              ), src.name
                            )-1
                        ) as res
                      FROM 
                        "observation" 
                      WHERE 
                        "observation"."id" in (
                          SELECT 
                            "observation"."id" 
                          from 
                            "observation" 
                          WHERE 
                            "observation"."multidatastream_id" = ${ids[n]}
                        ) 
                      ORDER BY ${pgQuery && pgQuery.orderBy ? ` ${cleanStringComma(pgQuery.orderBy, ["ASC", "DESC"])}` : `"resultTime" ASC `}
                        ${input.limit ? `LIMIT ${input.limit}` : ``}
                    ) as result${n + 1} ${n + 1 > 1 ? ` ON result${n}.date = result${n + 1}.date` : ""}`
                        )
                        .join(" ")} 
                  ) As y
              ) AS z
          ) 
        FROM 
          "multidatastream" 
          INNER JOIN src ON multidatastream.id = src.id
      ) 
      SELECT * FROM results`;
    }

    streamFromDeveui(stream: string, input: string): string {
        return `SELECT 
            "lorastream"."${stream}_id" 
          FROM 
            "lorastream" 
          WHERE 
            "lorastream"."lora_id" = (SELECT id FROM "lora" WHERE deveui = '${input}')`;
    }
    multiDatastreamFromDeveui(input: string): string {
        return `(SELECT jsonb_agg(tmp.units -> 'name') AS keys FROM ( SELECT jsonb_array_elements("unitOfMeasurements") AS units ) AS tmp ) FROM "multidatastream" WHERE "multidatastream".id = (${this.streamFromDeveui(
            "multidatastream",
            input
        )})`;
    }

    multiDatastreamKeys(inputID: Id | string) {
        return `SELECT jsonb_agg(tmp.units -> 'name') AS keys FROM ( SELECT jsonb_array_elements("unitOfMeasurements") AS units FROM "multidatastream" WHERE id = ${inputID} ) AS tmp`;
    }

    streamInfosFromDeveui(input: string): string {
        return `WITH multidatastream AS (
  SELECT 
    JSON_AGG(t) AS multidatastream 
  FROM 
    (
      SELECT 
        id AS multidatastream, 
        id, 
        _default_featureofinterest, 
        thing_id, 
        (
          SELECT 
            JSONB_AGG(tmp.units -> 'name') AS keys 
          FROM 
            (
              SELECT 
                JSONB_ARRAY_ELEMENTS("unitOfMeasurements") AS units
            ) AS tmp
        ) 
      FROM 
        "multidatastream" 
      WHERE 
        "multidatastream".id = (${this.streamFromDeveui("multidatastream", input)}
        )
    ) AS t
), 
datastream AS (
  SELECT 
    json_agg(t) AS datastream 
  FROM 
    (
      SELECT 
        id AS datastream, 
        id, 
        _default_featureofinterest, 
        thing_id, 
        '{}' :: jsonb AS keys 
      FROM 
        "datastream"
      WHERE 
        "datastream".id = (${this.streamFromDeveui("datastream", input)}
        )
    ) AS t
) 
SELECT 
  datastream.datastream, 
  multidatastream.multidatastream 
FROM 
  multidatastream, 
  datastream
`;
    }
    multiDatastreamsUnitsKeys(searchId: Id | string): string {
        return `SELECT jsonb_agg(tmp.units -> 'name') AS keys FROM ( SELECT jsonb_array_elements("unitOfMeasurements") AS units FROM "multidatastream" WHERE id = ${searchId} ) AS tmp`;
    }

    multiDatastreamUoM(input: RootPgVisitor) {
        return `SELECT jsonb_agg(tmp.units -> 'name') AS keys FROM ( SELECT jsonb_array_elements("unitOfMeasurements") AS units FROM "multidatastream" WHERE id = ${input.parentId} ) AS tmp `;
    }

    resultKeys(column: string, input: RootPgVisitor): string {
        return `SELECT DISTINCT JSONB_OBJECT_KEYS(${column}) AS k FROM "observation" WHERE JSONB_TYPEOF(${column}) LIKE 'object' AND "observation"."id" IN ( SELECT "observation"."id" FROM "observation" WHERE "observation"."${input.parentEntity?.table}_id" = ${input.parentId} )`;
    }

    testId(table: string, id: Id | string): string {
        return `SELECT CASE WHEN EXISTS( SELECT 1 FROM "${table}" WHERE "id" = ${id} ) THEN ( SELECT "id" FROM "${table}" WHERE "id" = ${id} ) END AS "id"`;
    }

    getDecoder(filter?: string) {
        return `SELECT "id", "name", "code", "nomenclature", "synonym" FROM "${DECODER.table}"${filter ? ` WHERE ${filter}` : ""}`;
    }
    getDecoderFromDeveui(deveui: string) {
        return this.getDecoder(` id = (SELECT "decoder_id" FROM "${LORA.table}" WHERE "deveui" = '${deveui}') LIMIT 1`);
    }

    countAll() {
        return `SELECT JSON_AGG(t) AS results FROM ( select table_name, ( xpath( '/row/c/text()', query_to_xml( format( 'select count(*) AS c from %I.%I', table_schema, table_name ), false, true, '' ) ) ) [1] :: text :: int AS count from information_schema.tables where table_name IN ( SELECT (inhrelid :: regclass):: text AS child FROM pg_catalog.pg_inherits WHERE inhparent = 'observation' :: regclass OR inhparent = 'datastream_id0' :: regclass ) order by count DESC ) AS t `;
    }

    listPartionned() {
        return `SELECT array_agg(table_name) from information_schema.tables where table_name IN ( SELECT (inhrelid :: regclass):: text AS child FROM pg_catalog.pg_inherits WHERE inhparent = 'observation' :: regclass OR inhparent = 'datastream_id0' :: regclass )`;
    }

    getDate() {
        return "SELECT current_timestamp;";
    }

    count(table: string, what?: string) {
        return `SELECT COUNT("${what || "*"}")::int FROM "${table}";`;
    }

    last(table: string, what?: string) {
        return `SELECT "${what || "*"}" FROM "${table}" ORDER BY "${what || "*"}" DESC LIMIT 1`;
    }

    getUser(name: string) {
        return `SELECT "username" FROM "${USER.table}" WHERE username = '${name}' LIMIT 1`;
    }
    getFromIdOrName(table: string, column: string, test: any) {
        return `SELECT "${column}" FROM "${table}" WHERE ${test[EConstant.id] ? `id=${test[EConstant.id]}` : test[EConstant.name] ? `name='${test[EConstant.name]}'` : "ERROR"}`;
    }

    cluster(table: string) {
        return `CLUSTER ${table} USING "${table}_nb";`;
    }

    toNumeric() {
        return `ALTER TABLE observation ADD COLUMN resulte numeric;
                UPDATE observation SET resulte = (result->>'value')::numeric WHERE multidatastream_id IS NULL;
                ALTER TABLE observation DROP COLUMN result;
                ALTER TABLE observation RENAME COLUMN resulte TO result;`;
    }

    createClusterIndex(table: string) {
        return `CREATE UNIQUE INDEX IF NOT EXISTS "${table}_nb" on ${table} (_nb);`;
    }

    extensions( ) {
      return  `SELECT 
                (SELECT to_regclass('public.lora') IS NOT NULL) as Lora,
                (SELECT to_regclass('public.multidatastream') IS NOT NULL) as multidatastream,
                (SELECT to_regclass('public.datastream_id0') IS not NULL) as partitioned,
                (SELECT pg_typeof(result)::text FROM observation limit 1) = 'numeric' AS numeric,
                (SELECT count(*) FROM pg_catalog.pg_constraint con INNER JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid INNER JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace WHERE nsp.nspname = 'public' AND rel.relname = 'thing' AND con.conname LIKE '%name%') = 1 as unique
                `;
    }

}
export const queries = new Queries();
