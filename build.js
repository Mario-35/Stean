"use strict";
const minify = require("@node-minify/core");
const cleanCSS = require("@node-minify/clean-css");
const htmlMinifier = require('@node-minify/html-minifier');
var UglifyJS = require("uglify-js");
var globby = require("globby");
var path = require("path");
var extend = require("extend");
var fs = require("graceful-fs");
var mkdirp = require("mkdirp");
var archiver = require("archiver");
var crypto = require("crypto");
process.env.NODE_ENV = "build";
const updateJson = require("./src/server/configuration/update.json");
updateJson["decoders"] = {
  "rhf1s001" : require("./sandbox/loras/RHF1S001"),
  "senscap" : require("./sandbox/loras/Sensecap.js"),
  "wattEco" : require("./sandbox/loras/Watteco.js") 
};

const encrypt = (text, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-ctr", String(key), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString("hex")}.${encrypted.toString("hex")}`;
};

function isEmpty(str) {
  if (typeof str !== "string" || str.trim() === "") {
    return true;
  }
  return false;
  }

  function readFile(path) {
  try {
    return fs.readFileSync(path, "utf-8");
  } catch (e) {
    console.error("UGLIFYJS FOLDER ERROR: ", path, "was not found !");
    return "";
  }
}

function deleteFileSync(path) {
  try {
    fs.unlinkSync(path);
    //file removed
  } catch(err) {
    console.error(err);
  }
}

function copyFileSync( source, target ) {
  if (source.endsWith(".ts")) return;
  var targetFile = target;
  // If target is a directory, a new file with the same name will be created
  if ( fs.existsSync( target ) ) {
      if ( fs.lstatSync( target ).isDirectory() ) {
          targetFile = path.join( target, path.basename( source ) );
      }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
  var files = [];
  // Check if folder needs to be created or integrated
  var targetFolder = path.join( target, path.basename( source ) );
  if ( !fs.existsSync( targetFolder ) ) {
      fs.mkdirSync( targetFolder );
  }

  // Copy
  if ( fs.lstatSync( source ).isDirectory() ) {
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
  }
}

function messageWrite(message, action) {
  console.log(`\x1b[32m write File${action ? ` [${action}] ` : ' '}\x1b[36m ====> \x1b[35m ${message} \x1b[0m`);
}

function writeFile(filePath, code, action) {
  mkdirp(path.dirname(filePath)).then(function () {
    fs.writeFile(filePath, code, function (err) {
      if (err) {
        console.error("Error: " + err);
        return;
      }
    });
  })
  .catch(function (err) {
    console.log(`\x1b[31m Error \x1b[34m : \x1b[33m ${err}\x1b[0m`);
    return;
  });
  // if (silent && silent === true) return;
  messageWrite(filePath, action);
} 

function zipDirectory(source, out) {
  const archive = archiver("zip", { zlib: { level: 9 }});
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on("error", err => reject(err))
      .pipe(stream)
    ;

    stream.on("close", () => resolve());
    archive.finalize();
  });
}

function ugly (dirPath, options) {
  console.log(`\x1b[32m uglyFy \x1b[36m ====> \x1b[35m ${dirPath} \x1b[0m`);

  options = extend({}, {
    comments: true,
    output: "js",
    extension: ".js",
    patterns: ["**/*.js"],
    configFile: null,
    callback: null,
    logLevel: "info",
    removeAttributeQuotes: true,
  }, options);
    
  // grab and minify all the js files
  var files = globby.sync(options.patterns, {
    cwd: dirPath
  });

  // minify each file individually
  files.forEach(function (fileName) {

    options.output = isEmpty(options.output) ? "_out_" : options.output;
    var newName = path.join(options.output, path.dirname(fileName), path.basename(fileName, path.extname(fileName))) + options.extension;
    var originalCode = readFile(path.join(dirPath, fileName));

    minify({
      compressor: options.compressor,
      content: originalCode,
      options: options,
    }).then(function(min) {
      writeFile(newName, min, "minify");
    }).catch(function(e) {
      console.log(`\x1b[31m Error \x1b[34m : \x1b[33m ${e}\x1b[0m`);
    });
  });

}


function uglyJs (dirPath) {
  var files = globby.sync(["**/*.js"], {
    cwd: dirPath
  });
  const options = {
    compress: {
      drop_console: true,
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true
    }
  };
  // minify each file individually
  files.forEach(function (fileName) {
    if (!fileName.includes(".min.")) {
      const newName = path.join(dirPath, path.dirname(fileName), path.basename(fileName, path.extname(fileName))) + ".js";
      const originalCode = readFile(path.join(dirPath, fileName));
      const temp = UglifyJS.minify(originalCode, options);
      if (temp.error) console.log(`\x1b[31m Error \x1b[34m : \x1b[33m ${temp.error}\x1b[0m`);
      else process.stdout.write(".");
      writeFile(newName, temp.code, "uglyJs");
    }
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const mode = ["build"];

if (process.argv.includes("dev")) mode.push("dev");
if (process.argv.includes("docker")) mode.push("docker");

copyFolderRecursiveSync("./src/server/apidoc", "build/");
copyFolderRecursiveSync("./scripts", "build/");
copyFolderRecursiveSync("./src/server/views/js", "build/views/");
copyFolderRecursiveSync( "./src/server/views/css", "build/views/" );
copyFolderRecursiveSync( "./src/server/db/createDb/triggers", "build/db/createDb/" );
copyFileSync( "./src/server/favicon.ico", "build/" );
copyFileSync("./src/server/models/model.drawio", "build/models/");

const packageJson = require("./package.json");
delete packageJson.scripts;
delete packageJson.devDependencies;
delete packageJson.apidoc;
  
fs.writeFile("build/package.json", JSON.stringify(packageJson, null, 2), {
    encoding: "utf-8"
},function (err) {
  if (err) console.log(err);
  messageWrite("package.json", "user mode");
  if (!mode.includes("dev")) {  
    ugly("./build/", {
      compressor: cleanCSS ,
      output: "build/",
      extension: ".css",
      patterns: ["**/*.css"],
        options: {
        removeAttributeQuotes: true,
        collapseInlineTagWhitespace: true,
        removeComments: true
      }
    });
    uglyJs("./build");
  }
  
  try {
    try {
      const key = fs.readFileSync(path.join("./src/server/configuration/", ".key"), "utf-8");
      const queryHtml = fs.readFileSync(path.join("./src/server/views/html/", "query.html"), "utf-8");
      const conf = {
        "admin": {
            "key": "my qui ses scions",
            "pg_host": "db",
            "pg_user": "sensorthings",
            "pg_password": "sensorthings",
            "pg_database": "admin",
            "retry": 10,
        },
        "sensorthings": {
            "port": 8029,
            "pg_host": "db",
            "pg_user": "sensorthings",
            "pg_password": "sensorthings",
            "pg_database": "sensorthings",
            "apiVersion": "v1.0",
            "date_format": "DD/MM/YYYY hh:mm:ss",
            "webSite": "https://api.geosas.fr/sensorthings/",
            "retry": 10,
        }
      };
      if (mode.includes("docker")) writeFile("./build/configuration/config.json", JSON.stringify(conf, null, 2));
      writeFile("./build/configuration/.key", key);
      writeFile("./build/configuration/update.json", JSON.stringify(updateJson, null, 2));

      minify({ compressor: htmlMinifier, content: queryHtml.replace("@version@", packageJson.version) }).then(function (min) {
        writeFile("./build/views/html/query.html", min, "minify HTML");
      });

    } catch (error) {
      console.log(error);
      console.log("\x1b[31m No configuration file \x1b[34m : \x1b[37m found\x1b[0m");
    }
  } catch (error) {
    console.log(error);
    console.log("\x1b[31m configuration \x1b[34m : \x1b[37m not write\x1b[0m");
  }

  const fileRelease = `stean_${packageJson.version}.zip`
    
  if (!mode.includes("docker")) zipDirectory("./build", `./builds/${fileRelease}`).then(function (e) {
    console.log(`\x1b[32m ./build \x1b[36m zip to ==> \x1b[35m ${fileRelease} \x1b[0m`);
    zipDirectory("./build", `./builds/stean_latest.zip`).then(function (e) {
      console.log(`\x1b[32m ./build \x1b[36m zip to ==> \x1b[35m stean_latest.zip \x1b[0m`);
    }); 
  }); 
  
});
