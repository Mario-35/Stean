/**
 * constant Enum
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export const EConstant = Object.freeze({
    repository: "https://github.com/Mario-35/Stean",
    branch: "main",
    id: "@iot.id",
    name: "@iot.name",
    navLink: "@iot.navigationLink",
    selfLink: "@iot.selfLink",
    nextLink: "@iot.nextLink",
    prevLink: "@iot.prevLink",
    encoding: "encodingType",
    count: "@iot.count",
    rePlay: "@iot.rePlay",
    columnSeparator: "@|@",
    admin: "admin",
    test: "test",
    doubleQuotedComa: '",\n"',
    simpleQuotedComa: "',\n'",
    newline: "\r\n",
    tab: "\t",
    return: "\n",
    host: "127.0.0.1",
   
    pg: "postgres",
    port: 5432,
    voidtable: "voidTable",
    voidSql: "SELECT 1=1",
    appName: process.env.npm_package_name || "_STEAN",
    stringException: ["CONCAT", "CASE", "COALESCE"],
    helmetConfig: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"]
    }
});
