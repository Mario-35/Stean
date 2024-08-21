/**
 * hidePassword
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- hidePassword -----------------------------------!");

import { isObject } from "./tests";

export function hidePassword(obj: object): object {
    if (Array.isArray(obj))  
      return obj
          .map(v => (v && isObject(v)) ? hidePassword(v) : v);
    else return Object.entries(obj)
          .map(([k, v]) => [k, v && isObject(v) ? hidePassword(v) : v])
          .reduce((a: Record<string, any>, [k, v]) => (k == "password" ? (a[k]="*****", a) : (a[k]=v, a)), {});
}
