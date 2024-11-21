/**
 * singular 
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */


export const singular = (input: string) : string => {
  if (input.endsWith("ies")) input = input.slice(0, -3) + "y";
  if (input.endsWith("s")) input = input.slice(0, -1);
  return input.split("").map((e, i) => {
    if (!(e === "s" && /^[A-Z]*$/.test(input[i+1]) ) )return e;      
  }).join("").trim();
};