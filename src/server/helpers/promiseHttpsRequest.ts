/**
 * promiseBlindExecute
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import https from "https";
import { logging } from "../log";
import { EConstant } from "../enums";

/**
 * A promise wrapper for sending a get https requests.
 * @param {String} url - The Https address to request.
 * @param {String} options - The request options.
 */

export function promiseHttpsRequest(url: string, options: https.RequestOptions) {
    return new Promise(function (resolve, reject) {
        let req = https.request(url, options, (res) => {
            //Construct response
            let body = "";
            res.on("data", (data) => {
                body += data;
            });
            res.on("end", function () {
                if (res && res.statusCode && res.statusCode === 200) return resolve(body);
                logging
                    .message("update", "Bad Response " + res.statusCode + EConstant.return)
                    .to()
                    .log()
                    .file();
                reject(res.statusCode);
            });
        });
        logging
            .message("update", "Sending request to " + url + EConstant.return)
            .to()
            .log()
            .file();
        logging
            .message("update", "Options: " + JSON.stringify(options) + EConstant.return)
            .to()
            .log()
            .file();
        req.on("error", reject);
        req.end();
    });
}
