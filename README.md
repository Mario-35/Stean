![Logo](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/logo.png "Logo")

# SensorThings Enhanced API Node [![version](https://img.shields.io/badge/version-0.9.0-red)](https://github.com/Mario-35/Stean/blob/main/realease.md) [![licence](https://img.shields.io/badge/licence-MIT-red)](https://github.com/Mario-35/Stean/blob/main/LICENCE.md)

## Installation / Deploy  [![node](https://img.shields.io/badge/NodeJs-%20>16-blue)](https://nodejs.org/) [![postgreSql](https://img.shields.io/badge/PostgreSQL-%20>14-blue)](https://www.postgresql.org/) [![postGIS](https://img.shields.io/badge/postGIS-%20>3-blue)](https://postgis.net/) [![pm2](https://img.shields.io/badge/pm2-%20>5-blue)](https://pm2.keymetrics.io/)


```curl -fsSL https://raw.githubusercontent.com/Mario-35/Stean/main/scripts/stean.sh -o stean.sh && chmod +x stean.sh && ./stean.sh```

<details>
    <summary>If you need help</summary>
The menu differs depending on the progress of the installation but the header and footer of the menu display certain states:

![steanSh](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/steanSh.jpg "steanSh")

- Path: the installation path of the API
- The version of stean installed
- The state of stean (RUN or STOP)
- At the bottom of the menu the version of node and postgresSql
- Quit to exit installation script
- "Indicate path" or "Change path" : indicates the installation path of the api
- "Check postGis" : test the existence and the version of postGis
- "Install all" : Install stean after check if nodeJs, Postgres and pm2 are installed
- "Back to previous" : If a backup is present install it instead of actual installed stean
- "Create / Recreate run script" : create run.sh with all parameters
- "Run / Stop stean" : run or stop API (if configuration.json is found)

</details>

## STEAN configuration

The configuration.json file must be found by the api in the configuration folder if the file not exist the api redirect you to th first install page to create that file with your firs service :

![firstStart](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/firstStart.jpg "firstStart")

### You can create manually your configuration.json file :
```json5
{
    // admin must be in configuration file
    "admin": {
        "name": "admin",
        "ports": {
            "http": 8029, // http port
            "tcp": 9000, // tcp port for mqtt
            "ws": 1883 // web socket
        },
        // postgresSql Connection // with admin rights (create database rights and user ...)
        "pg": {
            "host": "localhost",
            "port": 5432,
            "user": "postgres",
            "password": "password", // ADMIN password (with rights to create DB)
            "database": "postgres",
            "retry": 2
        }
    },
    "myService": { // service name        
        "name": "myService", // name of the service SAME as key name
        "port": 8037, // not used
        // postgresSql Connection 
        "pg": {
            "host": "localhost",
            "port": 5432,
            "user": "myname", // user to create
            "password": "myPass",
            //  name of the database (if not exit a blank database will be create)
            "database": "myservice",
            "retry": 2
        },
        "apiVersion": "1.1", // model version 1.0 ou 1.1
        "date_format": "DD/MM/YYYY hh:mi:ss", // date format in jsons
        "nb_page": 200, // pagination number by page
        // list of alias name
        "alias": [
            ""
        ],
        // etensions of the service
        "extensions": [
            "base", // SensorThings core
            "multiDatastream", // SensorThings Multidatastream Extension
            "lora", // Lora Extension
            "logs", // Logs Extension
            "users" // Users Extension
        ],
        "options": [
            "highPrecision", // float8 will be used instead of float4
            "canDrop", // database can be destroy (usefull in testing phose)
            "stripNull",  // null value are not visible,
            "forceHttps" // force api to add s to http of this service,
        ]
    }, 
    "myServiceNumber2": {
        ...
    }
}
```

## use on local windows as production (for testing) use :  [script](https://raw.githubusercontent.com/Mario-35/Stean/main/scripts/install.ps1) as install.ps1

## for developper

1. Fork/Clone : <https://github.com/Mario-35/Stean.git>
2. Install dependencies : npm install
3. Fire up Postgres WITH Postgis on the default ports
4. Make configuration.json file or use first install (the file will be automatically create)
5. npm run dev for dev, npm run build (vs script package.json)
6. If database not exists the program create it. note that db test is automaticly create



## Want to use this with docker

![Docker](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/logo-docker.png "Docker")

<details>
    <summary>Tech Stack</summary>

The project run under nodeJS.

![Nodejs](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/nodejs.png "Nodejs")

![TypeScript](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/ts.png "TypeScript") ![Javascript](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/js.png "Javascript")

![HTML JS CSS](https://raw.githubusercontent.com/Mario-35/Stean/main/assets/images/html.png "HTML JS CSS")

## Directory Structure

```js
📦src
 ┣ 📂server // API Server
 ┃ ┣ 📂authentication // authentication and tokens
 ┃ ┣ 📂configuration // Configuration Server
 ┃ ┃ ┣ 📜.key // crypt Key
 ┃ ┃ ┗ 📜 configuration.json // configuration file
 ┃ ┣ 📂db
 ┃ ┃ ┣ 📂createDb // datas to create blank Database
 ┃ ┃ ┣ 📂dataAccess
 ┃ ┃ ┣ 📂entities // SensorThings entities
 ┃ ┃ ┣ 📂helpers 
 ┃ ┃ ┣ 📂monitoring 
 ┃ ┃ ┣ 📂queries
 ┃ ┃ ┗ 📜constants.ts // Constants for DB
 ┃ ┣ 📂enums // Enums datas
 ┃ ┣ 📂helpers // Application helpers
 ┃ ┣ 📂log // Logs tools
 ┃ ┣ 📂lora // loras functions
 ┃ ┣ 📂messages //all messages of the api
 ┃ ┣ 📂models //model descriptor
 ┃ ┣ 📂odata // Odata decoder
 ┃ ┃ ┣ 📂parser // Odata parser
 ┃ ┃ ┗ 📂visitor //  Odata decoder process
 ┃ ┃   ┣📂builder //  Odata builder process
 ┃ ┃   ┣📂helper  //  Odata helpers
 ┃ ┃   ┗📂pg  //  Odata postgres visitor
 ┃ ┣ 📂routes // routes API
 ┃ ┃ ┗ 📂helper // routes helpers
 ┃ ┃   ┣ 📜protected.ts // protected routes
 ┃ ┃   ┗ 📜unProtected.ts // open routes
 ┃ ┣ 📂types // data types
 ┃ ┣ 📂views // generated view
 ┃ ┃ ┣ 📂clas // class files
 ┃ ┃ ┣ 📂css
 ┃ ┃ ┣ 📂helpers // views helpers
 ┃ ┃ ┣ 📂html 
 ┃ ┃ ┗ 📂js
 ┃ ┣ 📜constants.ts // App constants
 ┃ ┗ 📜index.ts // starting file
 ┣ 📂template // ApiDoc template
 ┣ 📂test
 ┃ ┣ 📂integration // Tests
 ┃ ┃ ┗ 📂files // files For importation tests
 ┃ ┣ 📜apidoc.json // Apidoc configuration
 ┃ ┗ 📜dbTest.ts // DB test connection
 ┗ 📜build.js // js file for building app
```

- [Node.js](https://nodejs.org/) `v18.15.0`
- [PostgreSQL](https://www.postgresql.org/)
- [Postgres.js](https://github.com/porsager/postgres)
- [json2csv](https://mircozeiss.com/json2csv/)
- [busboy](https://github.com/mscdex/busboy)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [exceljs](https://github.com/exceljs/exceljs)
- [ssh2](https://github.com/mscdex/ssh2)

---

- [koa](https://koajs.com/)
- [koa-bodyparser](https://github.com/koajs/bodyparser)
- [koa-bodyparser](https://github.com/koajs/cors)
- [koa-compress](https://github.com/koajs/compress)
- [koa-html-minifier](https://github.com/koajs/html-minifier)
- [koa-json](https://github.com/koajs/json)
- [koa-helmet](https://github.com/venables/koa-helmet)
- [koa-logger](https://github.com/koajs/logger)
- [koa-router](https://github.com/koajs/router)
- [koa-session](https://github.com/koajs/session)
- [koa-passport](https://github.com/rkusa/koa-passport)
- [koa-static](https://github.com/koajs/static)
- [koa-favicon](https://github.com/koajs/favicon)
- [@koa/cors](https://github.com/koajs/cors)
- [passport-local](https://github.com/jaredhanson/passport-local)

</details>
