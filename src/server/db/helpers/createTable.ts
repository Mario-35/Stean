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
import { Ientity } from "../../types";
import { EChar } from "../../enums";

/**
 *
 * @param serviceName name of the service
 * @param tableEntity entity to create
 * @param doAfter query to execute after create table Ok
 * @returns record log report
 */

export const createTable = async (serviceName: string, tableEntity: Ientity, doAfter: string | undefined): Promise<Record<string, string>> => {
    console.log(log.debug_head(`CreateTable [${tableEntity.table || `pseudo ${tableEntity.name}`}] for ${serviceName}`));
    if (!tableEntity) return {};
    const space = 5;
    const tab = () => " ".repeat(space);
    const tabIeInsert: string[] = [];
    const tableConstraints: string[] = [];
    const returnValue: Record<string, string> = {};
    let insertion = "";
    if (!config.connection(serviceName)) {
        log.error("connection Error");
        return { error: "connection Error" };
    }

    Object.keys(tableEntity.columns).forEach((column) => {
        if (tableEntity.columns[column].create.trim() != "") tabIeInsert.push(`${doubleQuotesString(column)} ${tableEntity.columns[column].create}`);
    });
    insertion = tabIeInsert.join(", ");

    Object.keys(tableEntity.constraints).forEach((constraint) => {
        tableConstraints.push(`ALTER TABLE ONLY ${doubleQuotesString(tableEntity.table)} ADD CONSTRAINT ${doubleQuotesString(constraint)} ${tableEntity.constraints[constraint]}`);
    });

    let sql = `CREATE TABLE ${doubleQuotesString(tableEntity.table)} (${insertion});`;
    console.log(log.query(sql));
    if (tableEntity.table.trim() != "")
        returnValue[String(`Create table ${doubleQuotesString(tableEntity.table)}`)] = await config
            .connection(serviceName)
            .unsafe(sql)
            .then(() => EChar.ok)
            .catch((error: Error) => error.message);
    const indexes = tableEntity.indexes;
    const tabTemp: string[] = [];
    // CREATE INDEXES
    if (indexes)
        Object.keys(indexes).forEach((index) => {
            tabTemp.push(`CREATE INDEX "${index}" ${indexes[index]}`);
        });
    if (tabTemp.length > 0) {
        sql = tableConstraints.join(";");
        console.log(log.query(sql));
        returnValue[`${tab()}Create indexes for ${tableEntity.name}`] = await config
            .connection(serviceName)
            .unsafe(sql)
            .then(() => EChar.ok)
            .catch((error: Error) => error.message);
    }
    // CREATE CONSTRAINTS

    if (tableConstraints.length > 0) {
        sql = tabTemp.join(";");
        console.log(log.query(sql));
        returnValue[`${tab()}Create constraints for ${tableEntity.table}`] = await config
            .connection(serviceName)
            .unsafe(sql)
            .then(() => EChar.ok)
            .catch((error: Error) => error.message);
    }

    // CREATE SOMETHING AFTER
    if (tableEntity.after) {
        log.query(tableEntity.after);
        if (tableEntity.after.toUpperCase().startsWith("INSERT"))
            returnValue[`${tab()}Something to do after for ${tableEntity.table}`] = await config
                .connection(serviceName)
                .unsafe(tableEntity.after)
                .then(() => EChar.ok)
                .catch((error: Error) => {
                    log.error(error);
                    return error.message;
                });
    }
    // CREATE SOMETHING AFTER (migration)
    if (doAfter) {
        log.query(doAfter);
        returnValue[`${tab()} doAfter ${tableEntity.table}`] = await config
            .connection(serviceName)
            .unsafe(doAfter)
            .then(() => EChar.ok)
            .catch((error: Error) => error.message);
    }

    return returnValue;
};
