/**
 * HTML Views Error for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { _DEBUG } from "../../constants";
import { logging } from "../../log";
import { Idatas, koaContext } from "../../types";
import { CoreHtmlView } from "./core";

/**
 * Error Class for HTML View
 */

export class HtmlError extends CoreHtmlView {
    constructor(ctx: koaContext, datas: Idatas) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx, datas);
        this.error(datas.message, datas.url);
    }
    private error(message: string | undefined, url: string) {
        // const ref = this.ctx.- && this.ctx.-.linkbase ? `${this.ctx.-.linkbase + `/${this.ctx.-.service.apiVersion}/Query`}` : "";
        this._HTMLResult = [
            `<!DOCTYPE html>
            <html>
                ${this.head("Error")}
                <body>
                    <div class="login-error">
                        <div class="login-html">
                            ${this.title("Error", "titleError")}
                            <h3>${message}</h3>
                            ${this.hr()}
                            <div id="outer">
                                <div class="inner">
                                    <a href="${url}" class="button-submit">${url.includes("admin") ? "Admin login" : "Login"}</a>
                                </div>
                                <div class="inner">
                                    <a  href="/" class="button">Documentation</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>`
        ];
    }
}
