/**
 * Query builder
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Query builder -----------------------------------!");

import { _COLUMNSEPARATOR } from "../../../constants";
import { doubleQuotesString, cleanStringComma, containsAll, isCsvOrArray, isGraph, isObservation, removeAllQuotes, removeFirstEndDoubleQuotes, formatPostgresString } from "../../../helpers";
import { asJson } from "../../../db/queries";
import { Iservice, Ientity, IKeyBoolean, IpgQuery } from "../../../types";
import { PgVisitor, RootPgVisitor } from "..";
import { models } from "../../../models";
import { allEntities, EOptions } from "../../../enums";
import { GroupBy, Key, OrderBy, Select, Where, Join } from ".";
import { errors } from "../../../messages";
import { _NAVLINK, _SELFLINK } from "../../../db/constants";
import { log } from "../../../log";

export class Query  {
    where: Where;
    select: Select;
    join: Join;
    orderBy: OrderBy;
    groupBy: GroupBy;
    keyNames: Key;
    _pgQuery: IpgQuery | undefined = undefined;

  
    constructor() {
      console.log(log.whereIam());
      this.where = new Where();
      this.select = new Select();
      this.orderBy = new OrderBy();
      this.join = new Join();
      this.groupBy = new GroupBy();
      this.keyNames = new Key([]);
    }

    private columnList(tableName: string, main: PgVisitor, element: PgVisitor): string[] | undefined  {
        const testIn = (input: string): boolean => ["CONCAT", "CASE", "COALESCE"].map(e => input.includes(e) ? true : false).filter(e => e === true).length > 0;

        /**
         * 
         * @param config config
         * @param entity entity name
         * @param column column name
         * @param options options
         * @returns formated column or 
         */
        
        function formatedColumn(service: Iservice , entity : Ientity, column: string, options?: IKeyBoolean): string | undefined {   
            console.log(log.whereIam(column));
            if (entity.columns[column]) {
                // is column have alias
                const alias = entity.columns[column].alias(service, options ? options : undefined);
                if (testIn(alias || column) === true) return alias || column;
                if (options) {
                    if (alias && options["alias"] === true) return alias;
                    let result: string = "";
                    if (options["table"] === true && (testIn(alias || column) === false)) result += `${doubleQuotesString(entity.table)}.`;
                    result += alias || options["quoted"] === true ? doubleQuotesString(column) : column;
                    if (options["as"] === true || (alias && alias.includes("->")) ) result += ` AS ${doubleQuotesString(column)}`;
                    return result;
                } else return column;
            } else if (testIn(column) === true) return column;
            if  (column === "selfLink") return  column; 
        };

        function extractColumnName(input: string): string{   
            const elem = input.split(input.includes(' AS ') ? ' AS ' : ".");
            elem.shift();
            return elem.join("."); 
        }
        
        // get good entity name
        const tempEntity = models.getEntity(main.ctx.config, tableName);
        if (!tempEntity) {
            console.log(log.error("no entity For", tableName));
            return;
        }
        // Add ceil and return if graph
        if (isGraph(main)) {
            if (element.query.orderBy.notNull()) element.query.orderBy.add(', ');
            // element.query.orderBy.add('"resultTime" ASC,');
            return [ main.interval
                ? `timestamp_ceil("resultTime", interval '${main.interval}') AS srcdate`
                : `@GRAPH@`];
        }
        
        // If array result add id 
        const returnValue: string[] = isCsvOrArray(main) && !element.query.select.toString().includes(`"id"${_COLUMNSEPARATOR}`) ? ["id"] : []; 
        // create selfLink                                   
        const selfLink = `CONCAT('${main.ctx.decodedUrl.root}/${tempEntity.name}(', "${tempEntity.table}"."id", ')') AS ${doubleQuotesString(_SELFLINK)}`; 
        // if $ref return only selfLink
        if (element.onlyRef == true) return [selfLink];
        if (element.showRelations == true ) returnValue.push(selfLink);
        // create list of columns
        const columns:string[] = (element.query.select.toString() === "*" || element.query.select.toString() === "")
            ? Object.keys(tempEntity.columns)
                .filter((word) => !word.includes("_"))
                .filter(e => !(e === "result" && element.splitResult))
                .filter(e => !tempEntity.columns[e].extensions || tempEntity.columns[e].extensions && containsAll(main.ctx.config.extensions, tempEntity.columns[e].extensions) === true || "")
            : element.query.select.toString().split(_COLUMNSEPARATOR).filter((word: string) => word.trim() != "").map(e => removeFirstEndDoubleQuotes(e));
            // loop on columns
        columns.map((column: string) => {
            const force = ["id", "result"].includes(column) ? true : false;
            return formatedColumn(main.ctx.config, tempEntity, column, { valueskeys: element.valueskeys, quoted: true, table: true, alias: force, as: isGraph(main) ? false : true } ) || "";
        }) .filter(e => e != "" ).forEach((e: string) => {   
            if (e === "selfLink") e = selfLink;             
            const testIisCsvOrArray = isCsvOrArray(element);            
            if (testIisCsvOrArray) this.keyNames.add(e);
            returnValue.push(e);
            if (main.interval) main.addToIntervalColumns(extractColumnName(e));
            if (e === "id" && (element.showRelations == true || isCsvOrArray(main))) {
                if (testIisCsvOrArray) this.keyNames.add("id"); 
                else returnValue.push(selfLink);    
            }     
             if (testIisCsvOrArray && ["payload", "deveui", "phenomenonTime"].includes(removeAllQuotes(e))) this.keyNames.add(e);
        });
        // add interval if requested
        if (main.interval) main.addToIntervalColumns(`CONCAT('${main.ctx.decodedUrl.root}/${tempEntity.name}(', COALESCE("@iot.id", '0')::text, ')') AS ${doubleQuotesString(_SELFLINK)}`);
        // If observation entity
        if (isObservation(tempEntity) === true && element.onlyRef === false ) {
            if (main.interval && !isGraph(main)) returnValue.push(`timestamp_ceil("resultTime", interval '${main.interval}') AS srcdate`);
            if (element.splitResult && main.parentEntity === "MultiDatastreams") element.splitResult.forEach((elem: string) => {
                const one = element && element.splitResult && element.splitResult.length === 1;
                const alias: string = one ? "result" : elem;
                returnValue.push( `(result->>'valueskeys')::json->'${element.splitResult && formatPostgresString(one ? element.splitResult[0] : alias)}' AS "${removeAllQuotes(one ? elem : alias)}"` );
                this.keyNames.add(one ? elem : alias);
            });
        }
        return returnValue;
    }

    // Create SQL Query
    private create(main: RootPgVisitor | PgVisitor, toWhere: boolean, _element?: PgVisitor): IpgQuery | undefined {        
        const element = _element ? _element : main;
        console.log(log.whereIam(element.entity || "blank"));
        if (element.entity.trim() !== "") {
            // get columns
            const select = toWhere === true ? ["id"] : this.columnList(element.entity, main, element);
            // if not null
            if (select) {
                // Get real entity name (plural)
                const realEntityName = models.getEntityName(main.ctx.config, element.entity);                
                if (realEntityName) {
                    // Create relations list
                    const relations: string[] = Object.keys(main.ctx.model[realEntityName].relations);
                    // loop includes
                    if (element.includes) element.includes.forEach((item) => {
                        const name = item.navigationProperty;
                        const index = relations.indexOf(name);
                        // if is relation
                        if (index >= 0) {
                            item.entity = name;
                            item.query.where.add(`${item.query.where.notNull() === true ?  " AND " : ''}${main.ctx.model[realEntityName].relations[name].expand}`); 
                            // create sql query    for this relatiion (IN JSON result)   
                            const query = this.pgQueryToString(this.create(item, false));
                            if (query) relations[index] = `(${asJson({ 
                                query: query, 
                                singular : models.isSingular(main.ctx.config, name),
                                strip: main.ctx.config.options.includes(EOptions.stripNull),
                                count: false })}) AS ${doubleQuotesString(name)}`;
                            else throw new Error(errors.invalidQuery);
                        }
                    });
                    // create all relations Query
                    if (toWhere === false) relations
                        .filter(e => e.includes('SELECT') || Object.keys(main.ctx.model).includes(models.getEntityName(main.ctx.config, e) || e))
                        .forEach((rel: string) => {
                            if (rel[0] == "(") select.push(rel);
                            else if (element.showRelations == true && main.onlyRef == false ) {
                                const tempTable = models.getEntityName(main.ctx.config, rel);
                                let stream: string | undefined = undefined;
                                if (tempTable && !main.ctx.model[realEntityName].relations[rel].relationKey.startsWith("_"))
                                    if ( main.ctx.config.options.includes(EOptions.stripNull) && realEntityName === main.ctx.model[allEntities.Observations].name &&  tempTable.endsWith(main.ctx.model[allEntities.Datastreams].name)) stream = `CASE WHEN ${main.ctx.model[tempTable].table}_id NOTNULL THEN`;
                                        select.push(`${stream ? stream : ""} CONCAT('${main.ctx.decodedUrl.root}/${main.ctx.model[realEntityName].name}(', ${doubleQuotesString(main.ctx.model[realEntityName].table)}."id", ')/${rel}') ${stream ? "END ": ""}AS "${rel}${_NAVLINK}"`);                            
                                        main.addToIntervalColumns(`'${main.ctx.decodedUrl.root}/${main.ctx.model[realEntityName].name}(0)/${rel}' AS "${rel}${_NAVLINK}"`);
                            }
                        });

                    return { 
                        select: select.join(",\n\t\t"), 
                        from: main.ctx.model[realEntityName].table , 
                        where: element.query.where.toString(), 
                        groupBy: element.query.groupBy.notNull() === true ?  element.query.groupBy.toString() : undefined,
                        orderBy: element.query.orderBy.notNull() === true ?  element.query.orderBy.toString() : main.ctx.model[realEntityName].orderBy,
                        skip: element.skip,
                        limit: element.limit,
                        keys: this.keyNames.toArray(),
                        count: `SELECT COUNT (DISTINCT ${Object.keys(main.ctx.model[realEntityName].columns)[0]}) FROM (SELECT ${Object.keys(main.ctx.model[realEntityName].columns)[0]} FROM "${main.ctx.model[realEntityName].table}"${element.query.where.notNull() === true ? ` WHERE ${element.query.where.toString()}` : ''}) AS c`
                    };
                }    
            }
        }
        return undefined;
    }

    private pgQueryToString(input: IpgQuery | undefined): string | undefined{    
        return input ? 
            `SELECT ${input.select}\n FROM "${input.from}"\n ${input.where 
                ? `WHERE ${input.where}\n` 
                : ''}${input.groupBy 
                ? `GROUP BY ${cleanStringComma(input.groupBy)}\n` 
                : ''}${input.orderBy 
                ? `ORDER BY ${cleanStringComma(input.orderBy,["ASC","DESC"])}\n` 
                : ''}${input.skip && input.skip > 0 
                ? `OFFSET ${input.skip}\n` 
                : ''} ${input.limit && input.limit > 0 
                ? `LIMIT ${input.limit}\n` 
                : ''}` 
            : undefined;
    }

    toWhere(main: RootPgVisitor | PgVisitor, _element?: PgVisitor): string {
        console.log(log.whereIam());
        this._pgQuery = this.create(main, true, _element);
        if (this._pgQuery) {
            const query = `SELECT ${this._pgQuery.select}\n FROM "${this._pgQuery.from}"\n ${this._pgQuery.where ? `WHERE ${this._pgQuery.where}\n` : '' }`;
            if (query) {
                this._pgQuery = undefined;
                return query;
            }
        }
        throw new Error(errors.invalidQuery);
    }

    toString(main: RootPgVisitor | PgVisitor, _element?: PgVisitor): string {
        console.log(log.whereIam());
        if(!this._pgQuery) this._pgQuery = this.create(main, false, _element);
        const query = this.pgQueryToString(this._pgQuery);
        if (query) return query;        
        throw new Error(errors.invalidQuery);
    }
    
    toPgQuery(main: RootPgVisitor | PgVisitor, _element?: PgVisitor): IpgQuery | undefined {
        console.log(log.whereIam());
        if(!this._pgQuery) this._pgQuery = this.create(main, false, _element);
        return this._pgQuery;
    }

}
