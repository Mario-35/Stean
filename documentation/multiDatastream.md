# [STEAN](./documentation.md)

## multiDatastream

![STA](../assets/images/drawio_STA_V1.1multiDatastream.jpg "STA")

MultiDatastream permet de stocker des observations un peu plus complexe. Il est tres approprié dans le cas ou un capteur enregistre la temperature et le niveau par exemple les deux valeurs peuvent être stocker dans la même observation ce qui est le cas physiquement.

STEAN gère parfaitement le multidatastream et en assoupli l'utilisation :

- La norme impose que value one et value two soit dans l'ordre ce qui est absurde en soit l'API sera dans la capacité de les enregistrer dans le bon ordre ce qui évite beaucoup de soucis d'interprétation.

- Si le resultTime n'est pas transmis la valeur du phenomenonTime lui sera attribué.


```JSON
{
    "phenomenonTime": "2017-02-07T18:02:00.000Z",
    "resultTime": "2017-02-07T18:02:05.000Z",
    "result": {
        "Value one": 10.1,
        "Value two": 10.2
    },
    "FeatureOfInterest": { "@iot.id": 2 }
}
```

- Deux mots clés non présent dans la norme permet d'afficher les propriétés du result des observations :
http://localhost:8029/test/v1.1/MultiDatastreams(1)/Observations

voila la version classique et donc compatible avec tous les clients STA

```JSON
{
  "@iot.count": 12,
  "value": [
    {
      "@iot.selfLink": "http://localhost:8029/test/v1.1/Observations(13)",
      "@iot.id": 13,
      "phenomenonTime": "2023-03-01T04:30:01+01:00",
      "result": [
        20,
        0
      ],
      "resultTime": "2023-03-01T04:30:01+01:00",
      "resultQuality": null,
      "validTime": null,
      "parameters": null,
      "Datastream@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/Datastream",
      "MultiDatastream@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/MultiDatastream",
      "FeatureOfInterest@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/FeatureOfInterest"
    }
  ]
}
```


- Voila une des version enhanced de STEAN afin d'afficher le result avec ses propriétés avec **valuesKeys** :
http://localhost:8029/test/v1.1/MultiDatastreams(1)/Observations?$valuesKeys=true

```JSON
{
  "@iot.count": 2,
  "value": [
    {
      "@iot.selfLink": "http://localhost:8029/test/v1.1/Observations(13)",
      "@iot.id": 13,
      "phenomenonTime": "2023-03-01T04:30:01+01:00",
      "result": {
        "Unit one of classic": 20,
        "Unit two of classic": 0
      },
      "resultTime": "2023-03-01T04:30:01+01:00",
      "resultQuality": null,
      "validTime": null,
      "parameters": null,
      "Datastream@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/Datastream",
      "MultiDatastream@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/MultiDatastream",
      "FeatureOfInterest@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/FeatureOfInterest"
    }
  ]
}
```

- Ainsi que la version avec les propriétés du result dans le corps du retour avec **splitResult=all** :
http://localhost:8029/test/v1.1/MultiDatastreams(1)/Observations?$splitResult=all

```JSON
{
  "@iot.count": 12,
  "value": [
    {
      "@iot.selfLink": "http://localhost:8029/test/v1.1/Observations(13)",
      "@iot.id": 13,
      "phenomenonTime": "2023-03-01T04:30:01+01:00",
      "resultTime": "2023-03-01T04:30:01+01:00",
      "resultQuality": null,
      "validTime": null,
      "parameters": null,
      "Unit one of classic": 20,
      "Unit two of classic": 0,
      "Datastream@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/Datastream",
      "MultiDatastream@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/MultiDatastream",
      "FeatureOfInterest@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/FeatureOfInterest"
    }
  ]
}
```
- Enfin il est possible de préciser une clé **splitResult="Unit one of classic"** afin d'avoir un retour "result".
http://localhost:8029/test/v1.1/MultiDatastreams(1)/Observations?$debug=true&$splitResult=%22Unit%20one%20of%20classic%22


```JSON
{
  "@iot.count": 12,
  "value": [
    {
      "@iot.selfLink": "http://localhost:8029/test/v1.1/Observations(13)",
      "@iot.id": 13,
      "phenomenonTime": "2023-03-01T04:30:01+01:00",
      "resultTime": "2023-03-01T04:30:01+01:00",
      "resultQuality": null,
      "validTime": null,
      "parameters": null,
      "result": 20,
      "Datastream@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/Datastream",
      "MultiDatastream@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/MultiDatastream",
      "FeatureOfInterest@iot.navigationLink": "http://localhost:8029/test/v1.1/Observations(13)/FeatureOfInterest"
    }
  ]
}
```




