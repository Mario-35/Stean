
/**
 * multiDatastreamKeys.
*
* @copyright 2020-present Inrae
* @author mario.adam@inrae.fr
*
*/

export const multiDatastreamKeys = (inputID: bigint | string) => 
`SELECT 
    jsonb_agg(tmp.units -> 'name') AS keys 
FROM 
    (
        SELECT 
            jsonb_array_elements("unitOfMeasurements") AS units 
        FROM 
            "multidatastream" 
        WHERE 
            id = ${inputID}
    ) AS tmp`;
