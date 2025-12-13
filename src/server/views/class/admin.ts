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
import { SERVICE } from "../../models/entities";
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
        console.log(logging.whereIam(new Error().stack));
        super(ctx, datas);
        this.init();
    }

    /**
     * if admin login not correct redirect to admin login or create htmlPage.
     */
    private init() {
        if (this.adminConnection === true) this.adminHtml();
        else this.adminLogin(EConstant.admin);
    }

    /**
     * create admin htmlPage for all services.
     */
    private adminHtml() {
        // get all infos for all services
        const services = config.getInfosForAll(this.ctx);

        const dest = this.ctx.header.referer?.split("/");
        if (dest) dest[dest.length - 1] = SERVICE.table;

        // create params object
        const params = {
            addUrl: dest?.join("/"),
            services: services,
            versions: models
                .listVersion()
                .reverse()
                .map((e) => e.replace("_", ".")),
            extensions: [... enumKeys(EExtensions).filter((e) => !["base"].includes(e)), "unique", "Lora", "partitioned"],
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
                (e) => `
            <div class="card">
                <div class="title" onclick="selectCard('${e}')">${e}</div>
                <button class="del-btn" id="del${e}" onclick="delService('${e}')"> X </button>
                <div class="product">
                    <span class="service-name">${services[e].service.apiVersion}&nbsp;:&nbsp;</span>
                    <span id="root" class="service-root" onclick="location.href = '${services[e].root}';">${services[e].root}</span>
                </div>
                <div class="description">
                    <div id="editList${e}"class="editList">
                        <textarea></textarea>
                    </div>
                    <fieldset id="options${e}">
                        <legend>Options</legend>
                        <ul class="card-list">
                        ${params.options
                            .map(
                                (key: string) => `<li class="card-list-item canPoint icon-${services[e].service.options.includes(key) ? "yes" : "no"}" onclick="selectChange('${e}', this)">${key}</li>`
                            )
                            .join("")}
                        </ul>
                    </fieldset>
    
                    <select id="infos${e}" size="5">
                        ${services[e].service.extensions.map((f) => `<option value="${f}">${f}</option>`).join(EConstant.return)}
                    </select>
    
                </div>
                <div class="description">
                    <span class="service-name">csv delimiter:</span>
                    <span class="csv canPoint" onclick="editCsv('${e}', this)">${services[e].service.csvDelimiter}</span>
                    <select class="patrom-select tabindex="1" onchange="selectChange('${e}', this)">
                        <option selected="selected">Services</option>                        
                        ${services[e].service.extensions.includes(EExtensions.users) && services[e].service.users ? "<option>users</option>" : ""} 
                        ${services[e].service.extensions.includes(EExtensions.mqtt) ? "<option>mqtt</option>" : ""} 
                        ${services[e].service.extensions.includes(EExtensions.tasking) ? "<option>tasking</option>" : ""}
                    </select>
                </div>


                <div class="description">
                    <span class="service-name">items per page :</span>
                    <span class="page canPoint" onclick="editPage('${e}', this)">${services[e].service.nb_page}</span>
                </div>
                <div class="description">
                    <span class="service-name">point per graph :</span>
                    <span class="page canPoint" onclick="editGraph('${e}', this)">${services[e].service.nb_graph}</span>
                </div>
            </div>`
            );

        this.replacers({ cards: cards.join("") });
        this.replacer("_PARAMS={}", "_PARAMS=" + JSON.stringify(params, this.bigIntReplacer));
    }
}
