/**
 * Query builder
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Query builder -----------------------------------!");

import { _COLUMNSEPARATOR, STRINGEXC } from "../../../constants";
import { doubleQuotesString, cleanStringComma, containsAll, isCsvOrArray, isGraph, isGeoJson, removeAllQuotes, removeFirstEndDoubleQuotes, formatPgString } from "../../../helpers";
import { asJson } from "../../../db/queries";
import { Iservice, Ientity, IKeyBoolean, IpgQuery } from "../../../types";
import { PgVisitor, RootPgVisitor } from "..";
import { models } from "../../../models";
import { allEntities, EOptions } from "../../../enums";
import { GroupBy, Key, OrderBy, Select, Where, Join } from ".";
import { errors } from "../../../messages";
import { _NAVLINK, _SELFLINK } from "../../../db/constants";
import { log } from "../../../log";
import { expand, relationInfos } from "../../../models/helpers";
import { _isObservation } from "../../../helpers/tests";

export class Query  {
    from: string;
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

    private isCalcColumn(input: string): boolean {
        return STRINGEXC.map(e => input.includes(e) ? true : false).filter(e => e === true).length > 0;
    }

    private extractColumnName(input: string): string {   
        const elem = input.split(input.includes(' AS ') ? ' AS ' : ".");
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
    private formatedColumn(service: Iservice , entity : Ientity, column: string, options?: IKeyBoolean): string | undefined {   
        console.log(log.whereIam(column));
        // verify column exist
        if (entity.columns[column]) {
            // is column have alias
            const alias = entity.columns[column].alias(service, options);
            // const alias = entity.columns[column].alias(service, options ? options : undefined);
            if (this.isCalcColumn(alias || column) === true) return alias || column;                
            if (options) {                    
            if (alias && options["alias"] === true) return column === "id" ? `${doubleQuotesString(entity.table)}.${alias}` : alias;
                let result: string = "";
                if (options["table"] === true) result += `${doubleQuotesString(entity.table)}.`;
                // if (options["table"] === true && (testIn(alias || column) === false)) result += `${doubleQuotesString(entity.table)}.`;
                result += alias || options["quoted"] === true ? doubleQuotesString(column) : column;
                if (options["as"] === true || (alias && alias.includes("->")) ) result += ` AS ${doubleQuotesString(column)}`;
                return result;
            } else return column;
        } else if (this.isCalcColumn(column) === true) return column;
        if  (column === "selfLink") return  column; 
        if  (column.startsWith( "(SELECT")) return  column; 
    };

    private columnList(tableName: string, main: PgVisitor, element: PgVisitor): string[] | undefined  {
        console.log(log.whereIam());

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

        if (isGeoJson(tempEntity, main)) {
            const col = tempEntity.name === "Locations" ? "location" : "feature";
            main.query.where.add(`"${col}"::text LIKE '%coordinates%'`);
            return [ `${col} AS "geometry"`];
        }

        // if (main.ctx.config.extensions.includes(EExtensions.file) && isObservation(main) === true)  {
        //     element.showRelations = false;
        //     main.onlyRef = false;
        //     return [`(result->'value') AS result`];
        // }

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
            if (element.mario.hasOwnProperty(column)) return element.mario[column].join();
            return this.formatedColumn(main.ctx.config, tempEntity, column, { valueskeys: element.valueskeys, quoted: true, table: true, alias: ["id", "result"].includes(column), as: isGraph(main) ? false : true } ) || "";
        }) .filter(e => e != "" ).forEach((e: string) => {             
            if (e === "selfLink") e = selfLink;             
            const testIisCsvOrArray = isCsvOrArray(element);            
            if (testIisCsvOrArray) this.keyNames.add(e);
            returnValue.push(e);
            if (main.interval) main.addToIntervalColumns(this.extractColumnName(e));
            if (e === "id" && (element.showRelations == true || isCsvOrArray(main))) {
                if (testIisCsvOrArray) this.keyNames.add("id"); 
                else returnValue.push(selfLink);    
            }     
             if (testIisCsvOrArray && ["payload", "deveui", "phenomenonTime"].includes(removeAllQuotes(e))) this.keyNames.add(e);
        });
        // add interval if requested
        if (main.interval) main.addToIntervalColumns(`CONCAT('${main.ctx.decodedUrl.root}/${tempEntity.name}(', COALESCE("@iot.id", '0')::text, ')') AS ${doubleQuotesString(_SELFLINK)}`);
        // If observation entity
        if (_isObservation(tempEntity) === true && element.onlyRef === false ) {
            if (main.interval && !isGraph(main)) returnValue.push(`timestamp_ceil("resultTime", interval '${main.interval}') AS srcdate`);
            if (element.splitResult && main.parentEntity && main.parentEntity.name === "MultiDatastreams") element.splitResult.forEach((elem: string) => {
                const one = element && element.splitResult && element.splitResult.length === 1;
                const alias: string = one ? "result" : elem;
                returnValue.push( `(result->>'valueskeys')::json->'${element.splitResult && formatPgString(one ? element.splitResult[0] : alias)}' AS "${removeAllQuotes(one ? elem : alias)}"` );
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
                // Get real entity name (plural)
                // const element.entity.name = models.getEntityName(main.ctx.config, element.entity.name);                
                if (element.entity) {
                    // Create relations list
                    const relations: string[] = Object.keys(element.entity.relations);
                    // loop includes
                    if (element.includes) element.includes.forEach((item) => {
                        const name = item.navigationProperty;
                        const index = relations.indexOf(name);
                        // if is relation
                        if (element.entity && index >= 0) {
                            item.entity = models.getEntity(main.ctx.config, name);    ;
                            item.query.where.add(`${item.query.where.notNull() === true ?  " AND " : ''}${expand(main.ctx, element.entity.name, name)}`); 
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
                            else if (element.entity && element.showRelations == true && main.onlyRef == false ) {
                                const tempTable = models.getEntityName(main.ctx.config, rel);
                                let stream: string | undefined = undefined;
                                const relation = relationInfos(main.ctx.config, element.entity.name, rel);
                                if (tempTable && !relation.rightKey.startsWith("_"))
                                    if ( main.ctx.config.options.includes(EOptions.stripNull) && element.entity.name === main.ctx.model[allEntities.Observations].name && tempTable.endsWith(main.ctx.model[allEntities.Datastreams].name)) stream = `CASE WHEN ${main.ctx.model[tempTable].table}_id NOTNULL THEN`;
                                        select.push(`${stream ? stream : ""} CONCAT('${main.ctx.decodedUrl.root}/${main.ctx.model[element.entity.name].name}(', ${doubleQuotesString(main.ctx.model[element.entity.name].table)}."id", ')/${rel}') ${stream ? "END ": ""}AS "${rel}${_NAVLINK}"`);                            
                                        main.addToIntervalColumns(`'${main.ctx.decodedUrl.root}/${main.ctx.model[element.entity.name].name}(0)/${rel}' AS "${rel}${_NAVLINK}"`);
                            }
                        });

                    const res = { 
                        select: select.join(",\n\t\t"), 
                        from: [doubleQuotesString(main.ctx.model[element.entity.name].table)],
                        where: element.query.where.toString(), 
                        groupBy: element.query.groupBy.notNull() === true ?  element.query.groupBy.toString() : undefined,
                        orderBy: element.query.orderBy.notNull() === true ?  element.query.orderBy.toString() : main.ctx.model[element.entity.name].orderBy,
                        skip: element.skip,
                        limit: element.limit,
                        keys: this.keyNames.toArray(),
                        count: `SELECT COUNT (DISTINCT ${Object.keys(main.ctx.model[element.entity.name].columns)[0]}) FROM (SELECT ${Object.keys(main.ctx.model[element.entity.name].columns)[0]} FROM "${main.ctx.model[element.entity.name].table}"${element.query.where.notNull() === true ? ` WHERE ${element.query.where.toString()}` : ''}) AS c`
                    };
                    if (main.subQuery.from.length > 0 && main.subQuery.from[1] != "")   res.from.push(`( ${this.pgQueryToString(main.subQuery)}) AS src`);
                    return res
                }    
            }
        }
        return undefined;
    }

    private pgQueryToString(input: IpgQuery | undefined): string | undefined{    
        return input ? 
            `SELECT ${input.select}\n FROM ${input.from}\n ${input.where 
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
            const query = `SELECT ${this._pgQuery.select}\n FROM ${this._pgQuery.from}\n ${this._pgQuery.where ? `WHERE ${this._pgQuery.where}\n` : '' }`;
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

    addFrom(input: string) {
        this.from = input;
    }


}
