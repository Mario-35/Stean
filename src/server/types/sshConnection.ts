/**
 * sshConnection interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- sshConnection interface -----------------------------------!");

export interface IsshConnection {
    host:       string; // host name
    username:       string; // user name
    password:   string; // password
    port:       number;
}
