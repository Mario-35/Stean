/**
 * createTable
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { log } from "../../log";
import { doubleQuotesString } from "../../helpers";
import { Ientity, IKeyString } from "../../types";
import { EChar } from "../../enums";
export const createTable = async ( configName: string, tableEntity: Ientity, doAfter: string | undefined ): Promise<IKeyString> => {
  if (!tableEntity) return {};
  console.log(log.debug_head(`CreateTable [${tableEntity.table}] for ${configName}`));
  const space = 5;
  const tab = () => " ".repeat(space);
  const tabIeInsert: string[] = [];
  const tableConstraints: string[] = [];
  const returnValue: IKeyString = {};
  let insertion = "";
  if (!config.connection(configName)) {
    log.error("connection Error");
    return { error: "connection Error" };
  }
  
  Object.keys(tableEntity.columns).forEach((column) => {
    if (tableEntity.columns[column].create.trim() != "")
      tabIeInsert.push(`${doubleQuotesString(column)} ${tableEntity.columns[column].create}`);
  });
  insertion = tabIeInsert.join(", ");
  if (tableEntity.constraints) {
    Object.keys(tableEntity.constraints).forEach((constraint) => {
      if (tableEntity.constraints)
        tableConstraints.push( `ALTER TABLE ONLY ${doubleQuotesString(tableEntity.table)} ADD CONSTRAINT ${doubleQuotesString(constraint)} ${tableEntity.constraints[constraint]};` );
    });
  }
  if (tableEntity.table.trim() != "")
    returnValue[String(`Create table ${doubleQuotesString(tableEntity.table)}`)] =
    await config.connection(configName).unsafe(`CREATE TABLE ${doubleQuotesString(tableEntity.table)} (${insertion});`)
        .then(() => EChar.ok)
        .catch((error: Error) => error.message);
  const indexes = tableEntity.indexes;
  const tabTemp: string[] = [];
  // CREATE INDEXES
  if (indexes)
    Object.keys(indexes).forEach((index) => {
      tabTemp.push(`CREATE INDEX "${index}" ${indexes[index]}`);
    });
  if (tabTemp.length > 0)
    returnValue[`${tab()}Create indexes for ${tableEntity.name}`] =
    await config.connection(configName).unsafe(tabTemp.join(";"))
        .then(() => EChar.ok)
        .catch((error: Error) => error.message);
  // CREATE CONSTRAINTS
  if (tableEntity.constraints && tableConstraints.length > 0)
    returnValue[`${tab()}Create constraints for ${tableEntity.table}`] =
      await config.connection(configName).unsafe(tableConstraints.join(" "))
        .then(() => EChar.ok)
        .catch((error: Error) => error.message);
  // CREATE SOMETHING AFTER
  if (tableEntity.after) {
    if (tableEntity.after.toUpperCase().startsWith("INSERT"))
      returnValue[`${tab()}Something to do after for ${tableEntity.table}`] =
      await config.connection(configName).unsafe(tableEntity.after)
          .then(() => EChar.ok)
          .catch((error: Error) => {
            log.error(error);
            return error.message;
          });
  }
  // CREATE SOMETHING AFTER (migration)
  if (doAfter) {
    returnValue[`${tab()} doAfter ${tableEntity.table}`] = await config.connection(configName).unsafe(doAfter)
      .then(() => EChar.ok)
      .catch((error: Error) => error.message);
  }
  return returnValue;
};
