# STEAN

## La genèse de STEAN

L'intérêt du modèle sensorThings ne faisaient aucun doute aussi lors des premiers essais il apparut que :

Le seul server FROST disponible à l'époque contient des lacunes et limitations :

Lacunes :
- concernant le result (dans le modèle il est any c'est à dire ce que l'on veut) dans Frost c'est number au mieux string
- en cas de volumétrie importante le docker est douteux et le server JAVA sans partition ce qui oblige par exemple un count approximatif (à 100 000 près sur une base de 10 000 000)
- gestion du multiDatastream en tant qu'extension imparfait voire inutilisable
- les TM_Period des datastream ou multiDatastream sont en fait des chaines de caractères ne permettant pas la recherche

Limitations :
- le multi Base n'est pas dans le serveur JAVA n'est pas simple encore moins sous docker
- choix de JAVA en tant que server (lourd et lent)

Ceci a amené A créer un serveur sensorThings sous NodeJS 

## La promesse de départ de STEAN
    - respect STRICT du modèle
    - le multi Base matif
    - stream import / export csv

## Installation :

Installer / déployer STEAN est très simple :
```
curl -fsSL https://raw.githubusercontent.com/Mario-35/Stean/main/scripts/stean.sh -o stean.sh && chmod +x stean.sh && ./stean.sh
```

Lance le script qui installera NodeJS, PostgreSQL, PM2 et enfin créera le script run.sh permettant de lancer STEAN.

La mise à jour ce fait en lançant le script à nouveau qui sera capable de détecter ce qui est déjà installé.

une fois l'installation terminé il ne rest plus qu'à lancer :
```
./run.sh
```

## Première Utilisation

http://localhost:8029/help la documentation e l'API

http://localhost:8029/admin panneau d'administration

Afin d'accéder au panneau d'administration vous devez entre vos identifiants PostgreSQL
(si PostgreSQL n'etait pas installé le script le fait avec comme mot de passe par defaut : **postgres**)

![firstStart](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/firstStart.jpg "first Start")

Le serveur est disponible sous le port 8029

Afin d'accéder au panneau d'administration vous devez entrer vos identifiants PostgreSQL ayant des droits admin.

Vous arrivez sur l’écran suivant :

![admin](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/admin.jpg "admin")

Le bouton {...} permet de proposer un service 'type':





## Creation 'un service

### Les options :

- **canDrop**: (postgresSql Drop) permet de recreer n service : http://<pi-adress>:8029/canDrop

- **forceHttps**: Cette option rajoute un s au http des requettes

- **stripNull**: supprime les valeurs null des JSON retourns par l'api,



### Les extensions :
- **users** ajoute une gestion des droits utilisateurs : par default uniquement les requette GET donc de lecture sont possible pour Ajouter (POST), Modifier (Push) et Delete (Del)
- **lora** : ajoute deux entite
    tasking = "tasking",
    mqtt = "mqtt",
    highPrecision = "highPrecision",
    resultNumeric = "resultNumeric"


- **unique**: option ajoutant a la norme sensorThings l'impossibilité de creer des doublons dans toutes les entites qui ont la propiete name une seule occurence de se nom ne peut etre creer ainsi que dans les observations a la meme date le meme result ne peut etre ajouter (cera permet lors des importations en masse d'importer des doublons), cette option permet aussi d'identifier un entrée par son nom par exemple 

```JSON
{
    "name": "Thing with existing Location test",
    "description": "Create Thing with existing location inside tests",
    "properties": {
        "Deployment Condition": "Deployed in a third floor balcony",
        "Case Used": "Radiation shield"
    },
    "Locations": [
        {
            "@iot.id": "1"
        }
    ]
}
```

On identifie une location par son id l'apport de l'option unique permet :


```JSON
{
    "name": "Thing with existing Location test",
    "description": "Create Thing with existing location inside tests",
    "properties": {
        "Deployment Condition": "Deployed in a third floor balcony",
        "Case Used": "Radiation shield"
    },
    "Locations": [
        {
            "@iot.name": "On the Moon"
        }
    ]
}
```





