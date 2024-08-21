import fs from "fs";
import path from "path";
import { Iinfos, nbAdd, proxy } from "./constant";
import util from "util";
export const _LOG: string[] = [];
export const _HTML: string[] = [`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SensorThings inrae</title>
      <meta name="description" content="REST Test Api">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <link href="./bootstrap.min.css" rel="stylesheet" media="screen">
      <link href="./prism.css" rel="stylesheet" />
      <link href="./main.css" rel="stylesheet" media="screen, print">
    </head>
    <body class="container-fluid">
    <table> 
    <thead> <tr> 
    <th style="width: 10%">Verb</th> 
    <th style="width: 80%">test</th>
    <th style="width: 5%">Status</th>
    </tr> </thead> 
    `
];
let _INDEX = 0;
export function writeLog(ok: boolean) {
    if (ok === true) _LOG[_INDEX] = _LOG[_INDEX].replace('❌', '✔️');
    fs.writeFile(path.resolve(__dirname, "../tests.md"), _LOG.join('\r'), function (err: any) { });
}

export function closeLog() {
    _HTML.push(`</body> </html><tbody></tbody></table>`);
    fs.writeFile(path.resolve(__dirname, "../../server/apidoc/assets/tests.html"), _HTML.join('\r'), function () {});
}

const _SEP = '```';
export const AddToTestFile = (datas: string): void => {
    _LOG.push(datas);
};

export function addStartNewTest(title: string) {
    _LOG.push(`\r\r## <a id="${title.replace(/[ ]+/g, "")}">${title}</a>           [🚧](#start)\r\r`);
};

export function addSimpleTest(messsage: string) {
    _INDEX = _LOG.length - 1;
    _LOG.push(`   ${nbAdd()}. ${messsage} ✔️`);
};

export function addTest(infos: Iinfos): Iinfos {    
    const verb = infos.api.split("}")[0].split("{")[1] || "get";
    _LOG.push(`   ${nbAdd()}. ${infos.api}\r [${verb ? verb.toUpperCase() : "GET"} ${infos.apiExample.http}](${proxy(true)}${encodeURI(infos.apiExample.http)}) ❌`);
    const tempDatas = infos.apiParamExample ? `<pre data-type="get" class="language-http" tabindex="0"><code class="language-http">${util.inspect(infos.apiParamExample, { breakLength: Infinity, showHidden: true, depth: Infinity})}</code></pre>` : "";
    _HTML.push(`<tr> <td><span class="method meth-${verb}">${verb}</span></td> <td><div class="text"><p>${infos.api}</p></div> <a class="tests" href="${proxy(true)}${encodeURI(infos.apiExample.http)}" target="_blank">${infos.apiExample.http}</a> ${tempDatas} </td><td>✔️</td></tr>`); 
    _INDEX = _LOG.length - 1;
    if (infos.apiParamExample) _LOG.push(postDatas(infos.apiParamExample));
    writeLog(false);
    return infos;
};

export function addPostFile(infos: Iinfos) {
    _LOG.push(`  ${nbAdd()}. ${infos.api}\r [POST ${infos.apiExample.url}](${proxy(true)}${encodeURI(infos.apiExample.url)}) ✔️\r\n`);
};

export const postDatas = (input: any): string =>  `${_SEP}js\r\n${util.inspect(input, { breakLength: Infinity, showHidden: true, depth: Infinity })} \r\n${_SEP}\r\n`;

export const addToTests = (options: {
    title:  string;
    verb:  string;
    link:  string;
    datas:  string | undefined;
    ok:  boolean;
}): void => {
    let str = `### ${options.title}\r`;
    if (options.datas) {
        const encoded = btoa(options.datas);
        const url = `${options.link}?$query=${encoded}`;
        str += `[${options.verb} ${options.link}](${url}) ${ options.ok === true ? '✔️' : '❌' }\r`
        str += '```json\r';
        str += options.datas;
        str += '```\r';
    } else str += `[${options.verb} ${options.link}](${proxy(true)}${options.link}) ${ options.ok === true ? '✔️' : '❌' }\r`
    AddToTestFile(str);
};
