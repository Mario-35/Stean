/**
 * HTML Views Error for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { koaContext } from "../../types";
import { CoreHtmlView } from "./core";
export class HtmlError extends CoreHtmlView {
    constructor(ctx: koaContext, datas: string) {
        super(ctx);
        this.error(datas);
    }
    private error(message: string) {
        this._HTMLResult = [`
        <!DOCTYPE html>
            <html>
                ${this.head( "Error")}
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
                                    <a  href="${ this.ctx.decodedUrl.linkbase + `/${this.ctx.config.apiVersion}/Query`}" class="button">query</a>
                                </div>
                            </div>
                        </div>
                    </body>
                </html>`];
    };
  }
