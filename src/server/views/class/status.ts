/**
 * HTML Views Status for API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { config } from "../../configuration";
import { EChar, EExtensions } from "../../enums";
import { Iuser, koaContext } from "../../types";
import { CoreHtmlView } from "./core";
export class Status extends CoreHtmlView {
    constructor(ctx: koaContext, datas: Iuser) {
        super(ctx);
        this.status(ctx, datas);
    }
    
    public status(ctx: koaContext, user: Iuser) {        
      const service = config.getConfigNameFromDatabase(user.database);  
      const url = `${this.ctx.decodedUrl.linkbase}/${this.ctx.config.apiVersion}`;  
      const sec = ctx.config.extensions.includes(EExtensions.users);     
      this._HTMLResult = [`<!DOCTYPE html>
        <html> 
            ${this.head( "Status")}
            <body>
                <div class="login-wrap">
                    <div class="login-html">
                        ${this.title("Status")}
                        <h3>Username : ${ user.username }</h3> 
                        <h3>Hosting : ${user.database == "all" ? "all" : service ? config.getService(service).pg.host : "Not Found"}</h3>
                        <h3>Database : ${user.database}</h3>
                        <h3>Status : ${ user.id && user.id > 0 ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3> 
                        <h3>Post : ${ user.canPost === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        <h3>Delete : ${ user.canDelete === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        <h3>Create User: ${ user.canCreateUser === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        <h3>Create Service : ${ user.canCreateDb === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        <h3>Admin : ${ user.admin === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        <h3>Super admin : ${ user.superAdmin === true ? EChar.ok : !sec ? EChar.ok : EChar.notOk}</h3>
                        ${this.foot([
                            { href: `${url}/Logout`, class: "button-logout", name: "Logout" },
                            { href: `${url}/Query`, class: "button-query", name: "Query" }
                        ])}
                    </div>
                </div>
            </body>
        </html>`];
    };
  }
