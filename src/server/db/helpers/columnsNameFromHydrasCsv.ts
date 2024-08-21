/**
 * columnsNameFromHydrasCsv.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- columnsNameFromHydrasCsv -----------------------------------!");

import fs from "fs";
import { IcsvFile, IcsvImport } from "../../types";
import readline from "readline";
import { log } from "../../log";

export const columnsNameFromHydrasCsv = async ( paramsFile: IcsvFile ): Promise<IcsvImport | undefined> => {
  console.log(log.whereIam());
  const returnValue: IcsvImport = { header: false, dateSql: "", columns: [] };
  const fileStream = fs.createReadStream(paramsFile.filename);
  const regexDate = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g;
  const regexHour = /^[0-9]{2}[:][0-9]{2}[:][0-9]{2}$/g;
  const regexDateHour = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4} [0-9]{2}[:][0-9]{2}$/g;
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in filename as a single line break.

  for await (const line of rl) {
    const splitColumns = line.split(";");
    if (regexDateHour.test(splitColumns[0]) == true) {
      const nbCol = (line.match(/;/g) || []).length;
      console.log(log.debug_infos("dateSqlRequest", "Date Hour"));
      returnValue.columns = ["datehour"];
      for (let i = 0; i < nbCol; i++) returnValue.columns.push(`value${i + 1}`);
      fileStream.destroy();
      returnValue.dateSql = `TO_TIMESTAMP(REPLACE("${paramsFile.tempTable}".datehour, '24:00:00', '23:59:59'), 'DD/MM/YYYY HH24:MI:SS')`;
      return returnValue;
    } else if ( regexDate.test(splitColumns[0]) == true && regexHour.test(splitColumns[1]) == true ) {
      console.log(log.debug_infos("dateSqlRequest", "date ; hour"));
      const nbCol = (line.match(/;/g) || []).length;
      returnValue.columns = ["date", "hour"];
      for (let i = 0; i < nbCol - 1; i++) returnValue.columns.push(`value${i + 1}`);
      fileStream.destroy();
      returnValue.dateSql = `TO_TIMESTAMP(concat("${paramsFile.tempTable}".date, REPLACE("${paramsFile.tempTable}".hour, '24:00:00', '23:59:59')), 'DD/MM/YYYYHH24:MI:SS:MS')`;
      return returnValue;
    }
    returnValue.header = true;
  }
  return returnValue;
};
