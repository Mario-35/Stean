/**
 * HTML Views Error for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { log } from "../../log";
import { Idatas, koaContext } from "../../types";
import { CoreHtmlView } from "./core";

/**
 * Error Class for HTML View
 */
export class HtmlError extends CoreHtmlView {
    constructor(ctx: koaContext, datas: Idatas) {
        console.log(log.whereIam("View"));
        super(ctx, datas);
        this.error(datas.url);
    }
    private error(message: string) {
        this._HTMLResult = [
            `
        <!DOCTYPE html>
            <html>
                ${this.head("Error")}
                <body>
                    <div class="login-wrap">
                        <div class="login-html">
                            ${this.title("Error")}
                            <h1>Error.</h1>
                            <div class="hr">
                            </div>
                            <h3>On error page</h3> <h3>${message}</h3>
                            ${this.hr()}
                            <div id="outer">
                                <div class="inner">
                                    <a href="/Login" class="button-submit">Login</a>
                                </div>
                                <div class="inner">
                                    <a  href="${this.ctx.decodedUrl.linkbase + `/${this.ctx.service.apiVersion}/Query`}" class="button">query</a>
                                </div>
                            </div>
                        </div>
                    </body>
                </html>`
        ];
    }
}
