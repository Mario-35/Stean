import fs from "fs";
import { EConstant } from "../enums";
import util from "util";

export const debug = (data: any) => {
    fs.appendFile("messages.txt", typeof data === "object" ? util.inspect(data, { showHidden: false, depth: null, colors: true }) : data + EConstant.return, function (err) {
        if (err) throw err;
    });
};
export const debugoBJ = (query: any) => {
    fs.appendFile("messages.txt", util.inspect(query, { showHidden: false, depth: null, colors: false }) + EConstant.return, function (err) {
        if (err) throw err;
    });
};

export function myParent() {
    return new Error().stack?.split("\n")[2].trim().split("(")[0].split("at ")[1].trim() || "none";
}

