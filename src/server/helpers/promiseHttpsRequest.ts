/**
 * promiseBlindExecute
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import https from "https";
import { log } from "../log";
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
                process.stdout.write(log.update("Bad Response " + res.statusCode + EConstant.return));
                reject(res.statusCode);
            });
        });
        process.stdout.write(log.update("Sending request to " + url + EConstant.return));
        process.stdout.write(log.update("Options: " + JSON.stringify(options) + EConstant.return));
        req.on("error", reject);
        req.end();
    });
}
