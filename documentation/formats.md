# [STEAN](./documentation.md)

- [format JSON](#json)
- [format CSV](#csv)
- [format txt](#txt)
- [format dataArray](#dataarray)
- [format GeoJSON](#geojson)
- [format sql](#sql)
- [format graph ](#graph )
- [format graphDatas ](#graphdatas )

## json :

http://rootApi/Things Le format natif par default de l'API

```JSON
{
  "@iot.count": 2,
  "value": [
    {
      "@iot.selfLink": "http://rootApi/Things(1)",
      "@iot.id": 1,
      "name": "Outlet Exutoire",
      "description": "Exutoire du bassin versant de Kervidy",
      "properties": {
        "image": ""
      },
      "Locations@iot.navigationLink": "http://rootApi/Things(1)/Locations",
      "HistoricalLocations@iot.navigationLink": "http://rootApi/Things(1)/HistoricalLocations",
      "Datastreams@iot.navigationLink": "http://rootApi/Things(1)/Datastreams",
      "MultiDatastreams@iot.navigationLink": "http://rootApi/Things(1)/MultiDatastreams"
    },
    {
      "@iot.selfLink": "http://rootApi/Things(2)",
      "@iot.id": 2,
      "name": "Station Meteo Toullo",
      "description": "Station meteorologique du bassin versant de Naizin",
      "properties": {
        "image": ""
      },
      "Locations@iot.navigationLink": "http://rootApi/Things(2)/Locations",
      "HistoricalLocations@iot.navigationLink": "http://rootApi/Things(2)/HistoricalLocations",
      "Datastreams@iot.navigationLink": "http://rootApi/Things(2)/Datastreams",
      "MultiDatastreams@iot.navigationLink": "http://rootApi/Things(2)/MultiDatastreams"
    }
  ]
}
```

## csv :

Le format CSV qui dans stean est totalement gérér c'est a dire qu'un appel de type :

http://rootApi/Things?$resultFormat=csv

```CSV
@iot.id;name;description;properties
1;Outlet Exutoire;Exutoire du bassin versant de Kervidy;"{""image"": """"}"
2;Station Meteo Toullo;Station meteorologique du bassin versant de Naizin;"{""image"": """"}"
```

http://rootApi/Things(1)/Locations?$resultFormat=csv

http://rootApi/Things(1)/Locations?$resultFormat=csv

sont possible

## txt :

http://rootApi/Things?$resultFormat=txt renvoi le resultat au format texte

## dataarray :

http://rootApi/Things?$resultFormat=dataArray renvoi le resultat au forma dataArray

```JSON
{
  "@iot.count": 2,
  "value": [
    {
      "components": [
        "description",
        "@iot.id",
        "name",
        "properties"
      ],
      "dataArray": [
        [
          "Exutoire du bassin versant de Kervidy",
          1,
          "Outlet Exutoire",
          "{\"image\": \"\"}"
        ],
        [
          "Station meteorologique du bassin versant de Naizin",
          2,
          "Station Meteo Toullo",
          "{\"image\": \"\"}"
        ]
      ]
    }
  ]
}
```

## geojson :

http://localhost:8029/agrhys/v1.1/Locations?$resultFormat=GeoJSON

Si l'entité selectionné contiens une proprieté GeoJSON le resultat retourne toutes le valeurs GeoJSON

```JSON
{
  "type": "FeatureCollection",
  "features": [
    {
      "geometry": {
        "type": "Point",
        "coordinates": [
          -2.831291,
          48.0057694
        ]
      }
    },
    {
      "geometry": {
        "type": "Point",
        "coordinates": [
          -2.8163832,
          48.0051729
        ]
      }
    }
  ]
}
```

si vous le faites dans le Query vous avez une icone qui apparait permetant d'ouvrir les points dans geojson.io permetant ainsi de verifier les points geographiques :

![geoJson](../assets/images/geoJson.jpg "geoJson")


## sql :

Renvoi la requête SQL généré par la requête, cette option a un intérêt uniquement avec le Query car vous pouvez éditez la requête et l'encoder le Query vous créera une url encodé reconnu par l'api (utile lors de la mise en œuvre d'interface avec des requêtes spécifiques voir des mises en forme particulières)


## graph :

Renvoi le resultat sous forme de graph avec une generation des données coté serveur donnant ainsi une rapidite d'affichage tres poussé

https://rootApi/Datastreams(1)/Observations?$resultFormat=graph permet d'avoir le graph du datastream 1

![graph](../assets/images/graph.jpg "graph") 

https://rootApi/Datastreams(3:9)/Observations?$resultFormat=graph permet d'avoir en superposition (les datastreams 1 **à** 9)

![graph](../assets/images/graphSuperpose.jpg "graph")

https://rootApi/Datastreams(3,9)/Observations?$resultFormat=graph permet d'avoir en superposition (les datastreams 1 **et** 9)

bien évidement cela marche pour le multiDatasream :

https://rootApi/MultiDatastreams(3)/Observations?$resultFormat=graph
![graph](../assets/images/graphMultiDatastream.jpg "graph")

et aussi en superposition :
https://rootApi/MultiDatastreams(3,4)/Observations?$resultFormat=graph

![graph](../assets/images/graphMultiDatastreamSuperpose.jpg "graph")

## graphdatas :

Renvoi le resultat sous forme de données pour dyGraph natif

https://dygraphs.com/