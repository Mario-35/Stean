# STEAN

## La genèse de STEAN

L'intérêt du modèle sensorThings ne faisaient aucun doute aussi lors des premiers essais il apparut que :

Le seul server FROST disponible à l'époque contient des lacunes et limitations :

Lacunes :
- concernant le result (dans le modèle il est any c'est à dire ce que l'on veut) dans Frost c'est number au mieux string
- en cas de volumétrie importante le docker est douteux et le server JAVA avec postgresSql sans partition ce qui oblige par exemple un count approximatif (à 100 000 près sur une base de 10 000 000)
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
    - Ultra performant (y compris sur une VM)


- [Installation](./installation.md)

