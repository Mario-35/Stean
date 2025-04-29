/**
 * HTML Views Logs for API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Idatas, koaContext } from "../../types";
import { CoreHtmlView } from "./core";
import fs from "fs";

/**
 * Logs Class for HTML View
 */

export class HtmlLogs extends CoreHtmlView {
    // use data to name ifle
    constructor(ctx: koaContext, datas: Idatas) {
        const fileContent = fs.readFileSync(datas.url, "utf8");
        super(ctx, datas);
        this.logs(fileContent);
    }
    private logs(message: string) {
        this._HTMLResult = [
            `<!DOCTYPE html>
            <html>
                <body style="background-color:#353535;">
                    ${message}
                </body>
            </html>`
        ];
    }
}
