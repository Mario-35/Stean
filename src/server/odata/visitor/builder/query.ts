/**
 * Query builder
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { doubleQuotesString, cleanStringComma, isDataArray, isGraph, isGeoJson, removeAllQuotes, removeFirstEndDoubleQuotes, formatPgString } from "../../../helpers";
import { asJson } from "../../../db/queries";
import { Iservice, Ientity, IpgQuery } from "../../../types";
import { PgVisitor, RootPgVisitor } from "..";
import { models } from "../../../models";
import { EConstant, EDataType, EOptions, EUserRights } from "../../../enums";
import { GroupBy, Key, OrderBy, Select, Where, Join } from ".";
import { errors } from "../../../messages";
import { log } from "../../../log";
import { expand } from "../../../models/helpers";
import { isAllowedTo, isFile, isTestEntity } from "../../../helpers/tests";
export class Query {
    from: string;
    where: Where;
    select: Select;
    join: Join;
    orderBy: OrderBy;
    groupBy: GroupBy;
    keyNames: Key;
    _pgQuery: IpgQuery | undefined = undefined;
    isFile: boolean = false;

    constructor() {
        console.log(log.whereIam());
        this.where = new Where();
        this.select = new Select();
        this.orderBy = new OrderBy();
        this.join = new Join();
        this.groupBy = new GroupBy();
        this.keyNames = new Key([]);
    }
    private isCalcColumn(input: string): boolean {
        return EConstant.stringException.map((e) => (input.includes(e) ? true : false)).filter((e) => e === true).length > 0;
    }
    private extractColumnName(input: string): string {
        const elem = input.split(input.includes(" AS ") ? " AS " : ".");
        elem.shift();
        return elem.join(".");
    }
    /**
     *
     * @param service service
     * @param entity entity name
     * @param column column name
     * @param options options
     * @returns formated column or
     */
    private formatedColumn(service: Iservice, entity: Ientity, column: string, options?: Record<string, boolean>): string | undefined {
        console.log(log.whereIam(column));
        // verify column exist
        if (entity.columns[column]) {
            // is column have alias
            const alias = entity.columns[column].alias(service, options);
            if (this.isCalcColumn(alias || column) === true) return alias || column;
            if (options) {
                if (alias && options["alias"] === true) return column === "id" ? `${doubleQuotesString(entity.table)}.${alias}` : alias;
                let result: string = "";
                if (options["table"] === true) result += `${doubleQuotesString(entity.table)}.`;
                result += alias || options["quoted"] === true ? doubleQuotesString(column) : column;
                if (options["as"] === true || (alias && alias.includes("->"))) result += ` AS ${doubleQuotesString(column)}`;
                return result;
            } else return column;
        } else if (this.isCalcColumn(column) === true) return column;
        if (column === "selfLink") return column;
        if (column.startsWith("(SELECT")) return column;
        if (this.isFile === true) return `(result->'valueskeys')->>'${column}' AS "${column}"`;
    }

    private columnList(tableName: string, main: PgVisitor, element: PgVisitor): string[] | undefined {
        // const state = () => { console.log(returnValue); };
        this.isFile = isFile(element.ctx.service);
        if (this.isFile === true && element.query.select.toString() === "*") return element.columnSpecials["result"];
        // get good entity name
        const tempEntity = models.getEntity(main.ctx.service, tableName);
        if (!tempEntity) {
            log.error("no entity For", tableName);
            return;
        }
        // Add ceil and return if graph
        if (isGraph(main)) {
            if (element.query.orderBy.notNull()) element.query.orderBy.add(", ");
            // element.query.orderBy.add('"resultTime" ASC,');
            return [main.interval ? `timestamp_ceil("resultTime", interval '${main.interval}') AS srcdate` : `@GRAPH@`];
        }
        if (isGeoJson(tempEntity, main)) {
            const col = tempEntity.name === "Locations" ? "location" : "feature";
            console.log(main.query.where);
            if (main.query.where.toString().trim() != "") main.query.where.add(" AND ");
            main.query.where.add(`"${col}"::text LIKE '%coordinates%'`);
            console.log(main.query.where);
            return [`${col} AS "geometry"`];
        }
        // If array result add id
        const returnValue: string[] = [];
        // const returnValue: string[] = isDataArray(main) && !element.query.select.toString().includes(`"id"${EConstant.columnSeparator}`) && element.query.select.toString() !== "*" ? ["id"] : [];
        // create selfLink
        const selfLink = `CONCAT('${main.ctx.decodedUrl.root}/${tempEntity.name}(', "${tempEntity.table}"."id", ')') AS ${doubleQuotesString(EConstant.selfLink)}`;
        // if $ref return only selfLink
        if (element.onlyRef == true) return [selfLink];
        if (element.showRelations == true) returnValue.push(selfLink);
        if (element.entity && isTestEntity(element.entity, "Logs") && isAllowedTo(main.ctx, EUserRights.Post) === true) {
            const replay = `CONCAT('${main.ctx.decodedUrl.root}/Replays(', "${tempEntity.table}"."id", ')') AS ${doubleQuotesString(EConstant.rePlay)}`;
            returnValue.push(replay);
        }
        // create list of columns
        let columns: string[] =
            element.query.select.toString() === "*" || element.query.select.toString() === ""
                ? Object.keys(tempEntity.columns)
                      .filter((word) => !word.includes("_"))
                      .filter((e) => !(tempEntity.columns[e].dataType === EDataType.result && element.splitResult))
                : // .filter(e => !tempEntity.columns[e].extensions || tempEntity.columns[e].extensions && containsAll(main.ctx.service.extensions, tempEntity.columns[e].extensions) === true || "")
                  element.query.select
                      .toString()
                      .split(EConstant.columnSeparator)
                      .filter((word: string) => word.trim() != "")
                      .map((e) => removeFirstEndDoubleQuotes(e));
        // loop on columns
        if (isDataArray(main)) columns = columns.sort();
        columns
            .map((column: string) => {
                if (element.columnSpecials.hasOwnProperty(column)) return element.columnSpecials[column].join();
                return this.formatedColumn(main.ctx.service, tempEntity, column, { valueskeys: element.valueskeys, quoted: true, table: true, alias: isDataArray(main) ? false : ["id", "result"].includes(column), as: isGraph(main) ? false : true }) || "";
            })
            .filter((e) => e != "")
            .forEach((e: string) => {
                if (e === "selfLink") e = selfLink;
                const testIsCsvOrArray = isDataArray(element);
                if (testIsCsvOrArray) this.keyNames.add(e);
                returnValue.push(e);
                if (main.interval) main.addToIntervalColumns(this.extractColumnName(e));
                if (e === "id" && (element.showRelations == true || isDataArray(main))) {
                    if (testIsCsvOrArray) this.keyNames.add("id");
                    else returnValue.push(selfLink);
                }
                if (testIsCsvOrArray && ["payload", "deveui", "phenomenonTime"].includes(removeAllQuotes(e))) this.keyNames.add(e);
            });
        // add interval if requested
        if (main.interval) main.addToIntervalColumns(`CONCAT('${main.ctx.decodedUrl.root}/${tempEntity.name}(', COALESCE("${EConstant.id}", '0')::text, ')') AS ${doubleQuotesString(EConstant.selfLink)}`);
        // If observation entity
        if (isTestEntity(tempEntity, "Observations") === true && element.onlyRef === false) {
            if (main.interval && !isGraph(main)) returnValue.push(`timestamp_ceil("resultTime", interval '${main.interval}') AS srcdate`);
            if (element.splitResult && main.parentEntity && main.parentEntity.name === "MultiDatastreams")
                element.splitResult.forEach((elem: string) => {
                    const one = element && element.splitResult && element.splitResult.length === 1;
                    const alias: string = one ? "result" : elem;
                    returnValue.push(`(result->>'valueskeys')::json->'${element.splitResult && formatPgString(one ? element.splitResult[0] : alias)}' AS "${removeAllQuotes(one ? elem : alias)}"`);
                    this.keyNames.add(one ? elem : alias);
                });
        }
        return returnValue;
    }
    // Create SQL Query
    private create(main: RootPgVisitor | PgVisitor, toWhere: boolean, _element?: PgVisitor): IpgQuery | undefined {
        const element = _element ? _element : main;
        console.log(log.whereIam(element.entity || "blank"));
        if (element.entity) {
            // get columns
            const select = toWhere === true ? ["id"] : this.columnList(element.entity.name, main, element);
            // if not null
            if (select) {
                if (element.entity) {
                    // Create relations list
                    const relations: string[] = Object.keys(element.entity.relations);
                    // loop includes
                    if (element.includes)
                        element.includes.forEach((item) => {
                            const name = item.navigationProperty;
                            const index = relations.indexOf(name);
                            // if is relation
                            if (element.entity && index >= 0) {
                                item.entity = models.getEntity(main.ctx.service, name);
                                item.query.where.add(`${item.query.where.notNull() === true ? " AND " : ""}${expand(main.ctx.service, element.entity.name, name)}`);
                                // create sql query for this relatiion (IN JSON result)
                                const query = this.pgQueryToString(this.create(item, false));
                                if (query)
                                    relations[index] = `(${asJson({
                                        query: query,
                                        singular: models.isSingular(main.ctx.service, name),
                                        strip: main.ctx.service.options.includes(EOptions.stripNull),
                                        count: false
                                    })}) AS ${doubleQuotesString(name)}`;
                                else throw new Error(errors.invalidQuery);
                            }
                        });
                    // create all relations Query
                    if (toWhere === false)
                        relations
                            .filter((e) => e.includes("SELECT") || Object.keys(main.ctx.model).includes(models.getEntityName(main.ctx.service, e) || e))
                            .forEach((rel: string) => {
                                if (rel[0] == "(") select.push(rel);
                                else if (element.entity && element.showRelations == true && main.onlyRef == false) {
                                    let stream: string | undefined = undefined;
                                    select.push(`${stream ? stream : ""} CONCAT('${main.ctx.decodedUrl.root}/${element.entity.name}(', ${doubleQuotesString(element.entity.table)}."id", ')/${rel}') ${stream ? "END " : ""}AS "${rel}${EConstant.navLink}"`);
                                }
                            });
                    const res = {
                        select: select.join(`,${EConstant.return}${EConstant.tab}${EConstant.tab}`),
                        from: [doubleQuotesString(element.entity.table)],
                        where: element.query.where.toString(),
                        groupBy: element.query.groupBy.notNull() === true ? element.query.groupBy.toString() : undefined,
                        orderBy: element.query.orderBy.notNull() === true ? element.query.orderBy.toString() : element.entity.orderBy,
                        skip: element.skip,
                        limit: element.limit,
                        keys: this.keyNames.toArray(),
                        count: `SELECT COUNT(DISTINCT ${Object.keys(element.entity.columns)[0]}) AS "${EConstant.count}" FROM (SELECT ${Object.keys(element.entity.columns)[0]} FROM "${element.entity.table}"${element.query.where.notNull() === true ? ` WHERE ${element.query.where.toString()}` : ""}) AS c`
                    };
                    if (main.subQuery.from.length > 0 && main.subQuery.from[1] != "") res.from.push(`( ${this.pgQueryToString(main.subQuery)}) AS src`);
                    return res;
                }
            }
        }
        return undefined;
    }
    private pgQueryToString(input: IpgQuery | undefined): string | undefined {
        return input
            ? `SELECT ${input.select}${EConstant.return} FROM ${input.from}${EConstant.return} ${input.where ? `WHERE ${input.where}${EConstant.return}` : ""}${input.groupBy ? `GROUP BY ${cleanStringComma(input.groupBy)}${EConstant.return}` : ""}${input.orderBy ? `ORDER BY ${cleanStringComma(input.orderBy, ["ASC", "DESC"])}${EConstant.return}` : ""}${input.skip && input.skip > 0 ? `OFFSET ${input.skip}${EConstant.return}` : ""} ${
                  input.limit && input.limit > 0 ? `LIMIT ${input.limit}${EConstant.return}` : ""
              }`
            : undefined;
    }

    toWhere(main: RootPgVisitor | PgVisitor, _element?: PgVisitor): string {
        console.log(log.whereIam());
        this._pgQuery = this.create(main, true, _element);
        if (this._pgQuery) {
            const query = `SELECT ${this._pgQuery.select}${EConstant.return} FROM ${this._pgQuery.from}${EConstant.return} ${this._pgQuery.where ? `WHERE ${this._pgQuery.where}${EConstant.return}` : ""}`;
            if (query) {
                this._pgQuery = undefined;
                return query;
            }
        }
        throw new Error(errors.invalidQuery);
    }

    toString(main: RootPgVisitor | PgVisitor, _element?: PgVisitor): string {
        console.log(log.whereIam());
        if (!this._pgQuery) this._pgQuery = this.create(main, false, _element);
        const query = this.pgQueryToString(this._pgQuery);
        if (query) return query;
        throw new Error(errors.invalidQuery);
    }

    toPgQuery(main: RootPgVisitor | PgVisitor, _element?: PgVisitor): IpgQuery | undefined {
        console.log(log.whereIam());
        if (!this._pgQuery) this._pgQuery = this.create(main, false, _element);
        return this._pgQuery;
    }

    addFrom(input: string) {
        this.from = input;
    }
}
