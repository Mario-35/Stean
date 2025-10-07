/**
 * createTable
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { logging } from "../../log";
import { doubleQuotes } from "../../helpers";
import { Ientity } from "../../types";
import { EChar } from "../../enums";
import { _DEBUG } from "../../constants";

/**
 *
 * @param serviceName name of the service
 * @param tableEntity entity to create
 * @param doAfter query to execute after create table Ok
 * @returns record log report
 */

export const createTable = async (serviceName: string, tableEntity: Ientity, doAfter: string | undefined): Promise<Record<string, string>> => {
    async function executeMessageQuery(message: string, _sql: string) {
        logging.debug().query(message, _sql).to().log().file();
        returnValue[message] = await config
            .connection(serviceName)
            .unsafe(_sql)
            .then(() => {
                logging.debug().status(true, message).to().log().file();
                return EChar.ok;
            })
            .catch((error: Error) => {
                logging.error(message, error).to().log().file();
                return error.message;
            });
    }

    logging
        .debug()
        .head(`CreateTable [${tableEntity.table || `pseudo ${tableEntity.name}`}] for ${serviceName}`)
        .to()
        .log();
    if (!tableEntity || tableEntity.table.trim() === "") return {};
    const space = 5;
    const tab = () => " ".repeat(space);
    const tabIeInsert: string[] = [];
    const tableConstraints: string[] = [];
    const returnValue: Record<string, string> = {};
    let insertion = "";
    if (!config.connection(serviceName)) {
        logging.error("connection Error", "connection Error");
        return { error: "connection Error" };
    }

    Object.keys(tableEntity.columns).forEach((column) => {
        if (tableEntity.columns[column].create.trim() != "") tabIeInsert.push(`${doubleQuotes(column)} ${tableEntity.columns[column].create}`);
    });
    insertion = tabIeInsert.join(", ");

    Object.keys(tableEntity.constraints).forEach((constraint) => {
        tableConstraints.push(`ALTER TABLE ${doubleQuotes(tableEntity.table)} ADD CONSTRAINT ${doubleQuotes(constraint)} ${tableEntity.constraints[constraint]}`);
    });
    let sql = `CREATE TABLE ${doubleQuotes(tableEntity.table)} (${insertion})${tableEntity.partition ? `PARTITION BY LIST(${tableEntity.partition.column})` : ""};`;
    if (tableEntity.table.trim() != "") await executeMessageQuery(String(`Create table ${doubleQuotes(tableEntity.table)}`), sql);
    const indexes = tableEntity.indexes;
    const tabTemp: string[] = [];

    // CREATE INDEXES
    if (indexes)
        Object.keys(indexes).forEach((index) => {
            tabTemp.push(`CREATE INDEX "${index}" ${indexes[index]}`);
        });

    if (tabTemp.length > 0) await executeMessageQuery(`${tab()}Create indexes for ${tableEntity.name}`, tabTemp.join(";"));

    // CREATE CONSTRAINTS
    if (tableConstraints.length > 0) await executeMessageQuery(`${tab()}Create constraints for ${tableEntity.table}`, tableConstraints.join(";"));

    // CREATE SOMETHING AFTER
    if (tableEntity.after) await executeMessageQuery(`${tab()}Something to do after for ${tableEntity.table}`, tableEntity.after);

    // CREATE SOMETHING AFTER (migration)
    if (doAfter) await executeMessageQuery(`${tab()} doAfter ${tableEntity.table}`, doAfter);

    return returnValue;
};
