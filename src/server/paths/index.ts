/**
 * Paths
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import path from "path";
import fs from "fs";
import { File } from "./files";
import { EConstant } from "../enums";
import { logging } from "../log";

/**
 * Paths Class
 */
class Paths {
    // root (where "package.json" found)
    public root: string;
    // root app (index)
    public app: string = path.join(path.resolve(__dirname), "../");
    private pkg: string = "package.json";
    public logFile: File;
    public configFile: File;
    key: string;
    constructor() {
        // Important to be first
        this.root = this.searchRootApp(path.join(__dirname)) || "Error";
        // check upload directory exists
        if (!fs.existsSync(this.upload())) fs.mkdirSync(this.upload());
        // backup log create new one stream it
        this.logFile = new File(path.join(this.root, "logs/"), "logs.html", ["backup", "stream"]);
        this.logFile.writeStream(`<!DOCTYPE html>${EConstant.return}<html>${EConstant.return}<body style="background-color:#353535;">`);
        // get config file
        this.configFile = new File(path.join(this.app, "/configuration/"), "configuration.json", []);
        // check .key and create defaulh one if not exist or corrupt
        try {
            this.key = fs.readFileSync(path.join(this.app, "/configuration/", ".key"), "utf8");
        } catch (error) {
            logging.error(error);
            this.key = "zLwX893Mtt9Rc0TKvlInDXuZTFj9rxDV";
            fs.writeFileSync(path.join(this.app, "/configuration/", ".key"), this.key, { encoding: "utf-8" });
        }
    }

    searchRootApp(startPath: string) {
        let i = 1;
        // it's not reachable it's only to exclude infinite loop
        while (i < 50) {
            const file = path.join(startPath, "../".repeat(i), this.pkg);
            if (fs.existsSync(file)) return path.join(startPath, "../".repeat(i), "/");
            i++;
        }
        throw new Error(`No root (${this.pkg}) found`);
    }

    updateFile() {
        return path.join(this.upload(), "update.zip");
    }

    upload() {
        return path.join(this.root, "upload/");
    }

    packageFile(myPath?: string) {
        return myPath ? path.join(myPath, this.pkg) : path.join(this.root, this.pkg);
    }
}

export const paths = new Paths();