/**
 * File
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import path from "path";
import fs from "fs";

/**
 * File Class
 */
export class File {
    // path of the file
    public pathName: string;
    // path and name of the file
    public fileName: string;
    private extension: string;
    private stream: fs.WriteStream | undefined = undefined;
    constructor(pathName: string, fileName: string, options: string[]) {
        this.pathName = pathName;
        this.extension = fileName.split(".").reverse()[0];
        this.fileName = path.join(pathName, fileName);
        // if folder no exist create it
        if (!fs.existsSync(pathName)) fs.mkdirSync(pathName);
        // if file is empty delete it
        if (fs.existsSync(this.fileName) && fs.readFileSync(this.fileName, "utf8").trim() === "") fs.unlinkSync(this.fileName);
        if (options.includes("backup")) if (fs.existsSync(this.fileName)) fs.renameSync(this.fileName, this.fileName.split(".").join(`-${new Date().toISOString().slice(0, 16).replace(/:/g, "H")}.`));
        if (options.includes("stream")) this.stream = fs.createWriteStream(this.fileName, { flags: "w" });
    }

    writeStream(input: string) {
        if (this.stream) this.stream.write(input);
    }

    list() {
        const result: string[] = [];
        fs.readdirSync(this.pathName)
            .filter((e: string) => e.endsWith(this.extension))
            .forEach((file) => {
                result.push(file);
            });
        return result;
    }
}
