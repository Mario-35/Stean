/**
 * hideKeysInJson
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- hideKeysInJson -----------------------------------!\n");

import { isObject } from "./tests";

/**
 *
 * @param object string 
 * @param key or array of keys to hide
 * @returns object without keys
 */

export const hideKeysInJson = (obj: Record<string, any>, keys: string | string[] = ""): Record<string, any> => {
  if (typeof keys === "string") keys = [keys];
  for (const [k, v] of Object.entries(obj)) {
    keys.forEach((key) => {
      if (k.includes(key)) delete obj[k];
      else if (k.includes("password")) obj[k] = "*****";
      else if (isObject(v)) hideKeysInJson(v, keys);
    });
  }
  return obj;
};
