/**
 * AutoUpdate
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { connectWeb, httpsDownloadJSON } from ".";
import { EConstant } from "../enums";
import { Iversion } from "../types";

/**
 * Reads the applications version from the git repository.
 */
export async function readRemoteVersion(): Promise<Iversion | undefined> {
    return connectWeb().then(async () => {
        try {
            const file = EConstant.repository.replace("github.com", "raw.githubusercontent.com") + `/refs/heads/${EConstant.branch}/builds/stean_latest.info`;
            const version = await httpsDownloadJSON(file, "stean_latest.info");
            return version ? { version: version["version" as keyof object], date: version["date" as keyof object] } : undefined;
        } catch (error) {
            console.log(error);
            return;
        }
    });
}
