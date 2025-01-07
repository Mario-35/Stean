/**
 * HTML Views First Install for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant } from "../../enums";
import { decrypt } from "../../helpers";
import { log } from "../../log";
import { info } from "../../messages";
import { Idatas, koaContext } from "../../types";
import { autoUpdate } from "../../update";
import { CoreHtmlView } from "./core";

export class Update extends CoreHtmlView {
    login: boolean = false;
    constructor(ctx: koaContext, datas: Idatas) {
        console.log(log.whereIam("View"));
        super(ctx, datas);
        this.init();
    }

    private init() {
        if (this.datas.connection) {
            try {
                this.login = JSON.parse(decrypt(this.datas.connection)).login;
            } catch (error) {
                this.login = false;
            }
        }
        if (this.login === true) this.adminHtml();
        else this.loginHtml();
    }

    private loginHtml() {
        const alert = (name: string): string => (this.datas.why && this.datas.why[name] ? `<div class="alert">${this.datas.why[name]}</div>` : "");
        this._HTMLResult = [
            `<!DOCTYPE html>`,
            `<html>`,
            this.head("Login"),
            `<body>`,
            `<div class="login-wrap">`,
            `<div class="login-html" color="#FF0000">`,
            this.title("Admin Access"),
            `<input id="tab-1" type="radio" name="tab" class="sign-in" checked>`,
            `<label for="tab-1" class="tab">${info.pg} Admin</label>`,
            `<input id="tab-2" type="radio" name="tab" class="sign-up">`,
            `<label for="tab-2" class="tab">Help</label>`,
            `<div class="login-form">`,
            `<form action="/update" method="post">`,
            `<div class="sign-in-htm">`,
            this.datas.connection ? this.addHidden("_connection", this.datas.connection) : "",
            this.addTextInput({ name: "host", label: info.host, value: (this.datas.body && this.datas.body.host) || EConstant.host, alert: alert("host") }),
            this.addTextInput({
                name: "port",
                label: info.pg + " port",
                value: (this.datas.body && this.datas.body.port) || EConstant.port,
                alert: alert("port")
            }),
            this.addTextInput({
                name: "adminname",
                label: info.user,
                value: (this.datas.body && this.datas.body.adminname) || EConstant.pg,
                alert: alert("username")
            }),
            this.addTextInput({ name: "adminpassword", label: info.pass, password: true, value: "", alert: alert("password") }),
            this.addSubmitButton(info.conn),
            this.datas.connection && this.datas.connection.startsWith("[error]") ? this.AddErrorMessage(this.datas.connection.split("[error]")[1]) : "",
            `</div> `,
            `<div class="sign-up-htm">`,
            `<span>`,
            `You have to create configuration to start the API<br>`,
            `<br>`,
            `You have to put user admin postgresSql connection in PostgresSql Admin in tab above (This user must have right to create databases).<br>`,
            `<br>`,
            `When the connection test succed you can access admin tab.`,
            `</span>`,
            `</div>`,
            `</form>`,
            `</div>`,
            `</div>`,
            `</div>`,
            `</body>`,
            `</html>`
        ];
    }

    private adminHtml() {
        autoUpdate.update();
    }
}
