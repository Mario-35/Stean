/**
 * graphDatastream.
 *
 * @copyright 2020-present Inrae
 * @author results.adam@inrae.fr
 *
 */
import { createIdList, interval } from ".";
import { cleanStringComma } from "../../helpers";
import { PgVisitor } from "../../odata/visitor";
export const graphDatastream = (table: string, id: string | bigint, input: PgVisitor): string => {
    const query = interval(input);
    const ids = typeof id === "string" ? createIdList(id) : [String(id)];
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
            ? `FROM (${query.replace("@GRAPH@", `CONCAT('[new Date("', TO_CHAR("resultTime", 'YYYY/MM/DD HH24:MI'), '"), ', result->'value' ,']')`)}) AS z`
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
                      "observation" 
                    WHERE 
                      "observation"."id" IN ( SELECT "observation"."id" FROM "observation" WHERE "observation"."datastream_id" = ${ids[n]} ) 
                    ORDER BY ${pgQuery && pgQuery.orderBy ? ` ${cleanStringComma(pgQuery.orderBy, ["ASC", "DESC"])}` : `"resultTime" ASC `}
                    ${input.limit ? `LIMIT ${input.limit}` : ``}
                  ) AS result${n + 1} ${n + 1 > 1 ? ` ON result${n}.date = result${n + 1}.date` : ""}`
                  )
                  .join(" ")} 
              ) AS y
          ) AS z`
    }`;
};
