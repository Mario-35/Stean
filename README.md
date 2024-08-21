![Logo](https://raw.githubusercontent.com/Mario-35/Stean/main/doc/assets/logo.png "Logo")

## SensorThings Enhanced API Node

![Inrae](https://raw.githubusercontent.com/Mario-35/Stean/main/doc/assets/inrae.png "Inrae")

# Installation

## deploy on server run :
```curl -fsSL https://raw.githubusercontent.com/Mario-35/Stean/main/scripts/stean.sh -o stean.sh && chmod +x stean.sh && ./stean.sh```

## use on local windows as production (for testing) use :  [script](https://raw.githubusercontent.com/Mario-35/Stean/main/scripts/install.ps1) as install.ps1

## for developper : 

1. Fork/Clone : <https://github.com/Mario-35/Stean.git>
2. Install dependencies : npm install
3. Fire up Postgres WITH Postgis on the default ports
4. Make configuration/[development or production].json file (see [example](https://github.com/Mario-35/Stean/blob/main/src/server/configuration/example.md))
or use first install (the file will be automatically create)
5. npm run dev for dev, npm run build (vs script package.json)
6. If database not exists the program create it.

[Release infos](https://github.com/Mario-35/Stean/blob/main/realease.md)

## Want to use this with docker

![Docker](https://raw.githubusercontent.com/Mario-35/Stean/main/doc/assets/logo-docker.png "Docker")

# COMMING SOON

The project run under nodeJS.

![Nodejs](https://raw.githubusercontent.com/Mario-35/Stean/main/doc/assets/nodejs.png "Nodejs")

![TypeScript](https://raw.githubusercontent.com/Mario-35/Stean/main/doc/assets/ts.png "TypeScript") ![Javascript](https://raw.githubusercontent.com/Mario-35/Stean/main/doc/assets/js.png "Javascript")


![HTML JS CSS](https://raw.githubusercontent.com/Mario-35/Stean/main/doc/assets/html.png "HTML JS CSS")

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

## Tech Stack

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
