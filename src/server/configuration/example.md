```json
{
    // admin must be in configuration file
    "admin": {
        "name": "admin",
        "port": 8029,
        // postgresSql Connection // with admin rights (create database rights and user ...)
        "pg": {
            "host": "localhost",
            "port": 5432,
            "user": "postgres",
            "password": "password",
            // never used
            "database": "postgres",
            "retry": 2
        }
    },
    "myService": {
        // name of the service SAME as key name
        "name": "myService",
        // service port
        "port": 8037,
        // postgresSql Connection 
        "pg": {
            "host": "localhost",
            "port": 5432,
            "user": "myname",
            "password": "myPass",
            //  name of the database (if not exit a blank database will be create)
            "database": "myservice",
            "retry": 2
        },
        // model version 1.0 ou 1.1
        "apiVersion": "1.1",
        // date format in jsons
        "date_format": "DD/MM/YYYY hh:mi:ss",
        // not use
        "webSite": "http://sensorthings.geosas.fr/apidoc/",
        // pagination number by page
        "nb_page": 200,
        // add s to http
        "forceHttps": false,
        // Use users authentification for post. patch, delete
        "users": true,
        // list of alias name
        "alias": [
            ""
        ],
        // etensions of the service
        "extensions": [
            // SensorThings core
            "base",
            // SensorThings Multidatastream Extension
            "multiDatastream",
            // Lora Extension
            "lora"
            // Logs Extension
            "logs"
        ],
        // if it's true postres float8 will be used instead of float4
        "highPrecision": false,
        // database can be destroy (usefull in testing phose)
        "canDrop": false,
        // name of the logfile
        "logFile": ""
    }
}
```
