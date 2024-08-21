  /**
 * validJSONConfig
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- validJSONConfig -----------------------------------!");

import { ADMIN } from "../../constants";
import { keyobj } from "../../types";

// verify is valid config

export function validJSONConfig(input: Record<string, any> ): boolean {    
    if (!input.hasOwnProperty(ADMIN)) return false;
    if (!input[ADMIN].hasOwnProperty("pg")) return false;
    const admin = input[ADMIN]["pg" as keyobj] as JSON;
    if (!admin.hasOwnProperty("host")) return false;
    if (!admin.hasOwnProperty("user")) return false;
    if (!admin.hasOwnProperty("password")) return false;
    if (!admin.hasOwnProperty("database")) return false;
    return true;
  }