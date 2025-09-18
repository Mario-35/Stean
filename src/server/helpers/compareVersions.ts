/**
 * AutoUpdate
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { readRemoteVersion } from ".";
import { appVersion } from "../constants";
import { EConstant } from "../enums";
import { logging } from "../log";
import { Iversion } from "../types";

/**
 * Checks the local version of the application against the remote repository.
 *
 * @param UpToDate - If the local version is the same as the remote version.
 * @param appVersion - The version of the local application.
 * @param remoteVersion - The version of the application in the git repository.
 * @returns An object with the results of the version comparison.
 */
export async function compareVersions(): Promise<{ upToDate: boolean; appVersion: Iversion; remoteVersion: Iversion | undefined } | undefined> {
    try {
        const remoteVersion = await readRemoteVersion();
        return remoteVersion ? { upToDate: appVersion.version == remoteVersion.version && appVersion.date == remoteVersion.date, appVersion: appVersion, remoteVersion: remoteVersion } : undefined;
    } catch (err) {
        logging.error(err + EConstant.return).write(true);
        return undefined;
    }
}
