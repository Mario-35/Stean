import fs from "fs";
import path from "path";
import { Iinfos, nbAdd, proxy } from "./constant";
import util from "util";
export const _LOG: string[] = [];
let _INDEX = 0;
export function writeLog(ok: boolean) {
    if (ok === true) _LOG[_INDEX] = _LOG[_INDEX].replace("❌", "✔️");
    fs.writeFile(path.resolve(__dirname, "../../../builds/tests.md"), _LOG.join("\r"), function (err: any) {});
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
