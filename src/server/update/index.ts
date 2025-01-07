/**
 * AutoUpdate
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import path from 'path';
import fs from "fs";
import {spawn, exec} from 'child_process';
import https from 'https';
import { appVersion,  rootpath, uploadPath } from '../constants';
import { httpsDownload } from './helpers/httpsDownload ';
import { log } from '../log';
import AdmZip from 'adm-zip';


class AutoUpdate {
    repository:string = 'https://github.com/Mario-35/Stean';
    branch:string = 'main';
    exitOnComplete:boolean = true;
    
    async zipDirectory(sourceDir: string, outputFilePath: string) {
        const zip = new AdmZip();        
        zip.addLocalFolder(sourceDir);
        await zip.writeZipPromise(outputFilePath);
        console.log(`Zip file created: ${outputFilePath}`);
    };
    
    async unzipDirectory(inputFilePath: string, outputDirectory: string) {
        const zip = new AdmZip(inputFilePath);
        return new Promise<void>((resolve, reject) => {
            zip.extractAllToAsync(outputDirectory, true, true, (error: any) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log(`Extracted to "${outputDirectory}" successfully`);
                    resolve();
                }
            });
        });
    };
    /**
     * Checks local version against the remote version & then updates if different. 
     */
    async autoUpdate() {
        const versionCheck = await this.compareVersions();
        if (versionCheck.upToDate) return true;
        return await this.update();
    }

    /**
     * @typedef VersionResults
     * @param {Boolean} UpToDate - If the local version is the same as the remote version.
     * @param {String} appVersion - The version of the local application.
     * @param {String} remoteVersion - The version of the application in the git repository. 
     * 
     * Checks the local version of the application against the remote repository.
     * @returns {VersionResults} - An object with the results of the version comparison.
     */
    async compareVersions(): Promise<{ upToDate: boolean; appVersion: string; remoteVersion?: string; }>  {
        try {
            process.stdout.write(log.booting("Current version", appVersion) + "\n");
            let remoteVersion = await this.readRemoteVersion();
            if(remoteVersion) {
                process.stdout.write(log.booting("Remote version", remoteVersion + "\n"));
                if (appVersion != remoteVersion)  return {upToDate: false, appVersion, remoteVersion};
            } else  return {upToDate: false, appVersion: 'Error', remoteVersion: 'Error'}
            return {upToDate: true, appVersion, remoteVersion};
        }catch(err) {
            process.stdout.write('Auto Git Update - Error comparing local and remote versions.' + "\n");
            process.stdout.write(err + "\n");
            return {upToDate: false, appVersion: 'Error', remoteVersion: 'Error'}
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
            process.stdout.write('Auto Git Update - Updating application from ' + this.repository + "\n");
            if (await this.downloadUpdate() === true) {
                await this.backupApp();
                await this.installUpdate();
                await this.installDependencies();
                // process.stdout.write('Auto Git Update - Finished installing updated version.' + "\n");
                await this.promiseBlindExecute("npm run dev");
                process.exit(1);
                return true;
            }
        }catch(err) {
            process.stdout.write('Auto Git Update - Error updating application' + "\n");
            process.stdout.write(err + "\n");
        }
        return false;
    }
    
    /**
     * Creates a backup of the application, including node modules. 
     * The backup is stored in the configured tempLocation. Only one backup is kept at a time. 
     */
    async backupApp() {
        const dateFile = `${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}`.split("/").join("").split(":").join("");
        await this.zipDirectory(rootpath, uploadPath + `/backup${dateFile}.zip`);
        process.stdout.write('Auto Git Update - Backing up app to ' + uploadPath + "\n");
        return true;
    }
    

    /**
     * Downloads the update from the configured git repository.
     * The repo is cloned to the configured tempLocation. 
     */
    async downloadUpdate() {
        return await httpsDownload(this.repository + "/raw/main/builds/stean_latest.zip", 'update.zip').then(() => true);
    }

    /**
     * Runs npm install to update/install application dependencies.
     */
    installDependencies() {
        return new Promise(function(resolve, reject) {
            //If this.testing is enabled, use alternative path to prevent overwrite of app. 
            let destination = path.join(rootpath + "/updateTest");
            process.stdout.write('Auto Git Update - Installing application dependencies in ' + destination);
            // Generate and execute command
            let command = `cd ${destination} && npm install`;
            let child = exec(command);
            
            // Wait for results
            child.stdout?.on('end', resolve);
            child.stdout?.on('data', data => process.stdout.write('Auto Git Update - npm install: ' + data.replace(/\r?\n|\r/g, '')));
            child.stderr?.on('data', data => {
                if (data.toLowerCase().includes('error')) {
                    // npm passes warnings as errors, only reject if "error" is included
                    data = data.replace(/\r?\n|\r/g, '');
                    process.stdout.write('Auto Git Update - Error installing dependencies' + "\n");
                    process.stdout.write('Auto Git Update - ' + data + "\n");
                    reject();
                }else{
                    process.stdout.write('Auto Git Update - ' + data + "\n");
                }
            });
        });
    }

    /**
     * Purge ignored files from the update, copy the files to the app directory, and install new modules
     * The update is installed from  the configured tempLocation.
     */
    async installUpdate() {
        let source = path.join(uploadPath + '/update.zip');
        let destination = path.join(rootpath + "/updateTest");
        await this.unzipDirectory(source, destination);
        process.stdout.write('Auto Git Update - Installing update...');
        process.stdout.write('Auto Git Update - Source: ' + source);
        process.stdout.write('Auto Git Update - Destination: ' + destination);
        fs.copyFile(rootpath + "/configuration/.key", rootpath + "/updateTest/configuration/.key", (err) => {
            if (err) {
                console.log("Error Found:", err);
                return false;
            }
        });
        fs.copyFile(rootpath + "/configuration/configuration.json", rootpath + "/updateTest/configuration/configuration.json", (err) => {
            if (err) {
                console.log("Error Found:", err);
                return false;
            }
        });
        return true;
    }

    /**
     * Reads the applications version from the git repository.
     */
    async readRemoteVersion(): Promise<string | undefined> {
        try {            
            await httpsDownload(this.repository.replace('github.com', 'raw.githubusercontent.com') + `/refs/heads/${this.branch}/package.json`, "2package.json");
            return JSON.parse(fs.readFileSync(path.join(uploadPath,  "2package.json"), "utf-8")).version;
        } catch (error) {
            console.log(error);            
        }
    }

    /**
     * A promise wrapper for the child-process spawn function. Does not listen for results.
     * @param {String} command - The command to execute. 
     */
    promiseBlindExecute(command: string) {
        return new Promise(function(resolve, reject) {
            spawn(command, [], {shell: true, detached: true});
            setTimeout(resolve, 1000);
        });
    }

    /**
     * A promise wrapper for sending a get https requests.
     * @param {String} url - The Https address to request.
     * @param {String} options - The request options. 
     */
    promiseHttpsRequest(url: string, options: https.RequestOptions) {
        return new Promise(function(resolve, reject) {
            let req = https.request(url, options, res => {
                //Construct response
                let body = '';
                res.on('data', data => {body += data});
                res.on('end', function() {
                    if (res && res.statusCode && res.statusCode === 200) return resolve(body);
                    process.stdout.write('Auto Git Update - Bad Response ' + res.statusCode + "\n");
                    reject(res.statusCode);
                });
            });
            process.stdout.write('Auto Git Update - Sending request to ' + url + "\n");
            process.stdout.write('Auto Git Update - Options: ' + JSON.stringify(options) + "\n");
            req.on('error', reject);
            req.end();
        }); 
    }

    async sleep(time: number) {
        return new Promise(function(resolve, reject) {
            setTimeout(resolve, time);
        });
    } 

}

export const autoUpdate = new AutoUpdate();
