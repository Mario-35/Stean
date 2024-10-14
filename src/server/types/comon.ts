/**
 * Comon interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IreturnResult } from "./returnResult";
import { Iuser } from "./user";
export interface Icomon {
    formatDataInput(input: object | undefined): object | undefined // formating data before use it
    getAll()                                  : Promise<IreturnResult | Iuser | undefined | void> // get all items with pagination
    getSingle(id?: string | bigint)           : Promise<IreturnResult | Iuser | undefined | void> // get one item
    post()                                    : Promise<IreturnResult | undefined | void> // post item
    update(idInput: bigint | string)          : Promise<IreturnResult | undefined | void> // update item
    delete(idInput: bigint | string)          : Promise<IreturnResult | undefined | void> // delete item
  }