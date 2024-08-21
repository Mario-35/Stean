/**
 * graphMultiDatastream.
*
* @copyright 2020-present Inrae
* @author results.adam@inrae.fr
*
*/
// onsole.log("!----------------------------------- graphMultiDatastream. -----------------------------------!");
import { createIdList, interval } from ".";
import { SIMPLEQUOTEDCOMA } from "../../constants";
import { cleanStringComma } from "../../helpers";
import { PgVisitor } from "../../odata/visitor";

export const graphMultiDatastream = (table: string, id: string | bigint, input: PgVisitor): string => {
  const query = interval(input);
  const ids = (typeof id === "string" ) ? createIdList(id) : [String(id)];  
  const pgQuery = input.toPgQuery();
  return ids.length === 1 ?
  `WITH 
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
                ${ query.replace("@GRAPH@", `CONCAT('[new Date("', round_minutes("resultTime", 5), '"), ', result->'value'->(select array_position(array(select jsonb_array_elements(\"unitOfMeasurements\")->> 'name' FROM ( SELECT * FROM ${table} WHERE id = ${id} ) AS l), src.name)-1),']')`)}
                ) AS nop )
        FROM 
          "multidatastream" 
        INNER JOIN src ON multidatastream.id = src.id
      ) 
      SELECT * FROM results ${input.splitResult ? `WHERE name in ('${input.splitResult.join(SIMPLEQUOTEDCOMA)}')` :``}`
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
                ${ids.map(
                  (e,n) => `coalesce(mario.res${n+1},'null'),','`
                ) }, 
                ']'
              ) 
            FROM 
              (
                SELECT 
                  distinct COALESCE(
                    ${ids.map((e,n) => `result${n+1}.date`).join(",")}
                  ) AS date, 
                  ${ids.map((e,n)  => `COALESCE(
                    result${n+1}.res :: TEXT, 'null'
                  ) AS res${n+1}`).join(",")} 
                FROM ${ids.map((e,n) => `${(n+1) > 1 ? 'FULL JOIN ' : ''}
                (
                  SELECT 
                    round_minutes("resultTime", 15) as date, 
                    ${ids.filter((e: string) => +e !== (n+1)).map((e, n) => `null as res${n+1}`).join(",")} ,
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
                  ORDER BY ${pgQuery && pgQuery.orderBy ? ` ${cleanStringComma(pgQuery.orderBy, ["ASC","DESC"])}` : `"resultTime" ASC `}
                    ${input.limit ? `LIMIT ${input.limit}` : ``}
                ) as result${n+1} ${ (n+1) > 1 ? ` ON result${n}.date = result${n+1}.date` : '' }`).join(" ")} 
              ) As mario
          ) AS nop
      ) 
    FROM 
      "multidatastream" 
      INNER JOIN src ON multidatastream.id = src.id
  ) 
  SELECT * FROM results`;
  }

