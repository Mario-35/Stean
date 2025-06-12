/**
 * Start of The API
 *
 * @copyright 2020-present Inrae
 * @review 29-01-2024
 * @author mario.adam@inrae.fr
 *
 */
const fs = require("fs");
import { server } from ".";

function message<T>(cle: string, infos: T) {
    process.stdout.write(`\x1b[36m${cle} \x1b[32m:\x1b[37m ${infos}\x1b[0m \n`);
}

if (fs.existsSync("./newVersion")) {
    process.stdout.write(`\x1b[34m${"▬".repeat(24)} \x1b[32m New Versin detected \x1b[34m${"▬".repeat(24)}\x1b[0m \n`);
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
process.stdout.write(`\x1b[34m${"▬".repeat(24)}\x1b[32m Run index.js \x1b[34m${"▬".repeat(24)}\x1b[0m \n`);

server;
