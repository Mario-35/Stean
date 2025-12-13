# [STEAN](./intro.md)


## Installation :

Installer / déployer STEAN est très simple :
```
curl -fsSL https://raw.githubusercontent.com/Mario-35/Stean/main/scripts/stean.sh -o stean.sh && chmod +x stean.sh && ./stean.sh
```

Lance le script qui installera NodeJS, PostgreSQL / PostGis, PM2 et enfin créera le script run.sh permettant de lancer STEAN.
![nodejs](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/nodejs.png "nodejs")
![postgresPostGis](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/postgresPostGis.png "postgresPostGis")
![pm2](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/pm2.jpg "pm2")
La mise à jour ce fait en lançant le script à nouveau qui sera capable de détecter ce qui est déjà installé.

![install](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/install.gif "install")


une fois l'installation terminé il ne rest plus qu'à lancer :
```
./run.sh
```

![run](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/runSh.jpg "run")


## Première Utilisation

http://localhost:8029/help la documentation de l'API

http://localhost:8029/infos infos sur l'API

Permet d'obtenir des infos sur l'api elle meme ainsi que la version de postgresSql et de posGis utilisé

```JSON
{
    "Postgres":{
        "version":"PostgreSQL 17.7 on x86_64-windows, compiled by msvc-19.44.35219, 64-bit",
        "extension":["plpgsql-1.0","postgis-3.5.3"],
        "?column?":null},
    "services":["test","essai"],
    "stean":{
        "version":"1.3.5",
        "date":"11/12/2025-12:04:20"
    },
    "state":"normal"
}
```

http://localhost:8029/state état de l'API
- start : Demarrage en cours
- createDb : Creation de base en cours
- restart : Redemarrage en cours
- normal : etat normal 
- clean : En cours de nettoyage
- import : En cours d'importation de données
- maintenance : Maintenance en cours (http://localhost:8029/maintenance=true)


http://localhost:8029/admin panneau d'administration

Afin d'accéder au panneau d'administration vous devez entre vos identifiants PostgreSQL (si PostgreSQL n'était pas installé le script le fait avec comme mot de passe par défaut : **PostgreSQL**)

![firstStart](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/firstStart.jpg "first Start")

Le serveur est disponible sous le port 8029

Afin d'accéder au panneau d'administration vous devez entrer vos identifiants PostgreSQL ayant des droits admin.

Vous arrivez sur l’écran suivant :

![admin](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/admin.jpg "admin")

Le bouton {...} permet de proposer un service 'type':

## Creation d'un service

```JSON
{
    "name": "nouveau",
    "pg": {
        "host": "localhost",
        "port": 5432,
        "user": "nouveau",
        "password": "nouveau",
        "database": "nouveau",
        "retry": 2
    },
    "version": "v1.1",
    "date_format": "DD/MM/YYYY hh:mi:ss",
    "nb_page": "200",
    "nb_graph": "1000000",
    "extensions": [
        "base",
        "multiDatastream",
        "partitioned",
        "unique"
    ],
    "options": [
        "canDrop",
    ],
    "csvDelimiter": ";"
}
```

http://localhost:8029/nouveau/v1.1/infos infos sur le service

### Les options :

Les options peuvent être activé ou désactivés car elle n'impacte pas la base de données.

- **canDrop**: (postgresSql Drop) permet de recreer n service : http://service/version:8029/canDrop

- **forceHttps**: Cette option rajoute un s au http des requettes

- **stripNull**: supprime les valeurs null des JSON retournés par l'api,

### Les extensions :

Les extensions sont un choix fait a la creation du service.

- **users** ajoute une gestion des droits utilisateurs : par default uniquement les requette GET donc de lecture sont possible pour Ajouter (POST), Modifier (Push) et Delete (Del)

- **partitioned** : Installe une mécanique de partitionnement totalement transparente pour l'utilisateur augmentant les performances pour des services avec une volumétrie importante.

- **lora** : ajoute deux entités : Lora et decodeur? pour plus d'informations allez a la section [Lora](./lora.md)

    tasking = "tasking",
    mqtt = "mqtt",

- **numeric**: Cette option indique que ce service ne gere qu'un result de type numérique ameliorant les peformances MAIS ne permet pas d'avoir de multiDatastream

- **unique**: ajoute a la norme sensorThings l'impossibilité de creer des doublons dans toutes les entites qui ont la propiete name une seule occurence de se nom ne peut etre creer ainsi que dans les observations a la meme date le meme result ne peut etre ajouter (cera permet lors des importations en masse d'importer des doublons), cette option permet aussi d'identifier un entrée par son nom par exemple 

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





