/**
 * multiDatastreamFromDeveui.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- multiDatastreamFromDeveui. -----------------------------------!");
export const multiDatastreamFromDeveui = ( input: string ): string => 
`(SELECT 
      jsonb_agg(tmp.units -> 'name') AS keys 
    FROM 
      ( SELECT jsonb_array_elements("unitOfMeasurements") AS units ) AS tmp
  ) 
  FROM 
    "multidatastream" 
  WHERE 
    "multidatastream".id = ( SELECT "lora"."multidatastream_id" FROM "lora" WHERE "lora"."deveui" = '${input}' )`;
