/**
 * zipDirectory
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import AdmZip from "adm-zip";
import { log } from "../log";

/**
 * Create Zip from a folder
 *
 * @param sourceDir folder path
 * @param outputFilePath destination file
 * @returns boolean
 */
export async function zipDirectory(sourceDir: string, outputFilePath: string): Promise<boolean> {
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
