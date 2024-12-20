/**
 * multiDatastreamsUnitsKeys.
*
* @copyright 2020-present Inrae
* @author mario.adam@inrae.fr
*
*/
export const multiDatastreamsUnitsKeys = (searchId: bigint | string): string => 
`SELECT 
    jsonb_agg(tmp.units -> 'name') AS keys 
FROM (
  SELECT 
    jsonb_array_elements("unitOfMeasurements") AS units 
  FROM 
    "multidatastream" 
  WHERE 
    id = ${searchId}
) AS tmp`;