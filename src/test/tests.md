
{ username: 'stean', password: 'stean' } 
```

{ username: 'stean', password: 'nowhere' } 
```

{ name: '[newservice]Name of the service', pg: { host: '[localhost] Postgres Host', port: '[5432] Postgres Port', user: 'Postgres username to create', password: 'Postgres password to create', database: 'Name of the database (create it if not exist)', retry: '[2] number of connection retry' }, apiVersion: '[v1.1] Model', date_format: '[DD/MM/YYYY hh:mi:ss] Date format', webSite: 'Web site', nb_page: '[200] Default pagination number', alias: [ 'name', 'Alias', [length]: 2 ], extensions: [ 'List of extensions', [length]: 1 ], options: [ 'List of options', [length]: 1 ] } 
```

{ name: 'Thing test', description: 'Create Thing inside tests', properties: { organization: 'Mozilla', owner: 'Mozilla' } } 
```

{
  name: 'Thing with new Location test',
  description: 'Create Thing with new location inside tests',
  properties: { 'Deployment Condition': 'Deployed in a third floor balcony', 'Case Used': 'Radiation shield' },
  Locations: { name: 'Saint-Malo', description: 'City of Saint-Malo', encodingType: 'application/geo+json', location: { coordinates: [ -2.7462126107293727, 48.48952830328679, [length]: 2 ], type: 'Point' } }
} 
```

{ name: 'Thing with existing Location test', description: 'Create Thing with existing location inside tests', properties: { 'Deployment Condition': 'Deployed in a third floor balcony', 'Case Used': 'Radiation shield' }, Locations: [ { '@iot.id': '1' }, [length]: 1 ] } 
```

{
  name: 'Thing with new Location & Datastream test',
  description: 'Create Thing with new location & Datastream inside tests',
  properties: { 'Deployment Condition': 'Deployed in a third floor balcony', 'Case Used': 'Radiation shield' },
  Locations: [
    { name: 'Fougères', description: 'City of Fougères', encodingType: 'application/geo+json', location: { coordinates: [ -1.9867722904692187, 48.643104431904845, [length]: 2 ], type: 'Point' } },
    [length]: 1
  ],
  Datastreams: [ { name: 'Air Temperature DS', description: 'Datastream for recording temperature', observationType: 'http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement', unitOfMeasurement: { name: 'Degree Celsius for test', symbol: 'degC', definition: 'http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeCelsius' }, ObservedProperty: { name: 'Area Temperature for test', description: 'The degree or intensity of heat present in the area', definition: 'http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature' }, Sensor: { name: '`DHT22 for test', description: 'DHT22 temperature sensor', encodingType: 'application/pdf', metadata: 'https://cdn-shop.adafruit.com/datasheets/DHT22.pdf' } }, [length]: 1 ]
} 
```

{
  description: 'Thing test For inner Post',
  name: 'Thing test For inner Post',
  properties: { reference: 'first' },
  Locations: [
    { name: 'location for Thing test', description: 'location for Thing test For inner Post', location: { coordinates: [ -3.148594867800796, 48.55556794006753, [length]: 2 ], type: 'Point' }, encodingType: 'application/geo+json' },
    [length]: 1
  ],
  Datastreams: [
    { unitOfMeasurement: { name: 'Lumen', symbol: 'lm', definition: 'http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html/Lumen' }, name: 'first datastream name', description: 'first datastream for Thing inner test', observationType: 'http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement', ObservedProperty: { name: 'Luminous Flux', definition: 'http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html/LuminousFlux', description: 'observedProperty flux' }, Sensor: { name: 'first sensor name', description: 'first sensor for Thing inner test', encodingType: 'application/pdf', metadata: 'Light flux sensor' }, Observations: [ { phenomenonTime: '2015-03-03T00:00:00Z', result: 3 }, { phenomenonTime: '2015-03-04T00:00:00Z', result: 4 }, [length]: 2 ] },
    { unitOfMeasurement: { name: 'Centigrade', symbol: 'C', definition: 'http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html/Lumen' }, name: 'second datastream name', description: 'second datastream for Thing inner test', observationType: 'http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement', ObservedProperty: { name: 'Tempretaure', definition: 'http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html/Tempreture', description: 'observedProperty second' }, Sensor: { name: 'second sensor name', description: 'second sensor for Thing inner test', encodingType: 'application/pdf', metadata: 'Tempreture sensor' }, Observations: [ { phenomenonTime: '2015-03-05T00:00:00Z', result: 5 }, { phenomenonTime: '2015-03-06T00:00:00Z', result: 6 }, [length]: 2 ] },
    [length]: 2
  ]
} 
```

{ name: 'New SensorWebThing Patch', properties: { organization: 'Mozilla', owner: 'Mozilla' } } 
```

{ name: 'New SensorWebThing back', properties: { organization: 'Mozilla', owner: 'Mozilla' }, Locations: [ { '@iot.id': 10 }, [length]: 1 ] } 
```

{ Locations: [ { '@iot.id': 2 }, [length]: 1 ] } 
```

{ name: 'Inrae - Saint-Gilles', description: 'New location test Inrae - Saint-Gilles', encodingType: 'application/geo+json', location: { coordinates: [ -1.9867722904692187, 48.643104431904845, [length]: 2 ], type: 'Point' } } 
```

{ name: 'Au Comptoir Vénitien Locations 1', description: 'Au Comptoir Vénitien', encodingType: 'application/geo+json', location: { coordinates: [ -3.148594867800796, 48.55556794006753, [length]: 2 ], type: 'Point' } } 
```

{ name: 'My Location has changed', description: 'Inrae - Site De Saint-Gilles', encodingType: 'application/geo+json', location: { type: 'Point', coordinates: [ 48.14523718972358, -1.8305352019940178, [length]: 2 ] } } 
```

{ time: '2015-02-07T19:22:11.297Z' } 
```

{ unitOfMeasurement: { symbol: 'μg/m³', name: 'PM 2.5 Particulates (ug/m3)', definition: 'http://unitsofmeasure.org/ucum.html' }, name: 'Datastream Air quality readings', description: 'New Datastream Air quality readings for test', Thing: { '@iot.id': 1 }, ObservedProperty: { '@iot.id': 1 }, Sensor: { '@iot.id': 1 } } 
```

{ unitOfMeasurement: { symbol: 'μg/m³', name: 'PM 2.5 Particulates (ug/m3)', definition: 'http://unitsofmeasure.org/ucum.html' }, name: 'Another datastream Air quality readings with default FOI', description: 'New Datastream Air quality readings with default FOI for test', Thing: { '@iot.id': 1 }, ObservedProperty: { '@iot.id': 1 }, Sensor: { '@iot.id': 1 }, FeatureOfInterest: { '@iot.id': 2 } } 
```

{ name: 'Datastream Air Air Temperature DS', description: 'New Datastream Air Temperature DS for test', unitOfMeasurement: { name: 'New Degree Celsius', symbol: '°C', definition: 'http://unitsofmeasure.org/ucum.html#para-30' }, ObservedProperty: { name: 'New Area Temperature', description: 'The degree or intensity of heat present in the area', definition: 'http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature' }, Sensor: { name: 'New Sensor DHT22', description: 'DHT22 temperature sensor [1]', encodingType: 'application/pdf', metadata: 'https://cdn-shop.adafruit.com/datasheets/DHT22.pdf' } } 
```

{ unitOfMeasurement: { name: 'Degrees Fahrenheit', symbol: 'degF', definition: 'http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeFahrenheit' }, description: 'Water Temperature of Bow river' } 
```

{ description: 'Air quality readings', name: 'Air quality readings MultiDatastreams 2', Thing: { '@iot.id': 2 }, Sensor: { '@iot.id': 1 }, multiObservationDataTypes: [ 'Measurement', 'Measurement', [length]: 2 ], unitOfMeasurements: [ { symbol: '%', name: 'humidity 3', definition: 'http://unitsofmeasure.org/ucum.html' }, { name: 'Temperature 4', symbol: '°', definition: 'http://unitsofmeasure.org/blank.html' }, [length]: 2 ], ObservedProperties: [ { name: 'humidity 5', definition: 'humidity', description: "valeur en pourcentage du taux d'humidity de l'air" }, { name: 'Temperature 6', definition: 'Temperature', description: "valeur en degré de la Temperature de l'air" }, [length]: 2 ] } 
```

{ description: 'Air quality readings', name: 'Air quality readings MultiDatastreams 7', Thing: { description: 'A New SensorWeb thing', name: 'SensorWebThing Thing 8', properties: { organization: 'Mozilla', owner: 'Mozilla' } }, Sensor: { name: 'DHT72', description: 'DHT72 soil temperature 9', encodingType: 'application/pdf', metadata: 'https://cdn-shop.adafruit.com/datasheets/DHT72.pdf' }, multiObservationDataTypes: [ 'Measurement', 'Measurement', [length]: 2 ], unitOfMeasurements: [ { symbol: '%', name: 'Soil soil humidity 10', definition: 'http://unitsofmeasure.org/ucum.html' }, { name: 'Soil soil temperature 11', symbol: '°', definition: 'http://unitsofmeasure.org/blank.html' }, [length]: 2 ], ObservedProperties: [ { name: 'humidity 12', definition: 'humidity', description: "valeur en pourcentage du taux d'humidity de l'air" }, { name: 'Temperature 13', definition: 'Temperature', description: "valeur en degré de la Temperature de l'air" }, [length]: 2 ] } 
```

{ description: 'Air quality readings', name: 'Air quality readings MultiDatastreams 18', Thing: { '@iot.id': 2 }, Sensor: { '@iot.id': 1 }, multiObservationDataTypes: [ 'Measurement', 'Measurement', [length]: 2 ], unitOfMeasurements: [ { symbol: '%', name: 'humidity 19', definition: 'http://unitsofmeasure.org/ucum.html' }, { name: 'Temperature 20', symbol: '°', definition: 'http://unitsofmeasure.org/blank.html' }, [length]: 2 ], ObservedProperties: [ { name: 'humidity 21', definition: 'humidity', description: "valeur en pourcentage du taux d'humidity de l'air" }, { name: 'Temperature 22', definition: 'Temperature', description: "valeur en degré de la Temperature de l'air" }, [length]: 2 ], FeaturesOfInterest: { '@iot.id': 2 } } 
```

{ description: 'Modification of the description' } 
```

{ description: 'PM 2.5 sensor', name: 'PM25 Sensors 23', encodingType: 'application/pdf', metadata: 'http://particle-sensor.com/' } 
```

{ description: 'This is a new PM 2.5 sensor' } 
```

{ name: 'Area ObservedProperties 24', description: 'The degree or intensity of heat present in the area', definition: 'http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature' } 
```

{ name: 'New PM 2.5 ObservedProperties 25' } 
```

{ phenomenonTime: '2017-02-07T18:02:00.000Z', resultTime: '2017-02-07T18:02:05.000Z', result: 21.6, Datastream: { '@iot.id': 2 } } 
```

{ phenomenonTime: '2017-02-07T18:02:00.000Z', resultTime: '2017-02-07T18:02:05.000Z', result: 21.6, FeatureOfInterest: { name: ':From Saint-Malo (Created new location)', description: 'From Saint-Malo', encodingType: 'application/geo+json', feature: { coordinates: [ -1.202481228298467, 48.35475608212215, [length]: 2 ], type: 'Point' } }, Datastream: { '@iot.id': 6 } } 
```

{ phenomenonTime: '2017-02-07T18:02:00.000Z', resultTime: '2017-02-07T18:02:05.000Z', result: 23 } 
```

{
  phenomenonTime: '2017-02-07T18:02:00.000Z',
  resultTime: '2017-02-07T18:02:05.000Z',
  result: 21.6,
  FeatureOfInterest: { name: 'Au Comptoir Vénitien [7]', description: 'Au Comptoir Vénitien', encodingType: 'application/geo+json', feature: { coordinates: [ -1.6567440482485551, 48.11256463781973, [length]: 2 ], type: 'Point' } }
} 
```

{
  phenomenonTime: '2017-02-07T18:02:00.000Z',
  resultTime: '2017-02-07T18:02:05.000Z',
  result: { 'Unit one of apostrophe': 10.1, 'Unit two of apostrophe': 10.2 },
  FeatureOfInterest: { name: 'Au Comptoir Vénitien', description: 'Au Comptoir Vénitien', encodingType: 'application/geo+json', feature: { coordinates: [ -1.6567440482485551, 48.11256463781973, [length]: 2 ], type: 'Point' } }
} 
```

{
  phenomenonTime: '2017-02-07T18:02:00.000Z',
  resultTime: '2017-02-07T18:02:05.000Z',
  result: { 'Unit one of apostrophe': 10.1 },
  FeatureOfInterest: {
    name: 'Au Comptoir Vénitien[9]',
    description: 'Au Comptoir Vénitien',
    encodingType: 'application/geo+json',
    feature: { type: 'Point', feature: { coordinates: [ -1.6567440482485551, 48.11256463781973, [length]: 2 ], type: 'Point' } }
  }
} 
```

{ phenomenonTime: '2016-11-18T11:04:15.790Z', resultTime: '2016-11-18T11:04:15.790Z' } 
```

{ phenomenonTime: '2016-11-18T11:04:15.790Z', resultTime: '2016-11-18T11:04:15.790Z', result: 20.4, Datastream: { '@iot.id': 6 } } 
```

{
  name: 'Weather Station YYC.',
  description: 'This is a weather station located at Au Comptoir Vénitien.',
  encodingType: 'application/geo+json',
  feature: { type: 'Point', feature: { coordinates: [ -1.6567440482485551, 48.11256463781973, [length]: 2 ], type: 'Point' } }
} 
```

{
  name: 'My New Name',
  feature: { type: 'Point', feature: { coordinates: [ -1.6567440482485551, 48.11256463781973, [length]: 2 ], type: 'Point' } }
} 
```

{ Datastream: { '@iot.id': 1 }, components: [ 'phenomenonTime', 'result', 'resultTime', 'FeatureOfInterest/id', [length]: 4 ], 'dataArray@iot.count': 4, dataArray: [ [ '2017-01-13T10:20:00.000Z', 90, '2017-01-13T10:20:00.000Z', 1, [length]: 4 ], [ '2017-01-13T10:21:00.000Z', 91, '2017-01-13T10:21:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:22:00.000Z', 92, '2017-02-13T10:22:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:23:00.000Z', 93, '2017-02-13T10:23:00.000Z', 1, [length]: 4 ], [length]: 4 ] } 
```

{ Datastream: { '@iot.id': 2 }, components: [ 'phenomenonTime', 'result', 'resultTime', 'FeatureOfInterest/id', [length]: 4 ], 'dataArray@iot.count': 4, dataArray: [ [ '2017-01-13T10:20:00.000Z', 90, '2017-01-13T10:20:00.000Z', 1, [length]: 4 ], [ '2017-01-13T10:21:00.000Z', 91, '2017-01-13T10:21:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:22:00.000Z', 92, '2017-02-13T10:22:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:23:00.000Z', 93, '2017-02-13T10:23:00.000Z', 1, [length]: 4 ], [length]: 4 ] } 
```

{ duplicate: 'delete', Datastream: { '@iot.id': 2 }, components: [ 'phenomenonTime', 'result', 'resultTime', 'FeatureOfInterest/id', [length]: 4 ], 'dataArray@iot.count': 4, dataArray: [ [ '2017-01-13T10:20:00.000Z', 90, '2017-01-13T10:20:00.000Z', 1, [length]: 4 ], [ '2017-01-13T10:21:00.000Z', 91, '2017-01-13T10:21:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:22:00.000Z', 92, '2017-02-13T10:22:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:23:00.000Z', 93, '2017-02-13T10:23:00.000Z', 1, [length]: 4 ], [length]: 4 ] } 
```

{
  MultiDatastream: { '@iot.id': 2 },
  components: [ 'phenomenonTime', 'result', 'resultTime', 'FeatureOfInterest/id', [length]: 4 ],
  'dataArray@iot.count': 4,
  dataArray: [ [ '2017-01-13T10:20:00.000Z', [ 591, 592, 593, [length]: 3 ], '2017-01-13T10:20:00.000Z', 1, [length]: 4 ], [ '2017-01-13T10:21:00.000Z', [ 691, 692, 693, [length]: 3 ], '2017-01-13T10:21:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:22:00.000Z', [ 791, 792, 793, [length]: 3 ], '2017-02-13T10:22:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:23:00.000Z', [ 891, 892, 893, [length]: 3 ], '2017-02-13T10:23:00.000Z', 1, [length]: 4 ], [length]: 4 ]
} 
```

{
  MultiDatastream: { '@iot.id': 2 },
  components: [ 'phenomenonTime', 'result', 'resultTime', 'FeatureOfInterest/id', [length]: 4 ],
  'dataArray@iot.count': 4,
  dataArray: [ [ '2017-01-13T10:20:00.000Z', [ 591, 592, 593, [length]: 3 ], '2017-01-13T10:20:00.000Z', 1, [length]: 4 ], [ '2017-01-13T10:21:00.000Z', [ 691, 692, 693, [length]: 3 ], '2017-01-13T10:21:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:22:00.000Z', [ 791, 792, 793, [length]: 3 ], '2017-02-13T10:22:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:23:00.000Z', [ 891, 892, 893, [length]: 3 ], '2017-02-13T10:23:00.000Z', 1, [length]: 4 ], [length]: 4 ]
} 
```

{
  duplicate: 'delete',
  MultiDatastream: { '@iot.id': 2 },
  components: [ 'phenomenonTime', 'result', 'resultTime', 'FeatureOfInterest/id', [length]: 4 ],
  'dataArray@iot.count': 4,
  dataArray: [ [ '2017-01-13T10:20:00.000Z', [ 591, 592, 593, [length]: 3 ], '2017-01-13T10:20:00.000Z', 1, [length]: 4 ], [ '2017-01-13T10:21:00.000Z', [ 691, 692, 693, [length]: 3 ], '2017-01-13T10:21:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:22:00.000Z', [ 791, 792, 793, [length]: 3 ], '2017-02-13T10:22:00.000Z', 1, [length]: 4 ], [ '2017-02-13T10:23:00.000Z', [ 891, 892, 893, [length]: 3 ], '2017-02-13T10:23:00.000Z', 1, [length]: 4 ], [length]: 4 ]
} 
```

{ MultiDatastream: { '@iot.id': 2 }, Decoder: { '@iot.id': 1 }, name: 'Another lora Name', description: 'My new Lora Description', deveui: '8cf9574000009L8C' } 
```

{ Datastream: { '@iot.id': 14 }, Decoder: { '@iot.id': 3 }, name: 'Lora for datastream', description: 'My new Lora Description', deveui: '70b3d5e75e014f026' } 
```

{ deveui: '2CF7F1202520017E', timestamp: '2021-10-18T14:53:44+02:00', payload_ciphered: null, frame: '010610324200000107103E4900009808' } 
```

{ deveui: '8CF9574000002D1D', timestamp: '2021-10-18T14:53:44+02:00', payload_ciphered: null, frame: 'AA010610324200000107103E4900009808' } 
```

{ deveui: '8CF9574000002D2D', timestamp: '2021-10-18T14:53:44+02:00', payload_ciphered: null, frame: 'AA010610324200000107103E4900009808' } 
```

{ deveui: '2CF7F1202520017E', timestamp: '2021-10-18T14:53:44+02:00', payload_ciphered: null, frame: '010610324200000107103E4900009808' } 
```

{ data: { Temperature: 25, moisture: 100 }, deveui: '2CF7F1202520017E', sensor_id: '2CF7F1202520017E', timestamp: '2021-10-15T14:53:44+02:00', payload_ciphered: null } 
```

{ data: null, deveui: '2CF7F1202520017E', sensor_id: '2CF7F1202520017E', timestamp: '2021-10-15T14:53:44+02:00', payload_ciphered: null, payload_deciphered: '' } 
```

{ data: { lost: 50, nothing: 25, dontknow: 100 }, deveui: '2CF7F1202520017E', sensor_id: '2CF7F1202520017E', timestamp: '2021-10-15T14:53:44+02:00', payload_ciphered: null, payload_deciphered: '' } 
```

{ header: false, nan: true, columns: { '1': { Datastream: 1, FeaturesOfInterest: 1 } } } 
```


{ header: false, nan: true, columns: { '1': { Datastream: 1, FeaturesOfInterest: 1 } } } 
```


{ header: true, nan: true, columns: { '1': { Datastream: '1', FeaturesOfInterest: '1' }, '2': { Datastream: '4', FeaturesOfInterest: '2' } } } 
```


{ header: true, nan: true, columns: { '1': { Datastream: '1', FeaturesOfInterest: '1' }, '2': { Datastream: '4', FeaturesOfInterest: '2' } } } 
```

