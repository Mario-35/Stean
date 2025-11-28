/**
 * httpsDownloadJSON
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import https from "https";
import { logging } from "../log";

export function httpsDownloadJSON(url: string, filename?: string): Promise<JSON | Error> {
    return new Promise((resolve, reject) => {
        let data = "";
        try {
            https.get(url, { headers: { "User-Agent": "javascript" } }, (response) => {
                response
                    .on("data", (append) => (data += append))
                    .on("error", (e) => {
                        reject(e);
                    })
                    .on("end", () => resolve(JSON.parse(data)));
            });
        } catch (error) {
            reject(logging.error(error).return(undefined));
        }
    });
}
