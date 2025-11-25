/**
 * SteanContext for API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../configuration";
import { setDebug } from "../constants";
import { EConstant, EFrom, EHttpCode, EOptions } from "../enums";
import { cleanUrl, removeFromUrl } from "../helpers";
import { logging } from "../log";
import { models } from "../models";
import { RootPgVisitor } from "../odata/visitor";
import {  Id, Iservice, IuserToken, koaContext } from "../types";

/**
 * SteanContext Class
*/



export class SteanContext {
    href: string;
    origin: string;
    linkBase: string;
    root: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    
    path: string;
    id: Id;
    idStr: string | undefined;
    
    service: Iservice;
    odata: RootPgVisitor;
    from: EFrom;
    error: boolean;
    user: IuserToken;

    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        // debug mode
        setDebug(ctx.href.includes("?$debug=true"));
        // decode url
        const url = new URL(
            cleanUrl(
                removeFromUrl(ctx.href, ["debug=true"])
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            )
        )
        const paths = url.pathname.split("/").filter((e) => e != "");
        this.href = url.href;
        this.origin = url.origin;
        this.protocol = url.protocol;
        this.host = url.host;
        this.hostname = url.hostname;
        this.port = url.port;
        this.pathname = url.pathname;
        this.search = url.search;
        let idStr: string | undefined = undefined;
        let id: string | 0 = 0;
        // if nothing ===> root
        this.path = "/";
        // id string or number
        if (paths[2]) {
            id = paths[2].includes("(") ? paths[2].split("(")[1].split(")")[0] : 0;
            idStr = isNaN(+id) ? String(id) : undefined;
            this.path = paths.slice(2).join("/");
        }
        this.path = idStr ? this.path.replace(String(id), "0") : this.path ;
        this.id = isNaN(+id) ? BigInt(0) : BigInt(id);
        this.idStr = idStr;
        try {
            const configName = config.getConfigNameFromName( paths[0].toLowerCase());
            if (configName) {
                this.service = config.getService(configName);                
                this.protocol = ctx.request.headers["x-forwarded-proto"]
                ? ctx.request.headers["x-forwarded-proto"].toString()
                : this.service.options.includes(EOptions.forceHttps)
                ? "https"
                : ctx.protocol;
                
                // make linkbase
                this.linkBase = ctx.request.headers["x-forwarded-host"]
                ? `${this.protocol}://${ctx.request.headers["x-forwarded-host"].toString()}`
                : ctx.request.header.host
                ? `${this.protocol}://${ctx.request.header.host}`
                : "Error";
                
                // make rootName
                if (!this.linkBase.includes(configName)) this.linkBase += "/" + configName;
                
                this.root = process.env.NODE_ENV?.trim() === EConstant.test ? `proxy/${this.service.apiVersion || ""}` : `${this.linkBase}/${this.service.apiVersion || ""}`;
            }
            else ctx.throw(EHttpCode.notFound);            
        } catch (error) {
            logging.debug(error);
            ctx.throw(EHttpCode.notFound);            
        }
        this.from = ctx.request.headers.host === "mqtt" ? EFrom.mqtt : EFrom.unknown
        // get model
    }

    model() {
        return models.getModel(this.service);
    }

    toString() {
        return {
            protocol: this.protocol,
            linkBase: this.linkBase,
            root: this.root,
            service: this.service
        }
    }
    
}