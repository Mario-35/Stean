# Présentation du 15 decembre 2025

Bonjour à tous,

 Je vais vous faire une présentation sous un angle particulier car étant dev je ne peux me placer que sous cet angle: Une solution de serveur sensorThing rapide, légère qui j’espère vous facilitera la mise en place et l’appropriation du modèle.

Je ne vais pas expliquer la genèse de STEAN je vous laisse lire la page consacré a ce sujet sur le dépôt du projet .

Pour se faire : je vais vous montrer :
- Son installation,

    https://sensorthings.umrsas.inrae.fr/infos

    https://sensorthings.umrsas.inrae.fr/agrhys/v1.1/infos
- Son administration,

    https://sensorthings.umrsas.inrae.fr/admin
- Ses outils

    https://sensorthings.umrsas.inrae.fr/agrhys/v1.1/query
- Comment importer, exporter et copier des données,
- Les différents formats d’affichage,
- Le multiDatastream
- La particularité Lora

    https://sensorthings.geosas.fr/rennesmetro/v1.1/Query
- Le coté open source (pour les devs de l'assistance)

    https://github.com/Mario-35/Stean/tree/main/src/server/models/entities




https://sensorthings.umrsas.inrae.fr/agrhys/v1.1/query

geo.equals

salut voici les infos dont je parlait concernant la date au niveau de l'odata

formatDateTime(addDays(utcNow(),-4),'yyyy-MM-dd')

https://learn.microsoft.com/en-us/dotnet/api/microsoft.odata.edm.date.adddays?view=odata-edm-7.0


dans un premier temps je l'ai mis a la mode bourrin dans now mais je vais revoir ma copie pour prévoir cela en  janvier;

concernant le géo c'est vrai MAIS c'est moi qui est ajouté le fonctions j'avais rajouté 😉

Within, Disjoint et Equals alors qu'en fait il n'ont jamais été dans la norme.

en fait pour ne plus utilisé postgres il suffirait d'implanter les 3 options géo pour être compatible.

A voir ...

Bonnes fêtes les amis
Mario ADAM