/**
 * HTML Documentation for API.
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

export class Documentation extends CoreHtmlView {
    constructor(ctx: koaContext, datas: Idatas) {
        console.log(logging.whereIam(new Error().stack, "View").toString());
        super(ctx, datas);
        this.documentationHtml();
    }

    /**
     * create admin htmlPage for all services.
     */
    private documentationHtml() {
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
            .readFileSync(path.resolve(__dirname, "../html/", "documentation.html"))
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

        this.replacer("_PARAMS={}", "_PARAMS=" + JSON.stringify(params, this.bigIntReplacer));
    }
}
