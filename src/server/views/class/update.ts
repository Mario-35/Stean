/**
 * HTML Views First Install for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { log } from "../../log";
import { Idatas, koaContext } from "../../types";
import { autoUpdate } from "../../update";
import { CoreHtmlView } from "./core";

/**
 * Update Class for HTML View
 */

export class Update extends CoreHtmlView {
    constructor(ctx: koaContext, datas: Idatas) {
        console.log(log.whereIam("View"));
        super(ctx, datas);
        this.init();
    }

    private init() {
        if (this.adminConnection === true) autoUpdate.update();
        else this.adminLogin("update");
    }
}
