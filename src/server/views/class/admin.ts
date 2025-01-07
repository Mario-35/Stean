/**
 * HTML Views First Install for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { EConstant, EExtensions, enumKeys, EOptions } from "../../enums";
import { decrypt, removeAllQuotes } from "../../helpers";
import { log } from "../../log";
import { info } from "../../messages";
import { models } from "../../models";
import { Idatas, koaContext } from "../../types";
import { listaddCssFiles, addCssFile } from "../css";
import { listaddJsFiles, addJsFile } from "../js";
import { CoreHtmlView } from "./core";
import fs from "fs";
import path from "path";

export class Admin extends CoreHtmlView {
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
            `<form action="/admin" method="post">`,
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
        const services = config.getInfosForAll(this.ctx);
        const dest = this.ctx.header.referer?.split("/");
        if (dest) dest[dest.length - 1] = "service";

        const params = {
            addUrl: dest?.join("/"),
            services: services,
            versions: models
                .listVersion()
                .reverse()
                .map((e) => e.replace("_", ".")),
            extensions: enumKeys(EExtensions).filter((e) => !["file", "base"].includes(e)),
            options: enumKeys(EOptions),
            users: {}
        };

        // if js or css .min
        const fileWithOutMin = (input: string): string => input.replace(".min", "");
        // Split files for better search and replace
        this._HTMLResult = fs
            .readFileSync(path.resolve(__dirname, "../html/", "admin.html"))
            .toString()
            .replace(/<link /g, "\n<link ")
            .replace(/<script /g, "\n<script ")
            .replace(/<\/script>/g, "</script>\n")
            .replace(/\r\n/g, "\n")
            .split("\n")
            .map((e: string) => e.trim())
            .filter((e) => e.trim() != "");

        // replace in result
        const replaceInReturnResult = (searhText: string, content: string) => {
            let index = this._HTMLResult.indexOf(searhText);
            if (index > 0) this._HTMLResult[index] = content;
            else {
                index = this._HTMLResult.indexOf(removeAllQuotes(searhText));
                if (index > 0) this._HTMLResult[index] = content;
            }
        };

        // process all css files
        listaddCssFiles().forEach((item: string) => {
            replaceInReturnResult(`<link rel="stylesheet" href="${fileWithOutMin(item)}">`, `<style>${addCssFile(item)}</style>`);
        });
        // process all js files
        listaddJsFiles().forEach((item: string) => {
            replaceInReturnResult(`<script src="${fileWithOutMin(item)}"></script>`, `<script>${addJsFile(item)}</script>`);
        });

        const cards = Object.keys(services)
            .filter((e) => e !== EConstant.test)
            .map(
                (e) => `<div class="card">
                <div class="title">${e}</div>
                <button class="copy-btn" id="copy${e}" onclick="copyService('${e}')"> COPY </button>
  <div class="product">
    <span class="service-name">${services[e].version}</span>
    <span class="service-root" onclick="location.href = '${services[e].root}';">${services[e].root}</span>
  </div>
  <div class="description">
    <ul class="card-list">
    <li class="card-list-item icon-${services[e].service.options.includes(EOptions.canDrop) ? "yes" : "no"}">canDrop</li>
    <li class="card-list-item icon-${services[e].service.options.includes(EOptions.forceHttps) ? "yes" : "no"}">forceHttps</li>
    <li class="card-list-item icon-${services[e].service.options.includes(EOptions.stripNull) ? "yes" : "no"}">stripNull</li>
    <li class="card-list-item icon-${services[e].service.options.includes(EOptions.unique) ? "yes" : "no"}">unique</li>
    </ul>
<select id="infos${e}" size="4">
${services[e].service.extensions.map(f => `<option value="${f}">${f}</option>`).join("\n")}
  </select>
  
  </div>
	<ul class="list" id="list${e}">
    ${Object.keys(services[e].stats)
        .map((k) => `<li>${k} : ${services[e].stats[k as keyof object]}</li>`)
        .join("")}
	</ul>
  <div class="description">
    <span class="page" onclick="editPage('${e}', this)">${services[e].service.nb_page}</span>
    <span class="csv" onclick="editCsv('${e}', this)">${services[e].service.csvDelimiter}</span>
    <select class="patrom-select tabindex="1" name="marios" id="marios" onchange="selectChange('${e}', this)">
        <option selected="selected">Services</option>
        <option>Statistiques</option>
        <option>Users</option>
    </select>
  </div>
</div>`
            );

        this.replacers({
            cards: cards.join("")
        });
        this.replacer("_PARAMS={}", "_PARAMS=" + JSON.stringify(params, this.bigIntReplacer));
    }
}
