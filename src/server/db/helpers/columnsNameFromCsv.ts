/**
 * columnsNameFromCsv
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- columnsNameFromCsv -----------------------------------!");

import fs from "fs";
import readline from "readline";
import { log } from "../../log";

export const columnsNameFromCsv = async ( filename: string ): Promise<string[] | undefined> => {
  console.log(log.whereIam());
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in filename as a single line break.

  for await (const line of rl) {
    try {
      const cols = line
        .split(";")
        .map((e: string) => e.replace(/\./g, "").toLowerCase());
      fileStream.destroy();
      return cols;
    } catch (error) {
      console.log(error);
    }
  }
};