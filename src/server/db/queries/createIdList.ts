/**
 * createIdList
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- createIdList -----------------------------------!");

export const createIdList = (input: string): string[] => {
  let result: string[] = [];
      if (input.includes(":")) {
          const f = input.split(":");
          for (let g = +f[0]; g <= +f[1]; g++) {
            result.push(String(g));
            } 
      } else if (input.includes(",")) {
        result = input.split(",");
      } else result.push(String(input));
  return result.filter(e => e.trim() != "");
};