# [STEAN](./documentation.md)

## Les états de STEAN

Lorsque l'on utilise : 

http://rootApi/states
ou
http://rootApi/state/ServiceName/states

Affiche l'état de tous les services

http://rootApi/state/ServiceName/state

Affiche l'état du service

- creating: Création d'une instance en cours,
- restarting: redémarre,
- importing: importation en cours,
- cleaning: Nettoyage en cours,
- starting: Démarrage de l'api ,
- normal: normal,

Certaines opérations comme l'import csv ne seront pas lancé si l'état n'est pas normal.

Après une mise à jour si les données sont conséquentes l'état start dure le temps de l'optimisation n'empêchant pas l'API de fonctionné mais est plus lente qu'en mode normal.

