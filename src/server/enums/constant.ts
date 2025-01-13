/**
 * constant Enum
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import fs from "fs";
import path from "path";

const getKey = () => {
    let res = "zLwX893Mtt9Rc0TKvlInDXuZTFj9rxDV";
    try {
        return fs.readFileSync(path.resolve(__dirname, "../configuration/", ".key"), "utf8");
    } catch (error) {
        fs.writeFileSync(path.resolve(__dirname, "../configuration/", ".key"), res, { encoding: "utf-8" });
    }
    return res;
};

export const EConstant = Object.freeze({
    rights: "SUPERUSER CREATEDB NOCREATEROLE INHERIT LOGIN NOREPLICATION NOBYPASSRLS CONNECTION LIMIT -1",
    id: "@iot.id",
    name: "@iot.name",
    navLink: "@iot.navigationLink",
    selfLink: "@iot.selfLink",
    encoding: "encodingType",
    columnSeparator: "@|@",
    admin: "admin",
    test: "test",
    doubleQuotedComa: '",\n"',
    simpleQuotedComa: "',\n'",
    newline: "\r\n",
    uploadPath: "./upload",
    host: "localhost",
    pg: "postgres",
    port: 5432,
    voidtable: "spatial_ref_sys",
    appName: process.env.npm_package_name || "_STEAN",
    nodeEnv: process.env.NODE_ENV ? process.env.NODE_ENV : "production",
    appVersion: process.env.version || process.env.npm_package_version || "0",
    stringException: ["CONCAT", "CASE", "COALESCE"],
    key: getKey(),
    helmetConfig: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"]
    },
    new: "newVersion"
});
