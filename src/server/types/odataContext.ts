/**
 * context interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export interface IodataContext {
    //odata context pass to token
    key: string | undefined;
    entity: string | undefined;
    table: string | undefined;
    target: string | undefined;
    identifier: string | undefined;
    relation: string | undefined;
    literal: string | undefined;
    sign: string | undefined;
    sql: string | undefined;
    in: boolean | undefined;
    onEachResult: boolean | undefined;
}
