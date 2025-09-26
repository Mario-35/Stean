/**
 * HTML Views Status for API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { _DEBUG } from "../../constants";
import { EChar, EExtensions } from "../../enums";
import { logging } from "../../log";
import { Idatas, Iuser, koaContext } from "../../types";
import { CoreHtmlView } from "./core";

/**
 * Status Class for HTML View
 */

export class Status extends CoreHtmlView {
    constructor(ctx: koaContext, datas: Idatas) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx, datas);
        if (datas.user) this.status(ctx, datas.user);
    }
    public status(ctx: koaContext, user: Iuser) {
        const service = config.getConfigNameFromDatabase(user.database);
        const url = `${this.ctx.decodedUrl.linkbase}/${ctx.service.apiVersion}`;
        const sec = ctx.service.extensions.includes(EExtensions.users);
        this._HTMLResult = [
            `<!DOCTYPE html>
        <html> 
            ${this.head("Status")}
            <body>
                <div class="login-wrap">
                    <div class="login-html">
                        ${this.title("Status")}
                        <h3>Username : ${user.username}</h3> 
                        <h3>Hosting : ${user.database == "all" ? "all" : service ? config.getService(service).pg.host : "Not Found"}</h3>
                        <h3>Database : ${user.database}</h3>
                        <h3>Status : ${user.id && user.id > 0 ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3> 
                        <h3>Post : ${user.canPost === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        <h3>Delete : ${user.canDelete === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        <h3>Create User: ${user.canCreateUser === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        <h3>Create Service : ${user.canCreateDb === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        <h3>Admin : ${user.admin === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        <h3>Super admin : ${user.superAdmin === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        ${this.foot([
                            { href: `${url}/Logout`, class: "button-logout", name: "Logout" },
                            { href: `${url}/Query`, class: "button-query", name: "Query" }
                        ])}
                    </div>
                </div>
            </body>
        </html>`
        ];
    }
}
