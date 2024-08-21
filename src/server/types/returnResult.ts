/**
 * returnResult interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- returnResult interface -----------------------------------!");

export interface IreturnResult { // return format api
    id:         bigint | undefined; // id for single
    nextLink:   string | undefined; // pagination next link
    prevLink:   string | undefined;// pagination prev link
    body:       JSON | string | undefined; // body result
    total:      bigint | undefined; // total items
}
