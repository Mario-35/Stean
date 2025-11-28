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
import { EChar, EErrors } from "../../enums";
import { _DEBUG } from "../../constants";
import { messages } from "../../messages";

/**
 *
 * @param serviceName name of the service
 * @param tableEntity entity to create
 * @param doAfter query to execute after create table Ok
 * @returns record log report
 */

export const createTable = async (serviceName: string, tableEntity: Ientity, doAfter: string | undefined): Promise<Record<string, string>> => {
    async function executeMessageQuery(message: string, _sql: string) {
        logging.query(message, _sql).toLogAndFile();
        returnValue[message] = await config
            .connection(serviceName)
            .unsafe(_sql)
            .then(() => {
                logging.status(true, message).toLogAndFile();
                return EChar.ok;
            })
            .catch((error: Error) => {
                logging.error(error, messages.str(EErrors.connError, serviceName));
                process.exit(111);
            });
    }

    logging
        .head(`CreateTable [${tableEntity.table || `pseudo ${tableEntity.name}`}] for ${serviceName}`)
        .to()
        .log();

    if (!tableEntity || tableEntity.table.trim() === "") return {};

    const tab = () => " ".repeat(5);
    const tabIeInsert: string[] = [];
    const tableConstraints: string[] = [];
    const returnValue: Record<string, string> = {};

    if (!config.connection(serviceName)) {
        logging.error("connection Error", messages.str(EErrors.connError, serviceName));
        return { error: "connection Error" };
    }

    Object.keys(tableEntity.columns).forEach((column) => {
        if (tableEntity.columns[column].create.trim() != "") tabIeInsert.push(`${doubleQuotes(column)} ${tableEntity.columns[column].create}`);
    });

    Object.keys(tableEntity.constraints).forEach((constraint) => {
        tableConstraints.push(`ALTER TABLE ${doubleQuotes(tableEntity.table)} ADD CONSTRAINT ${doubleQuotes(constraint)} ${tableEntity.constraints[constraint]}`);
    });

    // CREATE TABLE
    if (tableEntity.table.trim() != "")
        await executeMessageQuery(
            String(`Create table ${doubleQuotes(tableEntity.table)}`),
            `CREATE TABLE ${doubleQuotes(tableEntity.table)} (${tabIeInsert.join(", ")})${tableEntity.partition ? ` PARTITION BY LIST(${tableEntity.partition.main})` : ""};`
        );

    const tabTemp: string[] = [];

    // CREATE INDEXES
    if (tableEntity.indexes)
        Object.keys(tableEntity.indexes).forEach((index) => {
            tabTemp.push(`CREATE INDEX "${index}" ${tableEntity.indexes[index]}`);
        });

    if (tabTemp.length > 0) await executeMessageQuery(`${tab()}Indexes for ${tableEntity.name}`, tabTemp.join(";"));

    // CREATE CONSTRAINTS
    if (tableConstraints.length > 0) await executeMessageQuery(`${tab()}Constraints for ${tableEntity.table}`, tableConstraints.join(";"));

    // CREATE TRIGGERS
    if (tableEntity.trigger) await executeMessageQuery(`${tab()}Trigger ${tableEntity.table}`, tableEntity.trigger.join(";"));

    // CREATE SOMETHING AFTER
    if (tableEntity.after) await executeMessageQuery(`${tab()}Something to do after for ${tableEntity.table}`, tableEntity.after.join(";"));

    // CREATE SOMETHING AFTER (migration)
    if (doAfter) await executeMessageQuery(`${tab()} doAfter ${tableEntity.table}`, doAfter);

    return returnValue;
};
