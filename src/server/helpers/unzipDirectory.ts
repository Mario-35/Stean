/**
 * unzipDirectory
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import AdmZip from "adm-zip";
import { log } from "../log";

/**
 * unzip Zip file
 *
 * @param inputFilePath zip source file
 * @param outputFilePath destination folder
 * @returns boolean
 */
export async function unzipDirectory(inputFilePath: string, outputDirectory: string) {
    const zip = new AdmZip(inputFilePath);
    return new Promise<boolean>((resolve, reject) => {
        zip.extractAllToAsync(outputDirectory, true, true, (error: any) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                process.stdout.write(log.update(`Extracted to "${outputDirectory}" successfully` + "\n"));
                resolve(true);
            }
        });
    });
}
