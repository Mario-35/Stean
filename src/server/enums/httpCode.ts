/**
 * http ccde Enum
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- http ccde Enum -----------------------------------!\n");

export const enum EHttpCode {
    ok = 200,
    created = 201,
    noContent = 204,
    badRequest = 400, 
    Unauthorized = 401,
    refused= 403,
    notFound = 404,
    internalServerError = 500,
    serverNotRespond= 504,
    redirectionPerm = 301,
    redirectionTemp= 302
}
