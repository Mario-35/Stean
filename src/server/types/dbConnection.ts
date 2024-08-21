/**
 * dbConnection interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- dbConnection interface -----------------------------------!");

import { IforwardConnection, IsshConnection } from ".";

export interface IdbConnection { //postgresSqlconnection
    host:       string; // host name
    user:       string; // user name
    password:   string; // password
    database:   string; // database name
    port:       number; // port || 5332
    retry:      number; // nube of connection try || 2
    tunnel: {
        sshConnection: IsshConnection;
        forwardConnection : IforwardConnection;
    } | undefined;
    _ready: boolean | undefined;
}
