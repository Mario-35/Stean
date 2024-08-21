/**
 * pgQuery interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- pgQuery interface -----------------------------------!");

export interface IpgQuery { // postgresSql query simple Interface
    select:     string;
    from:       string; 
    count?:     string;
    where?:     string;
    orderBy?:   string;
    groupBy?:   string;
    skip?:      number;
    limit?:     number;
    keys:       string[];
}
