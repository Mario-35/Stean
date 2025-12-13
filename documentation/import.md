Creation d'un flux complet :

http://rootApi/Datastreams 

```JSON
{
    "name": "Datastream Test",
    "description": "New Datastream For testing importation",
    "unitOfMeasurement": {
        "name": "Test Degree Celsius",
        "symbol": "°C",
        "definition": "http://unitsofmeasure.org/ucum.html#para-30"
    },
    "ObservedProperty": {
        "name": "Test Area Temperature",
        "description": "The degree or intensity of heat present in the area",
        "definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature"
    },
    "Sensor": {
        "name": "Test Sensor",
        "description": "Test temperature sensor [1]",
        "encodingType": "application/pdf",
        "metadata": "https://cdn-shop.adafruit.com/datasheets/DHT22.pdf"
    },
    "Thing": {
        "name": "Test Thing",
        "description": "Test Thing description",
        "Locations": [
            {
                "name": "Test Location name",
                "description": "Test Location description",
                "encodingType": "application/geo+json",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -3.9733716628968807,
                        48.22237203586653
                    ]
                }
            }
        ]
    }   
}
```

l'importation du fichier se fait en postant un createObservation en y attachant un fomulaire indiquant le fichier

Imaginon un fichier CSV

```CSV
TOA5;CR6;15502;;;;;;;;;
01/05/2000 09:50;13.1;20.1;16.1;NAN;46.1;NAN;-0.001;19.1;1;7999;0
07/05/2000 10:30;13.5;20.5;17.5;NAN;46.5;NAN;-0.005;19.5;5;3999;00
04/05/2000 10:20;13.4;20.4;17.4;NAN;46.4;NAN;-0.004;19.4;4;4999;0.0
03/05/2000 10:10;13.3;20.3;16.3;NAN;46.3;NAN;-0.003;19.3;3;5999;-0
02/05/2000 10:00;13.2;20.2;16.2;NAN;46.2;NAN;-0.002;19.2;2;6999;1
```

http://rootApi/CreateObservations 

```JSON
{
    "header": false, // Présence d'un entête
    "nan": true, // Possibilité d'avoir des valeurs non numériques
    "columns": {
        "1": { // Colone numero 1 (Démarre à 0)
            "Datastream": 21, // Datastream d'insertion des données
            "FeaturesOfInterest": 1 // Feature of interest d'insertion
        }
    }
}
```
Si le csv contiens plusieurs colonnes il est tout à fait possible de :

```JSON
{
    "header": true,
    "nan": true,
    "columns": {
        "1": {
            "Datastream": 1,
            "FeaturesOfInterest": 1
        },
        "2": {
            "Datastream": 4,
            "FeaturesOfInterest": 2
        }
    }
}
```

STEAN vou offre la possibilite de le faire via le query

![import](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/import_datastream.jpg "import")

