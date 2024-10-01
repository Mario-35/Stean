/**
 * logToHtml
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- logToHtml -----------------------------------!\n");

import { EChar } from "../enums";
import util from "util";

export function logToHtml(input: string): string {
  if (input) {
    if (typeof input !== "string")
    process.stdout.write(util.inspect(input, { showHidden: false, depth: null, colors: false, })  + "\n");
    input = String(input);
    const col = (input: string) => `</span><span style="color:#${input}"> `
    const formate = (input: string) => {
      const tmp =  input.split("</span>")
      tmp.slice(1);
      return tmp.filter(e => e.trim() != "").join("</span>");
    }
    
    const modif: { [key: string]: string; } = {
      "[92m[93m" : "</pre></span>",
      "[92m" : '<span style="color:#93C572"><pre>',
      "[30m" : col("A3AEEC"),
      "[31m" : col("FF0000"), // Red
      "[32m" : col("00FF00"), // Green
      "[33m" : col("FFFF00"), // Yellow
      "[34m" : col("0000FF"), // Blue
      "[35m" : col("FF00FF"), // Magenta
      "[36m" : col("00FFFF"), // Cyan
      "[37m" : col("FFFFFF"), // White
      "[39m" : col("FFFFFF"), // White
      "[90m" : col("DBA57D"),  // Orange
      "[91m" : col("FFFFFF"),  // Logo
      "[93m" : col("DB61D9"),  // Magenta
      "[95m" : col("DB61D9"),  // Rose
      "[0m" : "",
      "[1m" : '<span style="font-weight:bold;">',
      "[22m" : "</span>",
      "<--" : EChar.arrowleft,
      "-->" : EChar.arrowright,
    } 
    
    Object.keys(modif).forEach((key) => {    
      input = input.split(key).join(modif[key])
    }); 
    return input.split(/\r?\n/).map((e: string) => e.trim().startsWith("</span>") ? `${formate(e)}</span><br />\r`: `${e}\r`) .join("");
  } 
  return "";
}