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
import { logging } from "../../log";
import { models } from "../../models";
import { paths } from "../../paths";
import { Idatas, koaContext } from "../../types";
import { listaddCssFiles, addCssFile } from "../css";
import { listaddJsFiles, addJsFile } from "../js";
import { CoreHtmlView } from "./core";
import fs from "fs";
import path from "path";

/**
 * Admin Class for HTML View
 */

export class Admin extends CoreHtmlView {
    constructor(ctx: koaContext, datas: Idatas) {
        console.log(logging.whereIam(new Error().stack, "View").toString());
        super(ctx, datas);
        this.init();
    }

    /**
     * if admin login not correct redirect to admin login or create htmlPage.
     */
    private init() {
        if (this.adminConnection === true) this.adminHtml();
        else this.adminLogin("admin");
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
            options: enumKeys(EOptions),
            logsFiles: paths.logFile.list()
        };

        // if js or css .min
        const fileWithOutMin = (input: string): string => input.replace(".min", "");
        // Split files for better search and replace
        this._HTMLResult = fs
            .readFileSync(path.resolve(__dirname, "../html/", "admin.html"))
            .toString()
            .replace(/<link /g, `${EConstant.return}<link `)
            .replace(/<script /g, `${EConstant.return}<script `)
            .replace(/<\/script>/g, `</script>${EConstant.return}`)
            .replace(/\r\n/g, EConstant.return)
            .split(EConstant.return)
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
                <div class="title" onclick="selectCard('${e}')">${e}</div>
                <button class="copy-btn" id="copy${e}" onclick="copyService('${e}')"> COPY </button>
                <div class="product">
                    <span class="service-name">${services[e].version}&nbsp;:&nbsp;</span>
                    <span id="root" class="service-root" onclick="location.href = '${services[e].root}';">${services[e].root}</span>
                </div>
                <div class="description">
                    <div id="editList${e}"class="editList">
                        <textarea></textarea>
                    </div>
                    <fieldset id="options${e}">
                        <legend>Options</legend>
                        <ul class="card-list">
                            <li class="card-list-item canPoint icon-${services[e].service.options.includes(EOptions.canDrop) ? "yes" : "no"}" onclick="selectChange('${e}', this)">canDrop</li>
                            <li class="card-list-item canPoint icon-${services[e].service.options.includes(EOptions.forceHttps) ? "yes" : "no"}" onclick="selectChange('${e}', this)">forceHttps</li>
                            <li class="card-list-item canPoint icon-${services[e].service.options.includes(EOptions.stripNull) ? "yes" : "no"}" onclick="selectChange('${e}', this)">stripNull</li>
                            <li class="card-list-item canPoint icon-${services[e].service.options.includes(EOptions.speedCount) ? "yes" : "no"}" onclick="selectChange('${e}', this)">speedCount</li>
                            <li class="card-list-item canPoint icon-${services[e].service.options.includes(EOptions.unique) ? "yes" : "no"}" onclick="selectChange('${e}', this)">unique</li>
                        </ul>
                    </fieldset>
    
                    <select id="infos${e}" size="5">
                        ${services[e].service.extensions.map((f) => `<option value="${f}">${f}</option>`).join(EConstant.return)}
                    </select>
    
                </div>
                <div class="description">
                    <span class="page canPoint" onclick="editPage('${e}', this)">${services[e].service.nb_page}</span>
                    <span class="csv canPoint" onclick="editCsv('${e}', this)">${services[e].service.csvDelimiter}</span>
                    <select class="patrom-select tabindex="1" onchange="selectChange('${e}', this)">
                        <option selected="selected">Services</option>
                        <option>Statistiques</option>
                        ${services[e].service.extensions.includes("users") ? "<option>Users</option>" : ""} 
                        ${services[e].service.extensions.includes("lora") ? "<option>Loras</option>" : ""} 
                        ${services[e].service.extensions.includes("lora") ? "<option>Synonyms</option>" : ""} 
                    </select>
                </div>
                </div>`
            );

        this.replacers({ cards: cards.join("") });
        this.replacer("_PARAMS={}", "_PARAMS=" + JSON.stringify(params, this.bigIntReplacer));
    }
}
