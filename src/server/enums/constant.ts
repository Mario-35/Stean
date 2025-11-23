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
    },
    sessionConfig: {
        key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 86400000,
        autoCommit: true, /** (boolean) automatically commit headers (default true) */
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */
        rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
        renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
        secure: true, /** (boolean) secure cookie*/
        sameSite: null, /** (string) session cookie sameSite options (default null, do not provide this key if you are not restricting sameSite) */
    }
});
