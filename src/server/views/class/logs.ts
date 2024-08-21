/**
 * HTML Views Logs for API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- HTML Views Logs for API -----------------------------------!");

import { koaContext } from "../../types";
import { CoreHtmlView } from "./core";
import fs from "fs";
import path from "path";

export class HtmlLogs extends CoreHtmlView {            
    // use data to name ifle
    constructor(ctx: koaContext, datas: string) {
        const fileContent = fs.readFileSync(path.resolve(__dirname, datas), "utf8");
        super(ctx);
        this.logs(fileContent);
    }

    private logs(message: string) {
        this._HTMLResult = [`
        <!DOCTYPE html>
            <html>
                <body style="background-color:#353535;">
                    ${message}
                </body>
            </html>`];
    };
  }
