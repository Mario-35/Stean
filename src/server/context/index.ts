/**
 * SteanContext for API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../configuration";
import { setDebug } from "../constants";
import { EConstant, EFrom, EOptions } from "../enums";
import { cleanUrl, removeFromUrl } from "../helpers";
import { logging } from "../log";
import { models } from "../models";
import { RootPgVisitor } from "../odata/visitor";
import { paths } from "../paths";
import { Iservice, IuserToken, koaContext } from "../types";

/**
 * SteanContext Class
*/
export class SteanContext {
    href: string;
    origin: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    redirect: string | undefined = undefined;
    
    path: string;
    private _id: string | bigint;
    private _idStr: string | undefined  = undefined;
    
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
        this.href = ctx.href;
        this.origin = url.origin;
        this.protocol = url.protocol;
        this.host = url.host;
        this.hostname = url.hostname;
        this.port = url.port;
        this.pathname = url.pathname;
        this.search = url.search;
        let id: string | 0 = 0;

        // if nothing ===> root
        this.path = "/";
        
        const splitPath = url.pathname.split("/").filter((e) => e != "");
        if (splitPath[2]) {
            id = splitPath[2].includes("(") ? splitPath[2].split("(")[1].split(")")[0] : 0;
            this._idStr = isNaN(+id) ? String(id) : undefined;
            this.path = splitPath.slice(2).join("/");
        }
        this.path = this._idStr ? this.path.replace(String(id), "0") : this.path;

        // id string or number
        this._id = isNaN(+id) ? BigInt(0) : BigInt(id);
        if (splitPath[0].startsWith("logs-")) this.redirect = paths.root + "logs\\" + `${ctx.path}`;
        else {
            try {
                const configName = config.getConfigNameFromName( splitPath[0].toLowerCase());                
                if (configName) {
                    this.service = config.getService(configName);                
                    this.protocol = ctx.request.headers["x-forwarded-proto"]
                    ? ctx.request.headers["x-forwarded-proto"].toString()
                    : this.service.options.includes(EOptions.forceHttps)
                    ? "https"
                    : ctx.protocol;
                }
            } catch (error) {
                logging.error(error);           
            }
        }
        this.from = ctx.request.headers.host === "mqtt" ? EFrom.mqtt : EFrom.unknown
    }
    
    root() {
        return  process.env.NODE_ENV?.trim() === EConstant.test ? `proxy/${this.service.apiVersion || ""}` : this.service && this.service.name ? `${this.origin}/${this.service.name}/${this.service.apiVersion || ""}` : this.origin;
    }
    
    model() {
        return models.getModel(this.service);
    }

    base() {
        return this.service && this.service.name ? `${this.origin}/${this.service.name}` : this.origin;
    }
    
    id(): string | bigint {
        return this._idStr ? String(this._idStr) : this._id ? BigInt(this._id) : BigInt(0);
    }

    isIString() {
        return typeof this.id() === 'string'
    }

    toString() {
        return {
            protocol: this.protocol,
            base: this.base(),
            root: this.root(),
            service: this.service
        }
    }    
}