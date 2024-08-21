/**
 * user interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- user interface -----------------------------------!");

export interface Iuser {
    id?:            number; // id in database
    username:       string; //user name
    password:       string; // user password
    email:          string; // email name
    database:       string; // dabase access or all to have all access
    canPost:        boolean; // boolean
    canDelete:      boolean; // boolean
    canCreateUser:  boolean; // boolean
    canCreateDb:    boolean; // boolean
    admin:          boolean; // boolean
    superAdmin:     boolean; // boolean
    token?:         string; // use to store token
}