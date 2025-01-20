/**
 * httpsDownload
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import https from "https";
import fs from "fs";
import path from "path";
import { paths } from "../paths";

export function httpsDownload(url: string, filename?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const req = https
            .request(url, { headers: { "User-Agent": "javascript" } }, (response) => {
                if (response.statusCode === 302 && response.headers.location != null) {
                    httpsDownload(buildNextUrl(url, response.headers.location), filename).then(resolve).catch(reject);
                    return;
                }
                const file = fs.createWriteStream(buildDestinationPath(url, filename));
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    resolve();
                });
            })
            .on("error", reject);
        req.end();
    });
}

function buildNextUrl(current: string, next: string) {
    const isNextUrlAbsolute = RegExp("^(?:[a-z]+:)?//").test(next);
    if (isNextUrlAbsolute) {
        return next;
    } else {
        const currentURL = new URL(current);
        const fullHost = `${currentURL.protocol}//${currentURL.hostname}${currentURL.port ? ":" + currentURL.port : ""}`;
        return `${fullHost}${next}`;
    }
}

function buildDestinationPath(url: string, filename?: string) {
    return path.join(paths.upload(), filename ?? generateFilenameFromPath(url));
}

function generateFilenameFromPath(url: string): string {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1] ?? "";
}
