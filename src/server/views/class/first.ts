/**
 * HTML Views First Install for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- HTML Views First Install for API. -----------------------------------!\n");

import { info } from "../../messages";
import { IKeyString, koaContext } from "../../types";
import { CoreHtmlView } from "./core";

interface Idatas { 
  login: boolean; 
  url: string; 
  body?: any; 
  why?: IKeyString
}


export class First extends CoreHtmlView {
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
                <div class="login-wrap">
                  <div class="login-html" color="#FF0000">
                    ${this.title("First Start")}
                    <input id="tab-1" type="radio" name="tab" class="sign-in" checked>
                    <label for="tab-1" class="tab">${info.pg} Admin</label>
                    <input id="tab-2" type="radio" name="tab" class="sign-up">
                    <label for="tab-2" class="tab">Help</label>
                    <div class="login-form">
                      <form action="/install" method="post">
                        <div class="sign-in-htm">
                          ${this.addHidden("_src", "_first")}
                          ${this.addTextInput({name: "host", label: info.host , value: datas.body && datas.body.host || "localhost", alert: alert("host"), toolType: info.least5Tool})}
                          ${this.addTextInput({name: "username", label: info.user, value: datas.body && datas.body.username || "postgres", alert: alert("username"), toolType: info.least5Tool})}
                          ${this.addTextInput({name: "password", label: info.pass, password: true, value: "", alert: alert("password"), toolType: info.passTool})}
                          ${this.addTextInput({name: "repeat", label: info.rep, password: true, value: "", alert: alert("repeat"), toolType: info.repTool})}
                          ${this.addSubmitButton(info.dbPgConn)}
                          ${ datas.why && datas.why["_error"] ? this.AddErrorMessage(datas.why["_error"]) : ""}
                        </div> 
                        <div class="sign-up-htm">
                          <span>
                            You have to create configuration to start the API<br>
                            <br>
                            You have to put user admin postgresSql connection in PostgresSql Admin in tab above (This user must have right to create databases).<br>
                            <br>
                            When the connection test succed you can create your first service.
                          </span>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </body>                  
            </html>`];
    };
  }
