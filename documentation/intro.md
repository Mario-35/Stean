# STEAN

# La genese de STEAN

l'intérêt du modèle sensorThings ne faisaient aucun doute aussi lors des premiers essai il apparut que :

Le seul server FROST disponible à l'époque contiens des lacunes et limitations :

    Lacunes :
    - concernant le result (dans le modèle il est any c'est a dire ce que l'on veut) dans Frost c'est number au mieux string
    - en cas de volumétrie importante le docker est douteux et le server JAVA sans partition ce qui oblige par exemple un count approximatif (à 100 000 près sur un base de 10 000 000)
    - gestion du multiDatastream en tant qu'extension imparfait voire inutilisable
    - les TM_Period des datastream ou multiDatastream sont en fait des chaine e carracteres ne permettant pas la recherche

    Limitations :
    - le multi Base n'est pas dans le serveur JAVA n'est pas simple encore moins sous docker
    - choix de JAVA en tant que server (lourd et lent)


    Il est a noter que la forte utilisation de FROST fait que l'outil est devenu le modele ce qui n'est pas sans poser des soucis.

Ceci a amené A créer un serveur sensorThings sous NoeJS 

# La promesse de depart de STEAN
    - respect STRICT du modele
    - le multi Base matif
    - stream import / export csv


# Installation :

installer / deployer STEAN est tres simple :
```
 curl -fsSL https://raw.githubusercontent.com/Mario-35/Stean/main/scripts/stean.sh -o stean.sh && chmod +x stean.sh && ./stean.sh
```

Lance le script qui installera NodeJS, PostgreSQL, PM2 et enfin créera le script run.sh permettant de lancer STEAN.

La mise a jour ce fait en lançant le script a nouveau qui sera capable de détecter ce qui est déjà installé.


# Premiere Utilisation

http://localhost:8029/help la documentation e l'API

http://localhost:8029/admin paneau d'administration

afin d'acceder au paneau d'administration vous devez entre vos idendifiants postgres

![firstStart](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/firstStart.jpg "firstStart")



Première utilisation :

Le serveur est disponible sous le port 8029


Afin d'accéder au panneau d'administration vous devez entrer vos identifiants PostgreSQL ayant des droits admin.

Vous arriver sur l’écran suivant :
![admin](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/admin.jpg "admin")





