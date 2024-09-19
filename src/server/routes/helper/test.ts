/**
 * Test Helpers.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Test Helpers. -----------------------------------!");


import {   executeSqlValues } from "../../db/helpers";
import { koaContext } from "../../types";

const geo = {

	"Angers": {
		"type": "Feature",
		"properties": {
		  "name":"Angers"
		},
		"geometry": {
		  "coordinates": [
			-0.5528847276950444,
			47.46996912080425
		  ],
		  "type": "Point"
		},
		"id": 0
	  },
	  "Nantes": {
		"type": "Feature",
		"properties": {
		  "name":"Nantes"
		},
		"geometry": {
		  "coordinates": [
			-1.54241217683861,
			47.223625061665274
		  ],
		  "type": "Point"
		},
		"id": 1
	  },
	  "Vannes": {
		"type": "Feature",
		"properties": {
		  "name": "Vannes"
		},
		"geometry": {
		  "coordinates": [
			-2.7596625115984637,
			47.66493020501483
		  ],
		  "type": "Point"
		},
		"id": 2
	  },
	  "Lorient": {
		"type": "Feature",
		"properties": {
		  "name":"Lorient"
		},
		"geometry": {
		  "coordinates": [
			-3.377509239138959,
			47.74736066059859
		  ],
		  "type": "Point"
		},
		"id": 3
	  },
	  "Quimperlé":{
		"type": "Feature",
		"properties": {
		  "name":"Quimperlé"
		},
		"geometry": {
		  "coordinates": [
			-3.5551084364122687,
			47.86866728326285
		  ],
		  "type": "Point"
		},
		"id": 4
	  },
	  "Quimper":{
		"type": "Feature",
		"properties": {
		  "name":"Quimper"
		},
		"geometry": {
		  "coordinates": [
			-4.108433416883344,
			47.99535576613954
		  ],
		  "type": "Point"
		},
		"id": 5
	  },
	  "Pleyben":{
		"type": "Feature",
		"properties": {
		  "name":"Pleyben"
		},
		"geometry": {
		  "coordinates": [
			-3.9733716628968807,
			48.22237203586653
		  ],
		  "type": "Point"
		},
		"id": 6
	  },
	  "Brest":{
		"type": "Feature",
		"properties": {
		  "name":"Brest"
		},
		"geometry": {
		  "coordinates": [
			-4.478460131480347,
			48.40856811055875
		  ],
		  "type": "Point"
		},
		"id": 7
	  },
	  "Morlaix":{
		"type": "Feature",
		"properties": {
		  "name":"Morlaix"
		},
		"geometry": {
		  "coordinates": [
			-3.8573075531622294,
			48.58344913955506
		  ],
		  "type": "Point"
		},
		"id": 8
	  },
	  "Guimgamp":{
		"type": "Feature",
		"properties": {
		  "name":"Guimgamp"
		},
		"geometry": {
		  "coordinates": [
			-3.148594867800796,
			48.55556794006753
		  ],
		  "type": "Point"
		},
		"id": 9
	  },
	  "Saint-Brieuc":{
		"type": "Feature",
		"properties": {
		  "name":"Saint-Brieuc"
		},
		"geometry": {
		  "coordinates": [
			-2.7462126107293727,
			48.48952830328679
		  ],
		  "type": "Point"
		},
		"id": 10
	  },
	  "Saint-Malo":{
		"type": "Feature",
		"properties": {
		  "name":"Saint-Malo"
		},
		"geometry": {
		  "coordinates": [
			-1.9867722904692187,
			48.643104431904845
		  ],
		  "type": "Point"
		},
		"id": 11
	  },
	  "Fougères":{
		"type": "Feature",
		"properties": {
		  "name":"Fougères"
		},
		"geometry": {
		  "coordinates": [
			-1.202481228298467,
			48.35475608212215
		  ],
		  "type": "Point"
		},
		"id": 12
	  },
	  "Laval":{
		"type": "Feature",
		"properties": {
		  "name":"Laval"
		},
		"geometry": {
		  "coordinates": [
			-0.7723899516274741,
			48.072230699253026
		  ],
		  "type": "Point"
		},
		"id": 13
	  },
	  "Chateau-Gontier":{
		"type": "Feature",
		"properties": {
		  "name":"Chateau-Gontier"
		},
		"geometry": {
		  "coordinates": [
			-0.6990393387893619,
			47.83012585998793
		  ],
		  "type": "Point"
		},
		"id": 14
	  },
	  "Rennes":{
		"type": "Feature",
		"properties": {
		  "name":"Rennes"
		},
		"geometry": {
		  "coordinates": [
			-1.6567440482485551,
			48.11256463781973
		  ],
		  "type": "Point"
		},
		"id": 15
	  }
  }
export const getTest = async (ctx: koaContext): Promise<string[] | { [key: string]: any }> => {
    let result: Record<string, any> = {};
    
    const featureofinterest:Record<string, any> = await executeSqlValues(ctx.config, ` SELECT coalesce( json_agg(t), '[]') AS results FROM ( select feature as geometry FROM "featureofinterest" WHERE "feature"::text LIKE '%coordinates%' ) as t`);
    const locations:Record<string, any> = await executeSqlValues(ctx.config, `  SELECT coalesce( json_agg(t), '[]') AS results FROM ( select location as geometry FROM "location" WHERE "location"::text LIKE '%coordinates%' ) as t`);




    result["featureofinterest"] = `http://geojson.io/#data=data:application/json,${encodeURIComponent(JSON.stringify({
        "type": "FeatureCollection",
        "features": featureofinterest[0]
    }))}`;

    result["locations"] = `http://geojson.io/#data=data:application/json,${encodeURIComponent(JSON.stringify({
        "type": "FeatureCollection",
        "features": locations[0]
    }))}`;
    
	console.log({
        "type": "FeatureCollection",
        "features": locations[0]
    });
	
      
    result["geo"] = `http://geojson.io/#data=data:application/json,${encodeURIComponent(JSON.stringify({
        "type": "FeatureCollection",
        "features": Object.keys(geo).map(e => geo[e as keyof object])
    }))}`;
      

    
    return result;
}