# [STEAN](https://github.com/Mario-35/Stean/blob/main/documentation/intro.md)


## Lora :

l'extension lora ajoute deux entitées au modele de facon transparente :


![lora](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/drawio_STA_V1.1_Lora.jpg "lora")

Une entité décodeur :

| Colone | Description |
| --- | ----------- |
| name | Nom du décodeur |
| hash | Hash (généré) utile pour la mise à jour |
| code | Javascript code (généré par nodeRed par exemple) |
| nomenclature | Nomenclature du décodeur |
| synonym | synonyme du payload |

Une entité Lora :

| Colone | Description |
| --- | ----------- |
| name | Nom |
| description | Description |
| Properties | Propriétés |
| deveui | numéro d'identification unique du capteur |

La mécanique est très simple quand l'API recoi un POST http://rootApi/payload :
L’API recherche le capteur via son deveui décode le payload envoyé grâce au décodeur associé et l'ajoute aux observations pour le(s) datastream(s) ou le multiDatastream associé à l'entité Lora.

### Créer un décodeur :

le code doit etre :
```JS
  function decode(bytes, nomenclature) { 
    votre Code
  };
```

L’api lancera le code avec le payload dans bytes et la nomenclature en paramètre.
Généralement le code javascript est fourni par le constructeur et souvent présent sur un dépôt

```JSON
{
            "name": "Sensecap",
            "hash": "12614342",
            "code": 'function decode(bytes, nomenclature) { "use strict"; if (typeof bytes === "string") { for (var e = [], t = 0; t < bytes.length; t += 2) e.push(bytes.substring(t, t + 2)); bytes = e; } function isSpecialDataId (dataID) { switch (dataID) { case 0: case 1: case 2: case 3: case 4: case 7: case 9: case 0x120:  return true; default:  return false; } } function Decoder (bytes) {  var bytesString = bytes.map(v => v.toString(16).padStart(2, "0")).join("");  var sensorEuiLowBytes; var sensorEuiHighBytes; var decoded = {   valid: true,  err: 0,   payload: bytesString,   messages: [],  datas: {} };  if (!crc16Check(bytesString)) {  decoded["valid"] = false;  decoded["err"] = -1;  return decoded; }  if ((((bytesString.length / 2) - 2) % 7) !== 0) {  decoded["valid"] = false;  decoded["err"] = -2;  return decoded; }  var frameArray = divideBy7Bytes(bytesString); for (var forFrame = 0; forFrame < frameArray.length; forFrame++) {  var frame = frameArray[forFrame];   var dataID = strTo10SysNub(frame.substring(2, 6));  var dataValue = frame.substring(6, 14);  var realDataValue = ttnDataFormat(dataValue);  if (parseInt(dataID) > 4096) {    decoded.messages.push({  type: "report_telemetry",  measurementId: dataID,  measurementValue: realDataValue  });  decoded.datas[nomenclature[dataID]] = realDataValue;  } else if (isSpecialDataId(dataID) || (dataID === 5) || (dataID === 6)) {    switch (dataID) {  case 0x00:     var versionData = sensorAttrForVersion(realDataValue);   decoded.messages.push({   type: "upload_version",   hardwareVersion: versionData.ver_hardware,   softwareVersion: versionData.ver_software   });   break;  case 1:     break;  case 2:     sensorEuiLowBytes = realDataValue;   break;  case 3:     sensorEuiHighBytes = realDataValue;   break;  case 7:     decoded.messages.push({   type: "upload_battery",   battery: realDataValue.power   }, {   type: "upload_interval",   interval: parseInt(realDataValue.interval) * 60   });   break;  case 0x120:     decoded.messages.push({   type: "report_remove_sensor",   channel: 1   });   break;  default:   break;  }  } else {  decoded.messages.push({  type: "unknown_message",  dataID: dataID,  dataValue: dataValue  });  } }  if (sensorEuiHighBytes && sensorEuiLowBytes) {  decoded.messages.unshift({  type: "upload_sensor_id",  channel: 1,  sensorId: (sensorEuiHighBytes + sensorEuiLowBytes).toUpperCase()  }); }  return decoded; } function crc16Check (data) { var crc16tab = [  0x0000, 0x1189, 0x2312, 0x329b, 0x4624, 0x57ad, 0x6536, 0x74bf,  0x8c48, 0x9dc1, 0xaf5a, 0xbed3, 0xca6c, 0xdbe5, 0xe97e, 0xf8f7,  0x1081, 0x0108, 0x3393, 0x221a, 0x56a5, 0x472c, 0x75b7, 0x643e,  0x9cc9, 0x8d40, 0xbfdb, 0xae52, 0xdaed, 0xcb64, 0xf9ff, 0xe876,  0x2102, 0x308b, 0x0210, 0x1399, 0x6726, 0x76af, 0x4434, 0x55bd,  0xad4a, 0xbcc3, 0x8e58, 0x9fd1, 0xeb6e, 0xfae7, 0xc87c, 0xd9f5,  0x3183, 0x200a, 0x1291, 0x0318, 0x77a7, 0x662e, 0x54b5, 0x453c,  0xbdcb, 0xac42, 0x9ed9, 0x8f50, 0xfbef, 0xea66, 0xd8fd, 0xc974,  0x4204, 0x538d, 0x6116, 0x709f, 0x0420, 0x15a9, 0x2732, 0x36bb,  0xce4c, 0xdfc5, 0xed5e, 0xfcd7, 0x8868, 0x99e1, 0xab7a, 0xbaf3,  0x5285, 0x430c, 0x7197, 0x601e, 0x14a1, 0x0528, 0x37b3, 0x263a,  0xdecd, 0xcf44, 0xfddf, 0xec56, 0x98e9, 0x8960, 0xbbfb, 0xaa72,  0x6306, 0x728f, 0x4014, 0x519d, 0x2522, 0x34ab, 0x0630, 0x17b9,  0xef4e, 0xfec7, 0xcc5c, 0xddd5, 0xa96a, 0xb8e3, 0x8a78, 0x9bf1,  0x7387, 0x620e, 0x5095, 0x411c, 0x35a3, 0x242a, 0x16b1, 0x0738,  0xffcf, 0xee46, 0xdcdd, 0xcd54, 0xb9eb, 0xa862, 0x9af9, 0x8b70,  0x8408, 0x9581, 0xa71a, 0xb693, 0xc22c, 0xd3a5, 0xe13e, 0xf0b7,  0x0840, 0x19c9, 0x2b52, 0x3adb, 0x4e64, 0x5fed, 0x6d76, 0x7cff,  0x9489, 0x8500, 0xb79b, 0xa612, 0xd2ad, 0xc324, 0xf1bf, 0xe036,  0x18c1, 0x0948, 0x3bd3, 0x2a5a, 0x5ee5, 0x4f6c, 0x7df7, 0x6c7e,  0xa50a, 0xb483, 0x8618, 0x9791, 0xe32e, 0xf2a7, 0xc03c, 0xd1b5,  0x2942, 0x38cb, 0x0a50, 0x1bd9, 0x6f66, 0x7eef, 0x4c74, 0x5dfd,  0xb58b, 0xa402, 0x9699, 0x8710, 0xf3af, 0xe226, 0xd0bd, 0xc134,  0x39c3, 0x284a, 0x1ad1, 0x0b58, 0x7fe7, 0x6e6e, 0x5cf5, 0x4d7c,  0xc60c, 0xd785, 0xe51e, 0xf497, 0x8028, 0x91a1, 0xa33a, 0xb2b3,  0x4a44, 0x5bcd, 0x6956, 0x78df, 0x0c60, 0x1de9, 0x2f72, 0x3efb,  0xd68d, 0xc704, 0xf59f, 0xe416, 0x90a9, 0x8120, 0xb3bb, 0xa232,  0x5ac5, 0x4b4c, 0x79d7, 0x685e, 0x1ce1, 0x0d68, 0x3ff3, 0x2e7a,  0xe70e, 0xf687, 0xc41c, 0xd595, 0xa12a, 0xb0a3, 0x8238, 0x93b1,  0x6b46, 0x7acf, 0x4854, 0x59dd, 0x2d62, 0x3ceb, 0x0e70, 0x1ff9,  0xf78f, 0xe606, 0xd49d, 0xc514, 0xb1ab, 0xa022, 0x92b9, 0x8330,  0x7bc7, 0x6a4e, 0x58d5, 0x495c, 0x3de3, 0x2c6a, 0x1ef1, 0x0f78 ]; var result = false; var crc = 0; var dataArray = []; for (var i = 0; i < data.length; i += 2) {  dataArray.push(data.substring(i, i + 2)); } for (var j = 0; j < dataArray.length; j++) {  var item = dataArray[j];  crc = (crc >> 8) ^ crc16tab[(crc ^ parseInt(item, 16)) & 0xFF]; } if (crc === 0) {  result = true; } return result; } function divideBy7Bytes (str) { var frameArray = []; for (var i = 0; i < str.length - 4; i += 14) {  var data = str.substring(i, i + 14);  frameArray.push(data); } return frameArray; } function littleEndianTransform (data) { var dataArray = []; for (var i = 0; i < data.length; i += 2) {  dataArray.push(data.substring(i, i + 2)); } dataArray.reverse(); return dataArray; } function strTo10SysNub (str) { var arr = littleEndianTransform(str); return parseInt(arr.toString("utf8")  .replace(/,/g, ""), 16); } function ttnDataFormat (str) { var strReverse = littleEndianTransform(str); var str2 = toBinary(strReverse); if (str2.substring(0, 1) === "1") {  var arr = str2.split("");  var reverseArr = [];  for (var forArr = 0; forArr < arr.length; forArr++) {  var item = arr[forArr];  if (parseInt(item) === 1) {  reverseArr.push(0);  } else {  reverseArr.push(1);  }  }  str2 = parseInt(reverseArr.join(""), 2) + 1;  return parseFloat("-" + str2 / 1000); } return parseInt(str2, 2) / 1000; } function sensorAttrForVersion (dataValue) { var dataValueSplitArray = dataValue.split(","); return {  ver_hardware: dataValueSplitArray[0],  ver_software: dataValueSplitArray[1] }; } function toBinary (arr) { return arr.map(hex => ("0".repeat(8) + (parseInt(hex, 16)).toString(2)).substr(-8)).join(""); } return Decoder(bytes);}; return decode(input, nomenclature);',
            "nomenclature": {
                "4097": "Air Temperature",
                "4098": "Air Humidity",
                "4099": "Light Intensity",
                "4100": "CO2",
                "4101": "Barometric Pressure",
                "4102": "Soil Temperature",
                "4103": "Soil Moisture",
                "4104": "Wind Direction",
                "4105": "Wind Speed",
                "4106": "pH",
                "4107": "Light Quantum",
                "4108": "Electrical Conductivity",
                "4109": "Dissolved Oxygen",
                "4110": "Soil Volumetric Water Content",
                "4113": "Rainfall Hourly",
                "4115": "Distance",
                "4116": "Water Leak",
                "4117": "Liguid Level",
                "4118": "NH3",
                "4119": "H2S",
                "4120": "Flow Rate",
                "4121": "Total Flow",
                "4122": "Oxygen Concentration",
                "4123": "Water Eletrical Conductivity",
                "4124": "Water Temperature",
                "4125": "Soil Heat Flux",
                "4126": "Sunshine Duration",
                "4127": "Total Solar Radiation",
                "4128": "Water Surface Evaporation",
                "4129": "Photosynthetically Active Radiation(PAR)",
                "4130": "Accelerometer",
                "4131": "Sound Intensity",
                "4133": "Soil Tension",
                "4134": "Salinity",
                "4135": "TDS",
                "4136": "Leaf Temperature",
                "4137": "Leaf Wetness",
                "4138": "Soil Moisture-10cm",
                "4139": "Soil Moisture-20cm",
                "4140": "Soil Moisture-30cm",
                "4141": "Soil Moisture-40cm",
                "4142": "Soil Temperature-10cm",
                "4143": "Soil Temperature-20cm",
                "4144": "Soil Temperature-30cm",
                "4145": "Soil Temperature-40cm",
                "4146": "PM2.5",
                "4147": "PM10",
                "4148": "Noise",
                "4150": "AccelerometerX",
                "4151": "AccelerometerY",
                "4152": "AccelerometerZ",
                "4157": "Ammonia ion",
                "4165": "Measurement1",
                "4166": "Measurement2",
                "4167": "Measurement3",
                "4168": "Measurement4",
                "4169": "Measurement5",
                "4170": "Measurement6",
                "4171": "Measurement7",
                "4172": "Measurement8",
                "4173": "Measurement9",
                "4174": "Measurement10",
                "4175": "AI Detection No.01",
                "4176": "AI Detection No.02",
                "4177": "AI Detection No.03",
                "4178": "AI Detection No.04",
                "4179": "AI Detection No.05",
                "4180": "AI Detection No.06",
                "4181": "AI Detection No.07",
                "4182": "AI Detection No.08",
                "4183": "AI Detection No.09",
                "4184": "AI Detection No.10",
                "4190": "UV Index",
                "4191": "Peak Wind Gust",
                "4192": "Sound Intensity",
                "4193": "Light Intensity",
                "4195": "TVOC",
                "4196": "Soil moisture intensity",
                "5100": "Switch"
            },
            "synonym": { "Soil Moisture": ["humide", "humidity"], "soil temperature": ["temperature"] }
}
```

Le Query vous permet de tester un payload pour un ou tous les décodeurs : 
En choisissant l'entité Decoders une entrée payload apparait saisissez votre payload puis cliquer sur le bouton Query et le test se lancera.

![payload](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/payload.jpg "payload")

### Créer un Lora :

L'entité Loar permet d'ssocier un décodeur à un datastream ou à un multiDatasream :

```JSON
{
    "MultiDatastreams": {
        "@iot.id": 2
    },
    "Decoder": {
        "@iot.id": 1
    },
    "name": "Another lora Name",
    "description": "My new Lora Description",
    "deveui": "8cf9574000009L8C"
}
```

Vous avez la possibilité de rechercher les capteurs via leur deveui et pas pas que par l'id :
http://rootApi/Loras(2CF7F1203150012A)

http://rootApi/payload POST
```JSON
{
    "deveui": "2CF7F1202520017E",
    "timestamp": "2021-10-18T14:53:44+02:00",
    "payload_ciphered": null,
    "frame": "010610324200000107103E4900009808"
}
```
