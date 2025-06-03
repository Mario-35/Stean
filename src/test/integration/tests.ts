import fs from "fs";
import path from "path";
import { Iinfos, nbAdd, proxy } from "./constant";
import util from "util";
export const _LOG: string[] = [];
export const _HTML: string[] = [
    `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SensorThings inrae</title>
      <meta name="description" content="REST Test Api">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <link href="./css/main.css" rel="stylesheet" media="screen, print">
    </head>
    <body>
    <div id="mainbox">
    <table> 
    <thead> <tr> 
    <th style="width: 10%">Verb</th> 
    <th style="width: 80%">test</th>
    <th style="width:o 5%">Status</th>
    </tr> </thead> 
    </div>
    `
];
let _INDEX = 0;
export function writeLog(ok: boolean) {
    if (ok === true) _LOG[_INDEX] = _LOG[_INDEX].replace("❌", "✔️");
    fs.writeFile(path.resolve(__dirname, "../../../builds/tests.md"), _LOG.join("\r"), function (err: any) {});
}
export function closeLog() {
    _HTML.push(`</body> </html><tbody></tbody></table>`);
    fs.writeFile(path.resolve(__dirname, "../../server/public/tests.html"), _HTML.join("\r"), function () {});
}
const _SEP = "```";
export const AddToTestFile = (datas: string): void => {
    _LOG.push(datas);
};
export function addStartNewTest(title: string) {
    _LOG.push(`\r\r## <a id="${title.replace(/[ ]+/g, "")}">${title}</a>           [🚧](#start)\r\r`);
}
export function addSimpleTest(messsage: string) {
    _INDEX = _LOG.length - 1;
    _LOG.push(`   ${nbAdd()}. ${messsage} ✔️`);
}
export function addTest(infos: Iinfos): Iinfos {
    _LOG.push(`   ${nbAdd()}. ${infos.short}\r [${infos.type ? infos.type.toUpperCase() : "GET"} ${infos.request}](${proxy(true)}${encodeURI(infos.request)}) ❌`);
    const tempDatas = infos.params ? ` <div class="datasBox space"> <h2 class="title">Datas</h2> <div class="view"> ${util.inspect(infos.params, { breakLength: Infinity, showHidden: true, depth: Infinity })}</div></div> </div>` : "";
    const link = infos.type === "get" ? `<a class="tests" href="${proxy(true)}${encodeURI(infos.request)}" target="_blank">${infos.request}</a>` : `<div class="text"><p>${infos.request}</p></div>`;
    _HTML.push(`<tr> <td><span class="method meth-${infos.type}">${infos.type}</span></td> <td><div class="text"><p>${infos.short}</p></div> ${link} ${tempDatas} </td><td>✔️</td></tr>`);
    _INDEX = _LOG.length - 1;
    if (infos.params) _LOG.push(postDatas(infos.params));
    writeLog(false);
    return infos;
}
export function addPostFile(infos: Iinfos) {
    _LOG.push(`  ${nbAdd()}. ${infos.short}\r [POST ${infos.request}](${proxy(true)}${encodeURI(infos.request)}) ✔️\r\n`);
}
export const postDatas = (input: any): string => `${_SEP}js\r\n${util.inspect(input, { breakLength: Infinity, showHidden: true, depth: Infinity })} \r\n${_SEP}\r\n`;
export const addToTests = (options: { title: string; verb: string; link: string; datas: string | undefined; ok: boolean }): void => {
    let str = `### ${options.title}\r`;
    if (options.datas) {
        const encoded = btoa(options.datas);
        const url = `${options.link}?$query=${encoded}`;
        str += `[${options.verb} ${options.link}](${url}) ${options.ok === true ? "✔️" : "❌"}\r`;
        str += "```json\r";
        str += options.datas;
        str += "```\r";
    } else str += `[${options.verb} ${options.link}](${proxy(true)}${options.link}) ${options.ok === true ? "✔️" : "❌"}\r`;
    AddToTestFile(str);
};
