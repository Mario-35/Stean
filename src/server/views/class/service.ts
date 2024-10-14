/**
 * HTML ViewsNew Service for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EExtensions, enumKeys, EOptions } from "../../enums";
import { info } from "../../messages";
import { models } from "../../models";
import { IKeyString, koaContext } from "../../types";
import { CoreHtmlView } from "./core";
interface Idatas { 
  login: boolean; 
  url: string; 
  body?: any; 
  why?: IKeyString
}
export class Service extends CoreHtmlView {
    constructor(ctx: koaContext, datas: Idatas) {
      super(ctx);
      this.service(datas);
    }
    private service(datas: Idatas) {
      const alert = (name: string): string => (datas.why && datas.why[name] ? `<div class="alert">${datas.why[name]}</div>` : "");
        this._HTMLResult = [`
          <!DOCTYPE html>
            <html>
              ${this.head("Login")}    
            <body>
                <script>
                  var expanded = false;
                  function showCheckboxes(checkboxes) {
                      regextensions.style.display = "none";
                      regoptions.style.display = "none";
                    if (!expanded) {
                      checkboxes.style.display = "block";
                      expanded = true;
                    } else {
                      checkboxes.style.display = "none";
                      expanded = false;
                    }
                  }
                </script> 
              <div class="login-wrap">
              <div class="login-html" color="#FF0000">
                    ${this.title(`${datas.body._src === "_first" ? "First" : "New"} service`)}
                    <input  id="tab-1" type="radio" name="tab" class="sign-in" checked>
                    <label for="tab-1" class="tab">New service</label>
                    <input id="tab-2" type="radio" name="tab" class="sign-up">
                    <label for="tab-2" class="tab">New User</label>
                    <div class="login-form">
                      <form action="/service" method="post">
                        <div class="sign-in-htm">
                          ${this.addHidden("_src", datas.body._src === "_first" ? "_createService" : "_addService") }
                          ${this.addHidden("_host", datas.why && datas.why["_host"] ? datas.why["_host"] : "")}
                          ${this.addHidden("_username", datas.why && datas.why["_username"] ? datas.why["_username"] : "")}
                          ${this.addHidden("_password", datas.why && datas.why["_password"] ? datas.why["_password"] : "")}
                          ${this.addTextInput({name: "name", label: "Service name", value: datas.body && datas.body.name || "", alert: alert("name"), toolType: `Name ${info.least5Tool}`})}
                          ${this.addTextInput({name: "port", label: info.pg + " port", value: datas.body && datas.body.port || "5432", alert: alert("port"), toolType: info.portTool})}
                          ${this.addTextInput({name: "database", label: `${info.pg} ${info.db} name`, value: "", alert: alert("database"), toolType: `name of ${info.pg} ${info.db}`})} </td>
                          ${this.addSelect({name: "version", list: models.listVersion().map(e => e.replace("_", ".")) , message: "Select version", password: true, value: "", alert: alert("repeat"), toolType: info.repTool})}
                          ${this.addMultiSelect({name: "extensions", list: enumKeys(EExtensions) , message: "Select extensions"})}                            
                          ${this.addMultiSelect({name: "options", list: enumKeys(EOptions) , message: "Select Options"})}
                        </div> 
                        <div class="sign-up-htm">
                          ${this.addTextInput({name: "host", label: "host", value: datas.why && datas.why["_host"] ? datas.why["_host"] : "localhost", alert: alert("host"), toolType: `Host ${info.least5Tool}`})}
                          ${this.addTextInput({name: "username", label: info.firstUser, value: datas.body && datas.body.username || info.newUser, alert: alert("username"), toolType: `Name ${info.least5Tool}`})}
                          ${this.addTextInput({name: "password", label: `New user ${info.pass}`, password: true, value: datas.body && datas.body.password || "", alert: alert("password"), toolType: info.passTool})}
                          ${this.addTextInput({name: "repeat", label: `${info.rep} ${info.pass}`, password: true, value: "", alert: alert("repeat"), toolType: info.repTool})}
                          ${this.addSubmitButton(info.createServ)}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </body>                  
            </html>`];
    };
  }
