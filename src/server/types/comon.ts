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
    formatDataInput(input: object | undefined): object | undefined; // formating data before use it
    getAll(): Promise<IreturnResult | Iuser | undefined>; // get all items with pagination
    getSingle(id: bigint | string): Promise<IreturnResult | Iuser | undefined>; // get one item
    post(dataInput?: Record<string, any> | undefined): Promise<IreturnResult | undefined>; // post item
    put(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined>; // put item
    update(dataInput?: Record<string, any> | undefined): Promise<IreturnResult | undefined>; // update item
    delete(id: bigint | string): Promise<IreturnResult | undefined>; // delete item
}
