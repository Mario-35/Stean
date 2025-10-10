/**
 * returnResult interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

// return format api
export interface IreturnResult {
    location: string | undefined; // api location return
    "@iot.count": number | undefined; // count
    "@iot.nextLink": string | undefined; // pagination next link
    "@iot.prevLink": string | undefined; // pagination prev link
    body: JSON | string | undefined; // body result
    total: number | bigint | undefined; // total items
}
