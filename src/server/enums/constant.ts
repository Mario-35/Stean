/**
 * constant Enum
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export const EConstant = Object.freeze({
    rights: "SUPERUSER CREATEDB NOCREATEROLE INHERIT LOGIN NOREPLICATION NOBYPASSRLS CONNECTION LIMIT -1",
    id: "@iot.id",
    name: "@iot.name",
    navLink: "@iot.navigationLink",
    selfLink: "@iot.selfLink",
    encoding: "encodingType",
    count: "@iot.count",
    nextLink: "@iot.nextLink",
    prevLink: "@iot.prevLink",
    columnSeparator: "@|@",
    admin: "admin",
    test: "test",
    doubleQuotedComa: '",\n"',
    simpleQuotedComa: "',\n'",
    newline: "\r\n",
    tab: "\t",
    return: "\n",
    host: "localhost",
    pg: "postgres",
    port: 5432,
    voidtable: "spatial_ref_sys",
    appName: process.env.npm_package_name || "_STEAN",
    stringException: ["CONCAT", "CASE", "COALESCE"],
    helmetConfig: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"]
    }
});
