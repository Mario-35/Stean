/**
 * HTML Views First Install for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { EConstant, EExtensions, enumKeys, EOptions } from "../../enums";
import { removeAllQuotes } from "../../helpers";
import { log } from "../../log";
import { models } from "../../models";
import { Idatas, koaContext } from "../../types";
import { listaddCssFiles, addCssFile } from "../css";
import { listaddJsFiles, addJsFile } from "../js";
import { CoreHtmlView } from "./core";
import fs from "fs";
import path from "path";

export class Admin extends CoreHtmlView {
    
    constructor(ctx: koaContext, datas: Idatas) {
        console.log(log.whereIam("View"));
        super(ctx, datas);
        this.init();
    }


    /**
     * if admin login not correct redirect to admin login or create htmlPage.
     */
    private init() {
        if (this.adminConnection === true) 
            this.adminHtml(); 
        else 
            this.adminLogin("admin");
    }
    
    /**
     * create admin htmlPage for all services.
     */
    private adminHtml() {
        // get all infos for all services
        const services = config.getInfosForAll(this.ctx);

        const dest = this.ctx.header.referer?.split("/");
        if (dest) dest[dest.length - 1] = "service";

        // create params object
        const params = {
            addUrl: dest?.join("/"),
            services: services,
            versions: models
                .listVersion()
                .reverse()
                .map((e) => e.replace("_", ".")),
            extensions: enumKeys(EExtensions).filter((e) => !["file", "base"].includes(e)),
            options: enumKeys(EOptions)
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

        // create all cards
        const cards = Object.keys(services)
            .filter((e) => e !== EConstant.test)
            .map(
                (e) => `<div class="card">
                <div class="title">${e}</div>
                <button class="copy-btn" id="copy${e}" onclick="copyService('${e}')"> COPY </button>
                <div class="product">
                    <span class="service-name">${services[e].version}</span>
                    <span id="root" class="service-root" onclick="location.href = '${services[e].root}';">${services[e].root}</span>
                </div>
                <div class="description">
                    <fieldset id="options${e}">
                        <legend>Options</legend>
                        <ul class="card-list">
                            <li class="card-list-item icon-${services[e].service.options.includes(EOptions.canDrop) ? "yes" : "no"}">canDrop</li>
                            <li class="card-list-item icon-${services[e].service.options.includes(EOptions.forceHttps) ? "yes" : "no"}">forceHttps</li>
                            <li class="card-list-item icon-${services[e].service.options.includes(EOptions.stripNull) ? "yes" : "no"}">stripNull</li>
                            <li class="card-list-item icon-${services[e].service.options.includes(EOptions.unique) ? "yes" : "no"}">unique</li>
                        </ul>
                    </fieldset>
    
                    <select id="infos${e}" size="5">
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
                        ${services[e].service.extensions.includes("users") ? '<option>Users</option>' : ''} 
                    </select>
                </div>
                </div>`);

        this.replacers({ cards: cards.join("") });
        this.replacer("_PARAMS={}", "_PARAMS=" + JSON.stringify(params, this.bigIntReplacer));
    }
}
