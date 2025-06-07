/**
 * httpsDownloadJSON
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import https from "https";

export function httpsDownloadJSON(url: string, filename?: string): Promise<JSON> {
    return new Promise((resolve, reject) => {
        let data = "";
        https.get(url, { headers: { "User-Agent": "javascript" } }, (response) => {
            response
                .on("data", (append) => (data += append))
                .on("error", (e) => reject(e))
                .on("end", () => resolve(JSON.parse(data)));
        });
    });
}
