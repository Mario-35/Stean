/**
 * returnResult interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Id } from ".";
import { EConstant } from "../enums";

// return format api
export interface IreturnResult {
    location: string | undefined; // api location return
    [EConstant.count]: number | undefined; // count
    [EConstant.nextLink]: string | undefined; // pagination next link
    [EConstant.prevLink]: string | undefined; // pagination prev link
    body: JSON | string | undefined; // body result
    total: Id; // total items
}
