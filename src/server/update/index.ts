/**
 * AutoUpdate
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import path from "path";
import fs from "fs";
import { spawn, exec } from "child_process";
import https from "https";
import { _TEMP_NAME_FILE, appVersion, newVersionPath, rootpath, uploadPath } from "../constants";
import { httpsDownload } from "./helpers/httpsDownload ";
import AdmZip from "adm-zip";
import { log } from "../log";
import { config } from "../configuration";

/**
 * AutoUpdate Class
 */
class AutoUpdate {
    static repository: string = "https://github.com/Mario-35/Stean";
    static branch: string = "main";
    exitOnComplete: boolean = true;

    /**
     * Create Zip from a folder
     *
     * @param sourceDir folder path
     * @param outputFilePath destination file
     * @returns boolean
     */
    async zipDirectory(sourceDir: string, outputFilePath: string): Promise<boolean> {
        const zip = new AdmZip();
        zip.addLocalFolder(sourceDir);
        try {
            await zip.writeZipPromise(outputFilePath);
            return true;
        } catch (error) {
            process.stdout.write(log.update(error + "\n"));
        }
        return false;
    }

    /**
     * unzip Zip file
     *
     * @param inputFilePath zip source file
     * @param outputFilePath destination folder
     * @returns boolean
     */
    async unzipDirectory(inputFilePath: string, outputDirectory: string) {
        const zip = new AdmZip(inputFilePath);
        return new Promise<boolean>((resolve, reject) => {
            zip.extractAllToAsync(outputDirectory, true, true, (error: any) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    process.stdout.write(log.update(`Extracted to "${outputDirectory}" successfully`));
                    resolve(true);
                }
            });
        });
    }

    /**
     * Checks the local version of the application against the remote repository.
     *
     * @param UpToDate - If the local version is the same as the remote version.
     * @param appVersion - The version of the local application.
     * @param remoteVersion - The version of the application in the git repository.
     * @returns An object with the results of the version comparison.
     */
    async compareVersions(): Promise<{ upToDate: boolean; appVersion: string; remoteVersion?: string }> {
        try {
            const remoteVersion = await this.readRemoteVersion();
            if (remoteVersion) {
                if (appVersion != remoteVersion) return { upToDate: false, appVersion, remoteVersion };
            } else return { upToDate: false, appVersion: "Error", remoteVersion: "Error" };
            return { upToDate: true, appVersion, remoteVersion };
        } catch (err) {
            process.stdout.write(log.update(err + "\n"));
            return { upToDate: false, appVersion: "Error", remoteVersion: "Error" };
        }
    }

    /**
     * Clones the git repository, purges ignored files, and installs the update over the local application.
     * A backup of the application is created before the update is installed.
     * If configured, a completion command will be executed and the process for the app will be stopped.
     * @returns {Boolean} The result of the update.
     */
    async update(): Promise<boolean> {
        try {
            process.stdout.write(log.update("Updating application from " + AutoUpdate.repository + "\n"));
            if ((await this.downloadUpdate()) === true) {
                await this.backupApp();
                await this.installUpdate();
                await this.installDependencies();
                // await this.promiseBlindExecute("npm run dev");
                process.exit(1);
            }
        } catch (err) {
            process.stdout.write(log.update("Error updating application" + "\n"));
            process.stdout.write(log.update(err + "\n"));
        }
        return false;
    }

    /**
     * Creates a backup of the application, including node modules.
     * The backup is stored in the configured tempLocation. Only one backup is kept at a time.
     */
    async backupApp() {
        await this.zipDirectory(rootpath, uploadPath + `/backup${_TEMP_NAME_FILE}.zip`);
        process.stdout.write(log.update("Backing up app to " + uploadPath + "\n"));
        return true;
    }

    /**
     * Downloads the update from the configured git repository.
     * The repo is cloned to the configured tempLocation.
     */
    async downloadUpdate() {
        return await httpsDownload(AutoUpdate.repository + "/raw/main/builds/stean_latest.zip", "update.zip").then(() => true);
    }

    /**
     * Runs npm install to update/install application dependencies.
     */
    installDependencies() {
        return new Promise(function (resolve, reject) {
            //If this.testing is enabled, use alternative path to prevent overwrite of app.
            let destination = path.join(newVersionPath);
            process.stdout.write(log.update("Installing application dependencies in " + destination));
            // Generate and execute command
            let command = `cd ${destination} && npm install`;
            let child = exec(command);

            // Wait for results
            child.stdout?.on("end", resolve);
            child.stdout?.on("data", (data) => process.stdout.write(log.update("npm install: " + data.replace(/\r?\n|\r/g, ""))));
            child.stderr?.on("data", (data) => {
                if (data.toLowerCase().includes("error")) {
                    // npm passes warnings as errors, only reject if "error" is included
                    data = data.replace(/\r?\n|\r/g, "");
                    process.stdout.write(log.update("Error installing dependencies" + "\n"));
                    process.stdout.write(log.update(data + "\n"));
                    reject();
                } else {
                    process.stdout.write(log.update(data + "\n"));
                }
            });
        });
    }

    /**
     * Purge ignored files from the update, copy the files to the app directory, and install new modules
     * The update is installed from  the configured tempLocation.
     */
    async installUpdate(): Promise<boolean> {
        await this.unzipDirectory(path.join(uploadPath + "/update.zip"), newVersionPath);
        config.saveConfig(newVersionPath + "configuration/");
        // fs.copyFile(rootpath + "/configuration/.key", newVersionPath + "/configuration/.key", (err) => {
        //     if (err) {
        //         console.log("Error Found:", err);
        //         return false;
        //     }
        // });
        // fs.copyFile(rootpath + "/configuration/configuration.json", newVersionPath + "/configuration/configuration.json", (err) => {
        //     if (err) {
        //         console.log("Error Found:", err);
        //         return false;
        //     }
        // });
        return true;
    }

    /**
     * Reads the applications version from the git repository.
     */
    async readRemoteVersion(): Promise<string | undefined> {
        try {
            await httpsDownload(AutoUpdate.repository.replace("github.com", "raw.githubusercontent.com") + `/refs/heads/${AutoUpdate.branch}/package.json`, "2package.json");
            return JSON.parse(fs.readFileSync(path.join(uploadPath, "2package.json"), "utf-8")).version;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    /**
     * A promise wrapper for the child-process spawn function. Does not listen for results.
     * @param {String} command - The command to execute.
     */
    promiseBlindExecute(command: string) {
        return new Promise(function (resolve, reject) {
            spawn(command, [], { shell: true, detached: true });
            setTimeout(resolve, 1000);
        });
    }

    /**
     * A promise wrapper for sending a get https requests.
     * @param {String} url - The Https address to request.
     * @param {String} options - The request options.
     */
    promiseHttpsRequest(url: string, options: https.RequestOptions) {
        return new Promise(function (resolve, reject) {
            let req = https.request(url, options, (res) => {
                //Construct response
                let body = "";
                res.on("data", (data) => {
                    body += data;
                });
                res.on("end", function () {
                    if (res && res.statusCode && res.statusCode === 200) return resolve(body);
                    process.stdout.write(log.update("Bad Response " + res.statusCode + "\n"));
                    reject(res.statusCode);
                });
            });
            process.stdout.write(log.update("Sending request to " + url + "\n"));
            process.stdout.write(log.update("Options: " + JSON.stringify(options) + "\n"));
            req.on("error", reject);
            req.end();
        });
    }

    async sleep(time: number) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, time);
        });
    }
}

export const autoUpdate = new AutoUpdate();
