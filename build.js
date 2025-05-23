"use strict";
const UglifyJS = require("uglify-js");
const minify = require("@node-minify/core");
const cleanCSS = require("@node-minify/clean-css");
const htmlMinifier = require('@node-minify/html-minifier');
var globby = require("globby");
var path = require("path");
var fs = require("graceful-fs");
var mkdirp = require("mkdirp");
var archiver = require("archiver");
var crypto = require("crypto");
process.env.NODE_ENV = "build";
const _DEST = "build/server/";
const FINAL = "build/";

function extend() {
  var defineProperty = Object.defineProperty;
  var setProperty = function setProperty(target, options) {
    if (defineProperty && options.name === '__proto__') {
      defineProperty(target, options.name, {
        enumerable: true,
        configurable: true,
        value: options.newValue,
        writable: true
      });
    } else {
      // eslint-disable-next-line no-param-reassign
      target[options.name] = options.newValue;
    }
  };
  
  // Return undefined instead of __proto__ if '__proto__' is not an own property
  var getProperty = function getProperty(obj, name) {
    if (name === '__proto__') {
      if (!hasOwn.call(obj, name)) {
        return void 0;
      } else if (gOPD) {
        // In early versions of node, obj['__proto__'] is buggy when obj has __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
        return gOPD(obj, name).value;
      }
    }
  
    return obj[name];
  };
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && ((copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src  ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
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
    fs.mkdirSync(targetFolder,
      { recursive: true },
      (err) => {
        if (err) {
          return console.error(err);
        }
        console.log(`\x1b[31m Create Folder \x1b[34m : \x1b[33m ${targetFolder}\x1b[0m`);
    });
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
    fs.writeFile(filePath, code, function (err) {
      if (err) {
        console.error("Error: " + err);
        return;
      }
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
      else writeFile(newName, temp.code, "uglyJs");
    }
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const mode = ["build"];

if (process.argv.includes("dev")) mode.push("dev");
if (process.argv.includes("docker")) mode.push("docker");

copyFolderRecursiveSync("./scripts", _DEST);
copyFolderRecursiveSync("./src/server/views", _DEST);
copyFolderRecursiveSync("./src/server/views/js", _DEST + "views/");
copyFolderRecursiveSync( "./src/server/views/css", _DEST + "views/" );
copyFolderRecursiveSync( "./src/server/db/createDb/pgFunctions", _DEST + "db/createDb/" );
copyFileSync( "./src/server/favicon.ico", _DEST );
copyFileSync("./src/server/models/model.drawio", _DEST + "models/");

const packageJson = require("./package.json");
delete packageJson.scripts;
delete packageJson.devDependencies;
packageJson["scripts"] = {
  "start": "pm2 start stean.js --watch"
}
  
fs.writeFile(FINAL + "package.json", JSON.stringify(packageJson, null, 2), { encoding: "utf-8" },function (err) {
  if (err) console.log(err);
  messageWrite("package.json", "user mode");
  if (!mode.includes("dev")) {
    const start = fs.readFileSync(_DEST + "start.js", "utf-8");
    writeFile(FINAL + "stean.js", start.replace('require(".");', 'require("./server/index");'), "create start file");
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
            "version": "v1.0",
            "date_format": "DD/MM/YYYY hh:mm:ss",
            "webSite": "@_URL_@",
            "retry": 10,
        }
      };
      if (mode.includes("docker")) writeFile(_DEST + "configuration/config.json", JSON.stringify(conf, null, 2));
      writeFile(_DEST + "configuration/.key", key, "Write .Key");

      minify({ compressor: htmlMinifier, content: queryHtml.replace("@version@", packageJson.version) }).then(function (min) {
        writeFile(_DEST + "views/html/query.html", min, "minify HTML");
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
  
  if (!mode.includes("docker")) zipDirectory(FINAL, `./builds/${fileRelease}`).then(function (e) {
    console.log(`\x1b[34m ${FINAL} \x1b[36m zip to ==> \x1b[37m ${fileRelease} \x1b[0m`);

    zipDirectory(FINAL, `./builds/stean_latest.zip`).then(function (e) {
      console.log(`\x1b[34m ${FINAL} \x1b[36m zip to ==> \x1b[37m stean_latest.zip \x1b[0m`);
    }); 
  }); 
  
});


