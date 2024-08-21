/**
 * log interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- log interface -----------------------------------!");

export interface Ilog{ // Log save Interface
    method:     string; // verb method
    returnid?:  string; // id return in result
    code:       number; // error code
    url:        string; // url request
    database:   string; // database of the service
    datas:      object; // datas posted
    user_id:    string; // user id logged
    error?:     object; // error returned
  }