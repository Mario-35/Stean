/**
 * getUrlKey
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- getUrlKey -----------------------------------!");

/**
 * 
 * @param input url string 
 * @param key  
 * @returns string value 
 */

export function getUrlKey(input: string, key: string): string | undefined {
    let result: string | undefined = undefined;
    try {
      input
        .split("?")[1]
        .split("$")
        .forEach((e) => {
          if (e.toUpperCase().startsWith(`${key.toUpperCase()}=`))
            result = e.split("=")[1];
        });
    } catch (error) {
      return result;
    }
    return result;
  }