/**
 * Query builder
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { doubleQuotes, cleanStringComma, isReturnDataArray, isReturnGraph, isReturnGeoJson, removeAllQuotes, formatPgString } from "../../../helpers";
import { IpgQuery } from "../../../types";
import { PgVisitor, RootPgVisitor } from "..";
import { models } from "../../../models";
import { EConstant, EDataType, EErrors, EOptions, EQuery, EUserRights } from "../../../enums";
import { GroupBy, Key, OrderBy, Select, Where, Join } from ".";
import { logging } from "../../../log";
import { expand } from "../../../models/helpers";
import { isAllowedTo, isTestEntity } from "../../../helpers/tests";
import { createDefaultContext, createIentityColumnAliasOptions } from "../helper";
import { _DEBUG } from "../../../constants";
import { queries } from "../../../db/queries";
export class Query {
    from: string;
    where: Where;
    select: Select;
    join: Join;
    orderBy: OrderBy;
    groupBy: GroupBy;
    keyNames: Key;
    _pgQuery: IpgQuery | undefined = undefined;

    constructor() {
        console.log(logging.whereIam(new Error().stack));
        this.where = new Where();
        this.select = new Select();
        this.orderBy = new OrderBy();
        this.join = new Join();
        this.groupBy = new GroupBy();
        this.keyNames = new Key([]);
    }

    private columnList(tableName: string, main: PgVisitor, element: PgVisitor): string[] | undefined {
        // get good entity name
        const tempEntity = models.getEntity(main.ctx.model, tableName);
        if (!tempEntity) {
            logging.error("no entity For", tableName);
            return;
        }
        // Add ceil and return if graph
        if (isReturnGraph(main)) {
            if (element.query.orderBy.notNull()) element.query.orderBy.add(", ");
            return [main.interval ? `timestamp_ceil("resultTime", interval '${main.interval}') AS srcdate` : `@GRAPH@`];
        }
        if (isReturnGeoJson(tempEntity, main)) {
            const col = tempEntity.name === "Locations" ? "location" : "feature";
            if (main.query.where.toString().trim() != "") main.query.where.add(" AND ");
            main.query.where.add(`"${col}"::text LIKE '%coordinates%'`);
            return [`${col} AS "geometry"`];
        }
        const returnValue: string[] = [];
        // create selfLink
        const selfLink = `CONCAT('${main.ctx.decodedUrl.root}/${tempEntity.name}(', "${tempEntity.table}"."id", ')') AS ${doubleQuotes(EConstant.selfLink)}`;
        // if $ref return only selfLink
        if (element.onlyRef == true) return [selfLink];
        if (element.showRelations == true) returnValue.push(selfLink);
        if (element.entity && isTestEntity(element.entity, "Logs") && isAllowedTo(main.ctx, EUserRights.Post) === true) {
            const replay = `CONCAT('${main.ctx.decodedUrl.root}/Replays(', "${tempEntity.table}"."id", ')') AS ${doubleQuotes(EConstant.rePlay)}`;
            returnValue.push(replay);
        }
        // create list of columns
        let columns: string[] =
            element.query.select.toString() === "*" || element.query.select.toString() === ""
                ? Object.keys(tempEntity.columns)
                      .filter((word) => !word.includes("_"))
                      .filter((e) => !(tempEntity.columns[e].dataType === EDataType.any && element.splitResult))
                : element.query.select
                      .toString()
                      .split(EConstant.columnSeparator)
                      .filter((word: string) => word.trim() != "");
        // loop on columns
        if (isReturnDataArray(main)) columns = columns.sort();
        columns
            .map((column: string) => {
                if (main.interval) main.addToIntervalColumns(column, tempEntity.columns[column]);
                return tempEntity.columns[column]
                    ? tempEntity.columns[column].alias(createIentityColumnAliasOptions(tempEntity, column, createDefaultContext(EQuery.Select), undefined, undefined, main)) || column
                    : column;
            })
            .filter((e) => e != "")
            .forEach((e: string) => {
                if (e === "selfLink") e = selfLink;
                const testIsCsvOrArray = isReturnDataArray(element);
                if (testIsCsvOrArray) this.keyNames.add(e);
                returnValue.push(e);
                if (e === "id" && (element.showRelations == true || isReturnDataArray(main))) {
                    if (testIsCsvOrArray) this.keyNames.add("id");
                    else returnValue.push(selfLink);
                }
            });
        // add interval if requested
        if (main.interval && main.intervalColumns)
            main.intervalColumns.push(`CONCAT('${main.ctx.decodedUrl.root}/${tempEntity.name}(', COALESCE("${EConstant.id}", '0')::text, ')') AS ${doubleQuotes(EConstant.selfLink)}`);
        // If observation entity
        if (isTestEntity(tempEntity, "Observations") === true && element.onlyRef === false) {
            if (main.interval && !isReturnGraph(main)) returnValue.push(`timestamp_ceil("resultTime", interval '${main.interval}') AS srcdate`);
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
        console.log(logging.whereIam(new Error().stack));
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
                                item.entity = models.getEntity(main.ctx.model, name);
                                item.query.where.add(`${item.query.where.notNull() === true ? " AND " : ""}${expand(main.ctx.model, element.entity.name, name)}`);
                                // create sql query for this relatiion (IN JSON result)
                                const query = this.pgQueryToString(this.create(item, false));
                                if (query)
                                    relations[index] = `(${queries.asJson({
                                        query: query,
                                        singular: models.isSingular(main.ctx.model, name),
                                        strip: main.ctx.service.options.includes(EOptions.stripNull),
                                        count: false
                                    })}) AS ${doubleQuotes(name)}`;
                                else throw new Error(EErrors.invalidQuery);
                            }
                        });
                    // create all relations Query
                    if (toWhere === false)
                        relations
                            .filter((e) => e.includes("SELECT") || Object.keys(main.ctx.model).includes(models.getEntityName(main.ctx.model, e) || e))
                            .forEach((rel: string) => {
                                if (rel[0] == "(") select.push(rel);
                                else if (element.entity && element.showRelations == true && main.onlyRef == false) {
                                    select.push(
                                        ` CONCAT('${main.ctx.decodedUrl.root}/${element.entity.name}(', ${doubleQuotes(element.entity.table)}."id", ')/${rel}') AS "${rel}${EConstant.navLink}"`
                                    );
                                }
                            });
                    const pagination =
                        element.ctx.service.options.includes(EOptions.optimized) &&
                        element.query.where.toString().includes(`"observation"."${element.parentEntity?.table}_id" =`) &&
                        (isReturnGraph(element) || element.skip > 0)
                            ? `"observation"."${element.parentEntity?.table}_id" =${element.query.where.toString().split("=")[1].split(" ")[0]}`
                            : undefined;
                    if (pagination)
                        element.query.where.replace(
                            pagination,
                            `_nb > ${element.skip}${
                                isReturnGraph(element)
                                    ? ` AND _nb % (SELECT COALESCE(NULLIF(COUNT(id) / ${element.ctx.service.nb_graph}, 0), 1) FROM "datastream_id${pagination.split("=")[1].split(" ")[0]}") = 0`
                                    : ""
                            }`
                        );

                    const res = {
                        select: select.join(`,${EConstant.return}${EConstant.tab}${EConstant.tab}`),
                        from: pagination ? [`"${element.parentEntity?.table}_id${pagination.split("=")[1].split(" ")[0]}" AS "${element.entity.table}"`] : [doubleQuotes(element.entity.table)],
                        where: element.query.where.toString(),
                        groupBy: element.query.groupBy.notNull() === true ? element.query.groupBy.toString() : undefined,
                        orderBy: element.query.orderBy.notNull() === true ? element.query.orderBy.toString() : pagination ? "_nb" : element.entity.orderBy,
                        join: element.joinOffset,
                        skip: pagination ? 0 : element.skip,
                        limit: element.limit,
                        keys: this.keyNames.toArray(),
                        count: element.countOffset
                            ? element.countOffset
                            : `SELECT COUNT(DISTINCT ${Object.keys(element.entity.columns)[0]}) AS "${EConstant.count}" FROM (SELECT ${Object.keys(element.entity.columns)[0]} FROM "${
                                  element.entity.table
                              }"${element.query.where.notNull() === true ? ` WHERE ${element.query.where.toString()}` : ""}) AS c`
                    };
                    if (main.subQuery.from.length > 0 && main.subQuery.from[1] != "") res.from.push(`( ${this.pgQueryToString(main.subQuery)}) AS src`);
                    return res;
                }
            }
        }
        return undefined;
    }
    private pgQueryToString(input: IpgQuery | undefined): string | undefined {
        console.log(logging.whereIam(new Error().stack));
        return input
            ? `SELECT ${input.select}${EConstant.return} FROM ${input.from}${EConstant.return} ${input.join ? input.join : ""} ${input.where ? `WHERE ${input.where}${EConstant.return}` : ""}${
                  input.groupBy ? `GROUP BY ${cleanStringComma(input.groupBy)}${EConstant.return}` : ""
              }${input.orderBy ? `ORDER BY ${cleanStringComma(input.orderBy, ["ASC", "DESC"])}${EConstant.return}` : ""}${
                  input.skip && input.skip > 0 ? `OFFSET ${input.skip}${EConstant.return}` : ""
              } ${input.limit && input.limit > 0 ? `LIMIT ${input.limit}${EConstant.return}` : ""}`
            : undefined;
    }

    toWhere(main: RootPgVisitor | PgVisitor, _element?: PgVisitor): string {
        console.log(logging.whereIam(new Error().stack));
        this._pgQuery = this.create(main, true, _element);
        if (this._pgQuery) {
            const query = `SELECT ${this._pgQuery.select}${EConstant.return} FROM ${this._pgQuery.from}${EConstant.return} ${
                this._pgQuery.where ? `WHERE ${this._pgQuery.where}${EConstant.return}` : ""
            }`;
            if (query) {
                this._pgQuery = undefined;
                return query;
            }
        }
        throw new Error(EErrors.invalidQuery);
    }

    toString(main: RootPgVisitor | PgVisitor, _element?: PgVisitor): string {
        console.log(logging.whereIam(new Error().stack));
        if (!this._pgQuery) this._pgQuery = this.create(main, false, _element);
        const query = this.pgQueryToString(this._pgQuery);
        if (query) return query;
        throw new Error(EErrors.invalidQuery);
    }

    toPgQuery(main: RootPgVisitor | PgVisitor, _element?: PgVisitor): IpgQuery | undefined {
        console.log(logging.whereIam(new Error().stack));
        if (!this._pgQuery) this._pgQuery = this.create(main, false, _element);
        return this._pgQuery;
    }

    addFrom(input: string) {
        this.from = input;
    }
}
