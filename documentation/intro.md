# STEAN

## La genèse de STEAN

le modèle :

![lora](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/drawio_STA_V1.1.jpg "lora")

L'intérêt du modèle sensorThings ne faisaient aucun doute aussi lors des premiers essais il apparut que :

Le seul server FROST disponible à l'époque contient des lacunes et limitations :

Lacunes :
- concernant le result (dans le modèle il est any c'est à dire ce que l'on veut) dans Frost c'est number au mieux string
- en cas de volumétrie importante le docker est a mon sens douteux et le server JAVA avec postgresSql sans partition ce qui oblige par exemple un count approximatif (à 100 000 près sur une base de 10 000 000)
- gestion du multiDatastream en tant qu'extension imparfait voire inutilisable
- les TM_Period des datastream ou multiDatastream sont en fait des chaines de caractères ne permettant pas la recherche

Limitations :
- Le multi Base n'est pas possible facilement encore moins sous docker
- choix de JAVA en tant que server (lourd et lent essayé de compiler le source pour vous en convaincre) 
- l'importation des données n'est pas possible et oblige a créer des scripts ce qui pour de gros volume de données est tres long.

Ceci a amené A créer un serveur sensorThings sous NodeJS en typeScript

## La promesse de départ de STEAN
    - respect STRICT du modèle
    - le multi Base matif
    - stream import / export csv
    - Ultra performant (y compris sur une VM)
        Exemple: https://sensorthings.umrsas.inrae.fr/agrhys/v1.1/
        CPU: 4 CPU(s), 83 MHz
        Mémoire: 8 Go

- [Installation](https://github.com/Mario-35/Stean/blob/main/documentation/installation.md)
- [Import](https://github.com/Mario-35/Stean/blob/main/documentation/import.md)
- [Lora](https://github.com/Mario-35/Stean/blob/main/documentation/lora.md)
