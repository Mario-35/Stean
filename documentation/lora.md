# [STEAN](./intro.md)


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

La mécanique est très simple quand l'API recoi un POST /Lora :
L’API recherche le capteur via son deveui décode le payload envoyé grâce au décodeur associé et l'ajoute aux observations pour le(s) datastream(s) ou le multiDatastream associé à l'entité Lora.

Associer un décodeur à un multiDatasream :
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

