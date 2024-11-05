/**
 * HTML Views Login for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { log } from "../../log";
import { info } from "../../messages";
import { IKeyString, koaContext } from "../../types";
import { CoreHtmlView } from "./core";
interface Idatas { 
  login: boolean; 
  body?: any; 
  why?: IKeyString
}

export class Login extends CoreHtmlView {
    constructor(ctx: koaContext, datas: Idatas) {
        console.log(log.whereIam("View"));
        super(ctx);
        this.login(datas);
    }
    private login(datas: Idatas) {
        const alert = (name: string): string => {
            return datas.why && datas.why[name] ? `<div class="alert">${datas.why[name]}</div>` : "";
        };
      const url = `${this.ctx.decodedUrl.linkbase}/${this.ctx.service.apiVersion}`;  
        this._HTMLResult = [`
          <!DOCTYPE html>
            <html>
              ${this.head("Login")}    
            <body>
                <div class="login-wrap">
                  <div class="login-html">
                    ${this.title("Identification")}
                    <input  id="tab-1" type="radio" name="tab" class="sign-in" ${datas.login ? " checked" : ""}>
                    <label for="tab-1" class="tab">Sign In</label>
                    <input  id="tab-2" type="radio" name="tab" class="sign-up" ${ datas.login ? "" : "checked" }>
                    <label for="tab-2" class="tab">Sign Up</label>
                    <div class="login-form">
                      <form action="${url}/login" method="post">
                        <div class="sign-in-htm">
                          ${this.addTextInput({name: "username", label: "Username", value: ""})}
                          ${this.addTextInput({name: "password", label: "Password", value: "", password: true})}
                          ${this.addCheckBox({name: "check", checked: true, label: " Keep me Signed in"})}
                          ${this.addSubmitButton("Sign In")}
                          ${this.hr()}
                          ${this.addButton(`${url}/Query`, "Return to Query")}
                          <div class="foot-lnk">
                            <a href="#forgot">Forgot Password?</a>
                          </div>
                        </div>
                      </form>
            
                      <form action="${url}/register" method="post">
                        <div class="sign-up-htm">
                          ${this.addTextInput({name: "username", label: info.user , value: datas.body && datas.body.username ? datas.body.username : "", alert: alert("username"), toolType: `Name ${info.least5Tool}`})}
                          ${this.addTextInput({name: "pass", label: info.pass, password: true, value: datas.body && datas.body.password ? datas.body.password : "", alert: alert("password"), toolType: info.passTool})}
                          ${this.addTextInput({name: "repeat", label: info.rep, password: true, value: "", alert: alert("repeat"), toolType: info.repTool})}
                          ${this.addTextInput({name: "mail", label: "Email address", value: datas.body && datas.body.email ? datas.body.email : "", alert: alert("email"), toolType: info.mailTool})}
                          ${this.addSubmitButton("Sign UP")}
                          ${this.hr()}                                
                          <div class="foot-lnk">
                            <label for="tab-1">Already Member ?</a>
                          </div>
                        </div>
                      </form>
                  </div>
                </div>
              </div>
            </body>                  
          </html>`];
    };
  }
