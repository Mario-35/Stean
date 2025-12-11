/**
 * HTML Views First for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant } from "../../enums";
import { removeAllQuotes } from "../../helpers";
import { logging } from "../../log";
import { Idatas, IqueryOptions, koaContext } from "../../types";
import { addCssFile, listaddCssFiles } from "../css";
import { addJsFile, listaddJsFiles } from "../js";
import { CoreHtmlView } from "./core";
import fs from "fs";
import path from "path";

/**
 * Query Class for HTML View
 */

export class Query extends CoreHtmlView {
    params: IqueryOptions;
    constructor(ctx: koaContext, datas: Idatas) {
        super(ctx, datas);
        if (datas.queryOptions) this.params = datas.queryOptions;
        this.createQueryHtmlString();
    }
    
    createQueryHtmlString() {
        console.log(logging.whereIam(new Error().stack));
        // if js or css .min
        const fileWithOutMin = (input: string): string => input.replace(".min", "");
        // Split files for better search and replace
        this._HTMLResult = fs
            .readFileSync(path.resolve(__dirname, "../html/", "query.html"))
            .toString()
            .replace(/<link /g, `${EConstant.newline}<link `)
            .replace(/<script /g, `${EConstant.newline}<script `)
            .replace(/<\/script>/g, `</script>${EConstant.newline}`)
            .replace(`/\r${EConstant.newline}/g`, EConstant.newline)
            .split(EConstant.newline)
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
        // users possibilities
        if (this.params.user.canPost) {
            this.params.methods.push("POST");
            this.params.methods.push("PATCH");
            if (this.params.user.canDelete) this.params.methods.push("DELETE");
        }
        // Format this.params
        if (this.params.options) {
            let tempOptions = this.params.options;
            if (this.params.options.includes("options=")) {
                const temp = this.params.options.split("options=");
                this.params.options = temp[1];
                tempOptions = temp[0];
            } else this.params.options = "";
            const splitOptions = tempOptions.split("&");
            const valid = ["method", "id", "entity", "subentity", "property", "onlyValue"];
            splitOptions.forEach((element: string) => {
                if (element.includes("=")) {
                    const temp = element.split("=");
                    if (temp[0] && temp[1]) {
                        // @ts-ignore
                        if (valid.includes(temp[0])) this.params[temp[0]] = cleanUrl(temp[1]);
                        else if (temp[0] == "datas") this.params.datas = JSON.parse(unescape(temp[1]));
                    }
                }
            });
        }
        // process all css files
        listaddCssFiles().forEach((item: string) => {
            replaceInReturnResult(`<link rel="stylesheet" href="${fileWithOutMin(item)}">`, `<style>${addCssFile(item)}</style>`);
        });
        // process all js files
        listaddJsFiles().forEach((item: string) => {
            replaceInReturnResult(`<script src="${fileWithOutMin(item)}"></script>`, `<script>${addJsFile(item)}</script>`);
        });
    }

    toString() {
        this.replacers({
            start: this.params.results ? "jsonObj = JSON.parse(`" + this.params.results + "`); jsonViewer.showJSON(jsonObj);" : "",
            action: `${this.params._.root()}/${this.params._.service.apiVersion}/CreateObservations`
        });
        this.replacer("_PARAMS={}", "_PARAMS=" + JSON.stringify(this.params, this.bigIntReplacer));
        return super.toString();
    }
}
