/**
 * HTML ViewsNew Service for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EExtensions, enumKeys, EOptions } from "../../enums";
import { log } from "../../log";
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
      console.log(log.whereIam("View"));
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
                      update();
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
                          ${this.addHidden("host", datas)}
                          ${this.addHidden("port", datas)}
                          ${this.addHidden("adminname", datas)}
                          ${this.addHidden("adminpassword", datas)}
                          ${this.addTextInput({name: "name", label: "Service name", value: datas.body && datas.body.name || "", alert: alert("name"), toolType: `Name ${info.least5Tool}`, onlyAlpha: true})}
                          ${this.addTextInput({name: "database", label: `${info.pg} ${info.db} name`, value: datas.body && datas.body.database || "", alert: alert("database"), toolType: `name of ${info.pg} ${info.db}`, onlyAlpha: true})} </td>
                          ${this.addSelect({name: "version", list: models.listVersion().map(e => e.replace("_", ".")) , message: "Select version", value: datas.body && datas.body.version || "", alert: alert("repeat"), toolType: info.repTool})}
                          ${this.addMultiSelect({name: "extensions", list: enumKeys(EExtensions).filter(e => !["file","base"].includes(e) ) , message: "Select Extensions", values: datas.body && datas.body.extensions || [""]})}                            
                          ${this.addMultiSelect({name: "options",    list: enumKeys(EOptions) , message: "Select Options", values: datas.body && datas.body.options || [""] })}
                        </div> 
                        <div class="sign-up-htm">
                          ${this.addTextInput({name: "username", label: info.firstUser, value: "", alert: alert("username"), toolType: `Name ${info.least5Tool}`, disabled: true})}
                          ${this.addTextInput({name: "password", label: `New user ${info.pass}`, password: true, value: datas.body && datas.body.password || "", alert: alert("password"), toolType: info.passTool})}
                          ${this.addTextInput({name: "repeat", label: `${info.rep} ${info.pass}`, password: true, value: "", alert: alert("repeat"), toolType: info.repTool})}
                          ${this.addSubmitButton(info.createServ)}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </body>  
              <script>
                function clsAlphaNoOnly (e) {
                  var regex = new RegExp("^[a-zA-Z0-9]+$");
                  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
                  if (regex.test(str)) {
                      return true;
                  }
                  e.preventDefault();
                  return false;
                }
                function update() { 
                  username.value = database.value;
                  if (version.value === 'v0.9') {
                    
                  }
                }
                username.addEventListener("change", () => {
                  update();
                });
                version.addEventListener("change", () => {
                  update();
                });
                ${this.addMultiJs()}
                MultiselectDropdown("extensions", "${datas.body.extensions}");
                MultiselectDropdown("options", "${datas.body.options}");
              </script>                 
            </html>`];
    };
  }
