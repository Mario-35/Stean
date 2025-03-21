/**
 * upload.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 *
 */

import Busboy from "busboy";
import path from "path";
import util from "util";
import fs from "fs";
import { koaContext } from "../types";
import { paths } from "../paths";
/**
 *
 * @param ctx Koa context
 * @returns KeyString
 */

export const upload = (ctx: koaContext): Promise<object> => {
    // Init results
    const data: Record<string, any> = {};
    // Create promise
    return new Promise(async (resolve, reject) => {
        const allowedExtName = ["csv", "txt", "json"];
        // Init path
        if (!fs.existsSync(paths.upload())) {
            const mkdir = util.promisify(fs.mkdir);
            await mkdir(paths.upload()).catch((error) => {
                data["state"] = "ERROR";
                reject(error);
            });
        }
        // Create Busboy object
        const busboy = new Busboy({ headers: ctx.req.headers });
        // Stream
        busboy.on("file", (fieldname, file, filename) => {
            const extname = path.extname(filename).substring(1);
            if (!allowedExtName.includes(extname)) {
                data["state"] = "UPLOAD UNALLOWED FILE";
                file.resume();
                reject(data);
            } else {
                file.pipe(fs.createWriteStream(paths.upload() + "/" + filename));
                data["file"] = paths.upload() + "/" + filename;
                file.on("data", (chunk) => {
                    data["state"] = `GET ${chunk.length} bytes`;
                });
                file.on("error", (error: Error) => {
                    console.log(error);
                });
                file.on("end", () => {
                    data["state"] = "UPLOAD FINISHED";
                    data[fieldname] = paths.upload() + "/" + filename;
                });
            }
        });
        busboy.on("field", (fieldname, value) => {
            data[fieldname] = value;
        });
        // catch error
        busboy.on("error", (error: Error) => {
            console.log(error);
            data["state"] = "ERROR";
            reject(error);
        });
        // finish
        busboy.on("finish", () => {
            data["state"] = "DONE";
            resolve(data);
        });
        // run it
        ctx.req.pipe(busboy);
    });
};
