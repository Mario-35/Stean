# [STEAN](./documentation.md)

## La genèse de STEAN

L'intérêt du modèle sensorThings ne faisaient aucun doute aussi lors des premiers essais il apparut que :

Le seul outil disponible à l'époque contient des lacunes et limitations :

Lacunes :
- concernant le result (dans le modèle il est any c'est à dire ce que l'on veut) dans les outils disponibles ce n'est pas le cas.
- en cas de volumétrie importante le docker est à mon sens douteux et le server JAVA avec PostgreSQL sans partition ce qui oblige par exemple un count approximatif (à 100 000 près sur une base de 10 000 000)
- gestion du multiDatastream en tant qu'extension imparfait voire inutilisable
- les TM_Period d'un datastream ou multiDatastream sont en fait des chaines de caractères ne permettant pas la recherche

Limitations :
- Le multi Base n'est pas possible facilement encore moins sous docker
- choix de JAVA en tant que server (lourd et lent essayé de compiler la source pour vous en convaincre) 
- l'importation des données n'est pas possible et oblige à créer des scripts ce qui pour de gros volume de données est très long.

Ceci et le fait que le premier projet était une gestion des capteurs de type Lora a amené A créer notre propre serveur sensorThings.

Le choix technologique que j'ai retenu est NodeJS en typeScript (typé et en Object en mode TDD pour un respect du modèle dès la conception)

## La promesse de départ de STEAN
    - respect STRICT du modèle
    - le multi Base matif
    - stream import / export csv
    - Ultra performant (y compris sur une VM)
        Exemple: https://sensorthings.umrsas.inrae.fr/agrhys/v1.1/
        CPU: 4 CPU(s), 83 MHz
        Mémoire: 8 Go

