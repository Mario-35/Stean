/**
 * streamFromDeveui.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
export const streamFromDeveui = ( input: string ): string => 
`WITH multidatastream AS (
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
        "multidatastream".id = (
          SELECT 
            "lora"."multidatastream_id" 
          FROM 
            "lora" 
          WHERE 
            "lora"."deveui" = '${input}'
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
        "datastream".id = (
          SELECT 
            "lora"."datastream_id" 
          FROM 
            "lora" 
          WHERE 
            "lora"."deveui" = '${input}'
        )
    ) AS t
) 
SELECT 
  datastream.datastream, 
  multidatastream.multidatastream 
FROM 
  multidatastream, 
  datastream`;

