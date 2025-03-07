// const fs = require("node:fs");
const fs = require("fs");
import { server } from ".";
import { EConstant } from "./enums";

function message<T>(cle: string, infos: T) {
    process.stdout.write(`\x1b[36m${cle} \x1b[32m:\x1b[37m ${infos}\x1b[0m ${EConstant.return}`);
}

if (fs.existsSync("./newVersion")) {
    process.stdout.write(`\x1b[34m${"▬".repeat(24)} \x1b[32m New Versin detected \x1b[34m${"▬".repeat(24)}\x1b[0m ${EConstant.return}`);
    fs.rename("./server", "./bak", (err: Error) => {
        message("update", "Backup server");
        if (err) {
            console.error(err);
            process.exit(112);
        }
        message("new", "folder server");
        fs.rename("./newVersion", "./server", (err: Error) => {
            if (err) {
                console.error(err);
                process.exit(112);
            }
        });
    });
}
process.stdout.write(`\x1b[34m${"▬".repeat(24)}\x1b[32m Run index.js \x1b[34m${"▬".repeat(24)}\x1b[0m ${EConstant.return}`);

server;
