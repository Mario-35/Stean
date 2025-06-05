/**
 * AutoUpdate
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import path from "path";
import { exec } from "child_process";
import { appVersion, dateFile } from "../constants";
import { httpsDownload, httpsDownloadJSON } from "../helpers/";
import { log } from "../log";
import { config } from "../configuration";
import { promiseBlindExecute, unzipDirectory, zipDirectory } from "../helpers";
import { paths } from "../paths";
import { EConstant } from "../enums";
import { Iversion } from "../types";

/**
 * AutoUpdate Class
 */
class AutoUpdate {
    static repository: string = "https://github.com/Mario-35/Stean";
    static branch: string = "main";
    exitOnComplete: boolean = true;

    /**
     * Checks the local version of the application against the remote repository.
     *
     * @param UpToDate - If the local version is the same as the remote version.
     * @param appVersion - The version of the local application.
     * @param remoteVersion - The version of the application in the git repository.
     * @returns An object with the results of the version comparison.
     */
    async compareVersions(): Promise<{ upToDate: boolean; appVersion: Iversion; remoteVersion: Iversion | undefined }> {
        const res = { upToDate: false, appVersion: { version: "Error", date: "Error" }, remoteVersion: { version: "Error", date: "Error" } };
        try {
            const remoteVersion = await this.readRemoteVersion();
            return remoteVersion ? { upToDate: appVersion.version == remoteVersion.version && appVersion.date == remoteVersion.date, appVersion: appVersion, remoteVersion: remoteVersion } : res;
        } catch (err) {
            process.stdout.write(log.update(err + EConstant.return));
            return res;
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
            process.stdout.write(log._head("Updating application" + EConstant.return));
            if ((await this.downloadUpdate()) === true) {
                await this.backupApp();
                await this.installUpdate();
                await this.installDependencies();
                await promiseBlindExecute("npm run dev", 1000);
                process.exit(111);
            }
        } catch (err) {
            log.error("update", "Error updating application");
            process.stdout.write(log.update(err + EConstant.return));
        }
        return false;
    }

    /**
     * Creates a backup of the application, including node modules.
     * The backup is stored in the configured tempLocation. Only one backup is kept at a time.
     */
    async backupApp() {
        await zipDirectory(paths.app, paths.upload() + `backup${dateFile()}.zip`);
        process.stdout.write(log.update("Backing up app to " + paths.upload + EConstant.return));
        return true;
    }

    /**
     * Downloads the update from the configured git repository.
     * The repo is cloned to the configured tempLocation.
     */
    async downloadUpdate() {
        process.stdout.write(log.update("Download from " + AutoUpdate.repository + EConstant.return));
        return await httpsDownload(AutoUpdate.repository + "/raw/main/builds/stean_latest.zip", "update.zip").then(() => true);
    }

    /**
     * Runs npm install to update/install application dependencies.
     */
    installDependencies() {
        return new Promise(function (resolve, reject) {
            //If this.testing is enabled, use alternative path to prevent overwrite of app.
            let destination = paths.newVersion(true);
            process.stdout.write(log.update("Installing application dependencies in " + destination + EConstant.return));
            // Generate and execute command
            let command = `cd ${destination} && npm install`;
            let child = exec(command);

            // Wait for results
            child.stdout?.on("end", resolve);
            child.stdout?.on("data", (data) => process.stdout.write(log.update("npm install: " + data.replace(/\r?\n|\r/g, "")) + EConstant.return));
            child.stderr?.on("data", (data) => {
                if (data.toLowerCase().includes("error")) {
                    // npm passes warnings as errors, only reject if "error" is included
                    data = data.replace(/\r?\n|\r/g, "");
                    process.stdout.write(log.update("Error installing dependencies" + EConstant.return));
                    process.stdout.write(log.update(data + EConstant.return));
                    reject();
                } else {
                    process.stdout.write(log.update(data + EConstant.return));
                }
            });
        });
    }

    /**
     * Purge ignored files from the update, copy the files to the app directory, and install new modules
     * The update is installed from  the configured tempLocation.
     */
    async installUpdate(): Promise<boolean> {
        await unzipDirectory(paths.updateFile(), paths.newVersion(false));
        config.saveConfig(path.join(paths.newVersion(false), "configuration"));
        return true;
    }

    /**
     * Reads the applications version from the git repository.
     */
    async readRemoteVersion(): Promise<Iversion | undefined> {
        try {
            const file = AutoUpdate.repository.replace("github.com", "raw.githubusercontent.com") + `/refs/heads/${AutoUpdate.branch}/builds/stean_latest.info`;
            const version = await httpsDownloadJSON(file, "stean_latest.info");
            return { version: version["version" as keyof object], date: version["date" as keyof object] };
        } catch (error) {
            console.log(error);
            return;
        }
    }
}

export const autoUpdate = new AutoUpdate();
