# [STEAN](./documentation.md)

## Les états de STEAN

Lorsque l'on utilise : 

http://rootApi/state

Affiche l'état de tous les services

http://rootApi/state/ServiceName/state

Affiche l'état du service

- maintenance: Maintenance en cours
- optimized: Optimisation du partitionnement en cours,
- createDb: Création d'une instance en cours,
- restart: redémarre,
- import: importation en cours,
- clean: Nettoyage en cours,
- start: Démarrage de l'api ,
- normal: normal,

Certaines opérations comme l'import csv ne seront pas lancé si l'état n'est pas normal.

Après une mise à jour si les données sont conséquentes l'état start dure le temps de l'optimisation n'empêchant pas l'API de fonctionné mais est plus lente qu'en mode normal.

