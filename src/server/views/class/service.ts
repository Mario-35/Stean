/**
 * HTML ViewsNew Service for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- HTML Views New Service for API. -----------------------------------!");

import { EExtensions, enumKeys, EOptions, EVersion } from "../../enums";
import { infos } from "../../messages";
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
      this.first(datas);
    }

    private first(datas: Idatas) {
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
            ${this.title("First service")}
                    <input  id="tab-1" type="radio" name="tab" class="sign-in" checked>
                    <label for="tab-1" class="tab">New service</label>
                    <input id="tab-2" type="radio" name="tab" class="sign-up">
                    <label for="tab-2" class="tab">User</label>
                    <div class="login-form">
                      <form action="/install" method="post">
                        <div class="sign-in-htm">
                          ${this.addHidden("_src", "_createService")}

                          ${this.addHidden("_host", datas.why && datas.why["_host"] ? datas.why["_host"] : "")}
                          ${this.addHidden("_username", datas.why && datas.why["_username"] ? datas.why["_username"] : "")}
                          ${this.addHidden("_password", datas.why && datas.why["_password"] ? datas.why["_password"] : "")}
                          ${this.addTextInput({name: "name", label: "Service name", value: datas.body && datas.body.name || "", alert: alert("name"), toolType: `Name ${infos.least5Tool}`})}
                          ${this.addTextInput({name: "port", label: infos.pg + " port", value: datas.body && datas.body.port || "5432", alert: alert("port"), toolType: infos.portTool})}
                          ${this.addTextInput({name: "database", label: `${infos.pg} ${infos.db} name`, value: "", alert: alert("database"), toolType: `name of ${infos.pg} ${infos.db}`})} </td>
                          ${this.addSelect({name: "version", list: enumKeys(EVersion).map(e => e.replace("_", ".")) , message: "Select version", password: true, value: "", alert: alert("repeat"), toolType: infos.repTool})}
                          ${this.addMultiSelect({name: "extensions", list: enumKeys(EExtensions) , message: "Select extensions"})}                            
                          ${this.addMultiSelect({name: "options", list: enumKeys(EOptions) , message: "Select Options"})}
                        </div> 
                        <div class="sign-up-htm">
                          ${this.addTextInput({name: "host", label: "host", value: datas.why && datas.why["_host"] ? datas.why["_host"] : "localhost", alert: alert("host"), toolType: `Host ${infos.least5Tool}`})}
                          ${this.addTextInput({name: "username", label: infos.firstUser, value: datas.body && datas.body.username || infos.newUser, alert: alert("username"), toolType: `Name ${infos.least5Tool}`})}
                          ${this.addTextInput({name: "password", label: `New user ${infos.pass}`, password: true, value: datas.body && datas.body.password || "", alert: alert("password"), toolType: infos.passTool})}
                          ${this.addTextInput({name: "repeat", label: `${infos.rep} ${infos.pass}`, password: true, value: "", alert: alert("repeat"), toolType: infos.repTool})}
                          ${this.addSubmitButton(infos.createServ)}
                        </div>
                      </form>
                  </div>
                </div>
              </div>
            </body>                  
          </html>`];
    };
  }
