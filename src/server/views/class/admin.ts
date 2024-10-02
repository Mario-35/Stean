/**
 * HTML Views First Install for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- HTML Views First Install for API -----------------------------------!\n");

import { info } from "../../messages";
import { IKeyString, koaContext } from "../../types";
import { CoreHtmlView } from "./core";
import { Service } from "./service";

interface Idatas { 
  login: boolean; 
  url: string; 
  body?: any; 
  why?: IKeyString
}

export class Admin extends CoreHtmlView {
    constructor(ctx: koaContext, datas: Idatas) {
        super(ctx);        
        this.admin(ctx, datas);
    }

    private admin(ctx: koaContext, datas: Idatas) {
      if (datas.body._src === "_admin") {
        return new Service(ctx, { login: false , url: ctx.request.url, body: datas.body, why: {}})

      }
      const alert = (name: string): string => (datas.why && datas.why[name] ? `<div class="alert">${datas.why[name]}</div>` : "");
        this._HTMLResult = [`
            <!DOCTYPE html>
            <html>
              ${this.head("Login")}    
              <body>
                <div class="login-wrap">
                  <div class="login-html">
                    ${this.title("Authentification")}
                    <div class="login-form">
                      <form action="/service" method="post">
                          ${this.addHidden("_src", "_admin")}
                          ${this.addHidden("host", "localhost")}
                          ${this.addTextInput({name: "username", label: info.user, value: datas.body && datas.body.username || "postgres", alert: alert("username")})}
                          ${this.addTextInput({name: "password", label: info.pass, password: true, value: "", alert: alert("password")})}
                          ${this.hr()}
                          ${this.addSubmitButton(info.conn)}
                          ${ datas.why && datas.why["_error"] ? this.AddErrorMessage(datas.why["_error"]) : ""}
                      </form>
                    </div>
                  </div>
                </div>
              </body>                  
            </html>`];
    };
  }
