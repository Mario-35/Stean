/**
 * pgVisitor for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { simpleQuotes, isReturnGraph, isTest, removeAllQuotes, returnFormats, formatPgTableColumn, doubleQuotes } from "../../../helpers";
import { IodataContext, Ientity, IpgQuery, koaContext, IvisitRessource, IentityColumnAliasOptions, IentityColumn } from "../../../types";
import { Token } from "../../parser/lexer";
import { Literal } from "../../parser/literal";
import { SQLLiteral } from "../../parser/sqlLiteral";
import { SqlOptions } from "../../parser/sqlOptions";
import { createDefaultContext, createIentityColumnAliasOptions, oDataDateFormat, OdataGeoColumn } from "../helper";
import { messages } from "../../../messages";
import { EColumnType, EConstant, EDataType, EErrors, EHttpCode, EQuery } from "../../../enums";
import { models } from "../../../models";
import { logging } from "../../../log";
import { _DEBUG } from "../../../constants";
import { Visitor } from "./visitor";
import { Query } from "../builder";
import { relationInfos } from "../../../models/helpers";
import { isTestEntity } from "../../../helpers/tests";

export class PgVisitor extends Visitor {
    entity: Ientity | undefined = undefined;
    navigation:
        | [
              {
                  entity: string | undefined;
                  query: string | undefined;
                  id: bigint | string;
              }
          ]
        | undefined = undefined;
    // parent entity
    parentEntity: Ientity | undefined = undefined;
    id: bigint | string = BigInt(0);
    parentId: bigint | string = BigInt(0);
    subQuery: IpgQuery = { select: "", from: [], keys: [] };
    intervalColumns: string[] | undefined = [];
    splitResult: string[] | undefined;
    interval: string | undefined;
    payload: string | undefined;
    joinOffset: string | undefined;
    countOffset: string | undefined;
    skip = 0;
    limit = 0;
    count = false;
    numeric = false;
    returnNull = false;
    navigationProperty: string;
    parameters: unknown[] = [];
    ast: Token;
    showRelations = true;
    debugOdata = isTest() ? false : _DEBUG;
    single: boolean = false;
    constructor(ctx: koaContext, options = <SqlOptions>{}) {
        console.log(logging.whereIam(new Error().stack));
        super(ctx, options);
    }

    // ***********************************************************************************************************************************************************************
    // ***                                                           ROSSOURCES                                                                                            ***
    // ***********************************************************************************************************************************************************************
    public noLimit() {
        // this.limit = 1000000;
        this.limit = 0;
        this.skip = 0;
    }

    swapEntity(newEntity: Ientity, id?: bigint | string) {
        this.parentEntity = this.entity;
        this.entity = newEntity;
        this.parentId = this.id;
        this.id = id ? id : BigInt(0);
    }

    changeContext(target: string | undefined) {
        return {
            key: undefined,
            entity: undefined,
            table: undefined,
            target: target,
            identifier: undefined,
            relation: undefined,
            literal: undefined,
            sign: undefined,
            sql: undefined,
            in: undefined,
            onEachResult: undefined
        };
    }

    addToIntervalColumns(name: string, column: IentityColumn) {
        // TODO test with create
        if (column) {
            if ([EDataType.date, EDataType.time, EDataType.timestamp, EDataType.timestamptz].includes(column.dataType)) {
                if (!this.intervalColumns?.join().includes("step AS ")) name = `step AS ${doubleQuotes(name)}`;
                else return;
            } else if (column.dataType === EDataType.bigint) {
                name = `coalesce(${doubleQuotes(EConstant.id)}, 0) AS ${doubleQuotes(EConstant.id)}`;
            } else name = doubleQuotes(name);
        }
        if (this.intervalColumns) this.intervalColumns.push(name);
        else this.intervalColumns = [name];
    }

    protected getColumn(input: string, operation: string, context: IodataContext) {
        console.log(logging.whereIam(new Error().stack));

        const tempEntity = models.entity(this.ctx.model, context.identifier || "".split(".")[0]) || models.entity(this.ctx.model, this.entity || this.parentEntity || this.navigationProperty);

        const columnName = tempEntity
            ? this.getColumnAlias(tempEntity, input, context, false, operation, createIentityColumnAliasOptions(tempEntity, input, context, operation, undefined, this))
            : undefined;

        if (columnName) return columnName;
        else if (this.isSelect(context) && tempEntity && tempEntity.relations[input]) {
            const entityName = models.entityName(this.ctx.model, input);
            return tempEntity && entityName
                ? `CONCAT('${this.ctx.decodedUrl.root}/${tempEntity.name}(', "${tempEntity.table}"."id", ')/${entityName}') AS "${entityName}${EConstant.navLink}"`
                : undefined;
        }
    }

    cleanColumn(input: string) {
        return removeAllQuotes(input).split(".")[0];
    }
    getColumnAlias(
        entity: Ientity,
        columnName: string,
        context: IodataContext | undefined,
        showTable: boolean,
        operation: string | undefined,
        options?: IentityColumnAliasOptions
    ): string | undefined {
        options = options || createIentityColumnAliasOptions(entity, columnName, context, operation, undefined, this);
        const retResult = models.entityColumn(this.ctx.model, entity, columnName)?.alias(options);
        return retResult ? `${showTable === true && retResult && retResult[0] === '"' ? `${doubleQuotes(entity.table)}.${retResult}` : retResult}` : undefined;
    }
    clear(input: string) {
        if (input.includes("@START@")) {
            input = input.split("@START@").join("(");
            input = input.split("@END@").join("") + ")";
        }
        return input;
    }
    start(node: Token) {
        console.log(logging.head("Start PgVisitor").to().text());
        const temp = this.Visit(node);
        this.verifyQuery();
        // Logs.infos("PgVisitor", temp);
        temp.query.where.init(this.clear(temp.query.where.toString()));
        return temp;
    }
    verifyQuery = (): void => {
        console.log(logging.head("verifyQuery").to().text());
        const expands: string[] = [];
        if (this.includes)
            this.includes.forEach((element: PgVisitor) => {
                if (element.ast.type === "ExpandItem") expands.push(element.ast.raw.split("(")[0]);
            });
        expands.forEach((elem: string) => {
            const elems = elem.split("/");
            if (this.entity) elems.unshift(this.entity.name);
            if (elems[0]) {
                if (!Object.keys(this.ctx.model[elems[0]].relations).includes(elems[1]))
                    this.ctx.throw(EHttpCode.badRequest, {
                        detail: `Invalid expand path ${elems[1]} for ${elems[0]}`
                    });
            } else this.ctx.throw(EHttpCode.badRequest, { detail: messages.str(EErrors.invalid, "entity") + elems[0] });
        });
        if (this.entity && isTestEntity(this.entity, "Observations") === true && this.splitResult !== undefined && Number(this.parentId) == 0) {
            this.ctx.throw(EHttpCode.badRequest, { detail: EErrors.splitNotAllowed });
        }
        if (this.returnFormat === returnFormats.dataArray && BigInt(this.id) > 0 && !this.parentEntity) {
            this.ctx.throw(EHttpCode.badRequest, { detail: EErrors.dataArrayNotAllowed });
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Visit(node: Token, context?: IodataContext) {
        this.ast = this.ast || node;
        context = context || createDefaultContext();
        if (node) {
            const visitor: IvisitRessource = this[`Visit${node.type}` as keyof object];
            if (visitor) {
                visitor.call(this, node, context);
                if (this.debugOdata) {
                    logging.message("Visit", `Visit${node.type}`).to().file().log();
                    logging.message("node.raw", node.raw).to().file().log();
                    logging.message("this.query.where", this.query.where.toString()).to().file().log();
                    logging.message("context", context).to().file().log();
                }
            } else {
                logging.error(`Node error =================> Visit${node.type}`, node);
                throw new Error(`Unhandled node type: ${node.type}`);
            }
        }
        if (this.entity && node == this.ast) {
            if (this.entity.name.startsWith("Lora")) {
                if (typeof this.id == "string") {
                    this.query.where.init(`"lora"."deveui" = '${this.id}'`);
                }
            }
        }
        return this;
    }
    isOrderBy = (context: IodataContext): boolean => (context.target ? context.target === EQuery.OrderBy : false);
    isWhere = (context: IodataContext): boolean => (context.target ? context.target === EQuery.Where : false);
    isSelect = (context: IodataContext): boolean => (context.target ? context.target === EQuery.Select : false);
    protected VisitExpand(node: Token, context: IodataContext) {
        node.value.items.forEach((item: Token) => {
            const expandPath = item.value.path.raw;
            let visitor = this.includes ? this.includes.filter((v) => v.navigationProperty == expandPath)[0] : undefined;
            if (!visitor) {
                visitor = new PgVisitor(this.ctx, { ...this.options });
                this.includes ? this.includes.push(visitor) : (this.includes = [visitor]);
            }
            visitor.Visit(item, context);
        });
    }
    protected VisitEntity(node: Token, context: IodataContext) {
        this.Visit(node.value.path, context);
        if (node.value.options) node.value.options.forEach((item: Token) => this.Visit(item, context));
    }
    protected VisitSplitResult(node: Token, context: IodataContext) {
        this.Visit(node.value.path, context);
        if (node.value.options) node.value.options.forEach((item: Token) => this.Visit(item, context));
        this.splitResult = removeAllQuotes(node.value).split(",");
    }
    protected VisitInterval(node: Token, context: IodataContext) {
        this.Visit(node.value.path, context);
        if (node.value.options) node.value.options.forEach((item: Token) => this.Visit(item, context));
        this.interval = node.value;
        if (this.interval) this.noLimit();
    }
    protected VisitPayload(node: Token, context: IodataContext) {
        this.Visit(node.value.path, context);
        if (node.value.options) node.value.options.forEach((item: Token) => this.Visit(item, context));
        this.payload = node.value;
    }

    protected VisitDebug(node: Token, context: IodataContext) {
        this.Visit(node.value.path, context);
        if (node.value.options) node.value.options.forEach((item: Token) => this.Visit(item, context));
    }

    protected VisitResultFormat(node: Token, context: IodataContext) {
        if (node.value.format) this.returnFormat = returnFormats[node.value.format as keyof object];
        if ([returnFormats.graph, returnFormats.graphDatas, returnFormats.csv].includes(this.returnFormat)) this.noLimit();
        this.showRelations = false;
        if (isReturnGraph(this)) {
            this.showRelations = false;
        }
    }
    protected VisitExpandItem(node: Token, context: IodataContext) {
        this.Visit(node.value.path, context);
        if (node.value.options) node.value.options.forEach((item: Token) => this.Visit(item, context));
    }

    protected VisitExpandPath(node: Token, context: IodataContext) {
        this.navigationProperty = node.raw;
    }
    // Start loop process
    protected VisitQueryOptions(node: Token, context: IodataContext) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.value.options.forEach((option: any) => this.Visit(option, context));
    }

    protected VisitInlineCount(node: Token, context: IodataContext) {
        this.count = Literal.convert(node.value.value, node.value.raw);
    }
    protected VisitFilter(node: Token, context: IodataContext) {
        context = this.changeContext(EQuery.Where);
        // context.target = EQuery.Where;
        if (this.query.where.toString().trim() != "") this.addToWhere(" AND ", context);
        this.Visit(node.value, context);
    }
    protected VisitOrderBy(node: Token, context: IodataContext) {
        context = this.changeContext(EQuery.OrderBy);
        // context.target = EQuery.OrderBy;
        node.value.items.forEach((item: Token, i: number) => {
            this.Visit(item, context);
            if (i < node.value.items.length - 1) this.query.orderBy.add(", ");
        });
    }
    protected VisitOrderByItem(node: Token, context: IodataContext) {
        this.Visit(node.value.expr, context);
        if (this.query.orderBy.notNull()) this.query.orderBy.add(node.value.direction > 0 ? " ASC" : " DESC");
    }

    protected VisitSkip(node: Token, context: IodataContext) {
        this.skip = +node.value.raw;
    }

    protected VisitTop(node: Token, context: IodataContext) {
        this.limit = +node.value.raw;
    }
    protected VisitSelect(node: Token, context: IodataContext) {
        context = this.changeContext(EQuery.Select);

        // context.target = EQuery.Select;
        node.value.items.forEach((item: Token) => {
            this.Visit(item, context);
        });
    }
    protected VisitSelectItem(node: Token, context: IodataContext) {
        const tempColumn = this.getColumn(node.raw, "", context);
        context.identifier = tempColumn ? tempColumn : node.raw;
        if (context.target)
            // @ts-ignore
            (this.query[context.target as keyof object] as Query).add(tempColumn ? `${tempColumn}${EConstant.columnSeparator}` : `${doubleQuotes(node.raw)}${EConstant.columnSeparator}`);
        this.showRelations = false;
    }
    protected VisitAndExpression(node: Token, context: IodataContext) {
        this.Visit(node.value.left, context);
        this.addToWhere(context.in && context.in === true ? " INTERSECT " : " AND ", context);
        this.Visit(node.value.right, context);
    }
    protected VisitOrExpression(node: Token, context: IodataContext) {
        this.Visit(node.value.left, context);
        this.addToWhere(" OR ", context);
        this.Visit(node.value.right, context);
    }
    protected VisitNotExpression(node: Token, context: IodataContext) {
        this.addToWhere(" NOT ", context);
        this.Visit(node.value, context);
    }
    protected VisitBoolParenExpression(node: Token, context: IodataContext) {
        this.addToWhere("(", context);
        this.Visit(node.value, context);
        this.addToWhere(")", context);
    }
    protected VisitCommonExpression(node: Token, context: IodataContext) {
        this.Visit(node.value, context);
    }
    protected VisitFirstMemberExpression(node: Token, context: IodataContext) {
        this.Visit(node.value, context);
    }
    protected VisitMemberExpression(node: Token, context: IodataContext) {
        this.Visit(node.value, context);
    }
    protected VisitPropertyPathExpression(node: Token, context: IodataContext) {
        if (node.value.current && node.value.next) {
            // deterwine if its column AND JSON
            if (
                this.entity &&
                models.entityRelationColumnTable(this.ctx.model, this.entity, node.value.current.raw) === EColumnType.Column &&
                models.isEntityColumnType(this.ctx.model, this.entity, node.value.current.raw, "json") &&
                node.value.next.raw[0] == "/"
            ) {
                this.addToWhere(`${doubleQuotes(node.value.current.raw)}->>${simpleQuotes(node.value.next.raw.slice(1))}`, context);
            } else if (node.value.next.raw[0] == "/") {
                this.Visit(node.value.current, context);
                context.identifier += ".";
                this.Visit(node.value.next, context);
            } else {
                this.Visit(node.value.current, context);
                context.identifier += ".";
                this.Visit(node.value.next, context);
            }
        } else this.Visit(node.value, context);
    }
    protected VisitSingleNavigationExpression(node: Token, context: IodataContext) {
        if (node.value.current && node.value.next) {
            this.Visit(node.value.current, context);
            this.Visit(node.value.next, context);
        } else this.Visit(node.value, context);
    }
    protected VisitLesserThanExpression(node: Token, context: IodataContext) {
        context.sign = "<";
        if (!this.VisitDateType(node, context) && !this.VisitRangeType(node, context)) {
            this.Visit(node.value.left, context);
            this.addExpressionToWhere(node, context);
            this.Visit(node.value.right, context);
        }
    }
    protected VisitLesserOrEqualsExpression(node: Token, context: IodataContext) {
        context.sign = "<=";
        if (!this.VisitDateType(node, context) && !this.VisitRangeType(node, context)) {
            this.Visit(node.value.left, context);
            this.addExpressionToWhere(node, context);
            this.Visit(node.value.right, context);
        }
    }

    protected VisitDateType(node: Token, context: IodataContext): boolean {
        if (
            this.entity &&
            context.sign &&
            models.entityRelationColumnTable(this.ctx.model, this.entity, node.value.left.raw) === EColumnType.Column &&
            [EDataType.date, EDataType.timestamp, EDataType.timestamptz].includes(models.entityColumnType(this.ctx.model, this.entity, node.value.left.raw))
        ) {
            const columnName = this.getColumnAlias(this.ctx.model[context.identifier || this.entity.name], node.value.left.raw, context, true, undefined);
            const testIsDate = oDataDateFormat(node, context.sign);
            if (testIsDate) {
                this.addToWhere(`${columnName ? columnName : `${doubleQuotes(node.value.left.raw)}`}${testIsDate}`, context);
                return true;
            }
        }
        return false;
    }

    protected VisitRangeType(node: Token, context: IodataContext): boolean {
        if (
            context.entity &&
            context.sign &&
            models.entityRelationColumnTable(this.ctx.model, context.entity, node.value.left.raw) === EColumnType.Column &&
            [EDataType.tsrange, EDataType.tstzrange].includes(models.entityColumnType(this.ctx.model, context.entity, node.value.left.raw))
        ) {
            const testIsDate = oDataDateFormat(node, context.sign);
            let columnName: string | undefined = undefined;
            switch (context.sign) {
                case "<":
                case "<=":
                case "=<":
                    columnName = `LOWER("${node.value.left.raw}")${testIsDate}`;
                    break;
                case ">":
                case ">=":
                case "=>":
                    columnName = `UPPER("${node.value.left.raw}")${testIsDate}`;
                    break;

                default:
                    break;
            }

            if (columnName) this.addToWhere(columnName, context);
            return true;
        }
        return false;
    }

    inverseSign(input: string | undefined) {
        if (input)
            switch (input) {
                case ">":
                    return "<";
                case ">=":
                    return "<=";
                case "<":
                    return ">";
                case "<=":
                    return ">=";
                default:
                    return input;
            }
    }
    addToWhere(value: string, context: IodataContext) {
        console.log(logging.head("addToWhere").to().text());
        if (context.target === EQuery.Geo) this.subQuery.where ? (this.subQuery.where += value) : (this.subQuery.where = value);
        else this.query.where.add(value);
    }

    protected addExpressionToWhere(node: Token, context: IodataContext) {
        if (this.query.where.toString().includes("@EXPRESSION@")) this.query.where.replace("@EXPRESSION@", `@EXPRESSION@ ${this.inverseSign(context.sign)}`);
        else if (!this.query.where.toString().includes("@EXPRESSIONSTRING@") && this.inverseSign(context.sign))
            // Important to keep space
            this.addToWhere(" " + context.sign, context);
    }
    protected VisitGreaterThanExpression(node: Token, context: IodataContext) {
        context.sign = ">";
        if (!this.VisitDateType(node, context) && !this.VisitRangeType(node, context)) {
            this.Visit(node.value.left, context);
            this.addExpressionToWhere(node, context);
            this.Visit(node.value.right, context);
        }
    }
    protected VisitGreaterOrEqualsExpression(node: Token, context: IodataContext) {
        context.sign = ">=";
        if (!this.VisitDateType(node, context) && !this.VisitRangeType(node, context)) {
            this.Visit(node.value.left, context);
            this.addExpressionToWhere(node, context);
            this.Visit(node.value.right, context);
        }
    }
    public createDefaultOptions(): Record<string, boolean> {
        return {
            valueskeys: this.valueskeys,
            numeric: this.numeric
        };
    }
    public createComplexWhere(entity: string, node: Token, context: IodataContext) {
        console.log(logging.head("createComplexWhere").to().text());

        if (context.target) {
            if (!models.entity(this.ctx.model, entity)) return;
            const tempEntity = models.entity(this.ctx.model, node.value.name);
            if (tempEntity) {
                const relation = relationInfos(this.ctx.model, entity, node.value.name);
                if (context.relation) {
                    context.sql = `${formatPgTableColumn(this.ctx.model[entity].table, relation.column)} IN (SELECT ${formatPgTableColumn(
                        tempEntity.table,
                        relation.rightKey
                    )} FROM ${formatPgTableColumn(tempEntity.table)}`;
                } else {
                    context.relation = node.value.name;
                    context.entity = tempEntity.name;
                    context.table = tempEntity.table;
                }
                if (!context.key && context.relation) {
                    context.key = relation.column;
                    // @ts-ignore
                    this.query[context.target].add(doubleQuotes(relation.column));
                }
            }
        }
    }

    protected VisitODataIdentifier(node: Token, context: IodataContext) {
        const alias = this.getColumn(node.value.name, "", context);
        node.value.name = alias || node.value.name;
        if (context.relation && context.identifier && models.isEntityColumnType(this.ctx.model, this.ctx.model[context.relation], this.cleanColumn(context.identifier), "json")) {
            context.identifier = `${doubleQuotes(this.cleanColumn(context.identifier))}->>${simpleQuotes(node.raw)}`;
        } else {
            if (this.isWhere(context) && this.entity) this.createComplexWhere(context.identifier ? this.cleanColumn(context.identifier) : this.entity.name, node, context);
            if (!context.relation && !context.identifier && alias && context.target) {
                // @ts-ignore
                this.query[context.target].add(alias);
            } else {
                context.identifier = node.value.name;
                if (this.entity && context.target && !context.relation) {
                    let alias = this.getColumnAlias(this.entity, node.value.name, context, false, undefined);
                    alias = context.target === EQuery.Where ? alias?.split(" AS ")[0] : EQuery.OrderBy ? doubleQuotes(node.value.name) : alias;
                    // @ts-ignore
                    this.query[context.target].add(
                        node.value.name.includes("->>") || node.value.name.includes("->") || node.value.name.includes("::")
                            ? node.value.name
                            : this.entity && this.ctx.model[this.entity.name]
                            ? alias
                                ? alias
                                : node.value.name
                            : doubleQuotes(node.value.name)
                    );
                }
            }
        }
    }

    protected VisitEqualsExpression(node: Token, context: IodataContext): void {
        context.sign = "=";
        if (!this.VisitDateType(node, context) && !this.VisitRangeType(node, context)) {
            this.Visit(node.value.left, context);
            this.addExpressionToWhere(node, context);
            this.Visit(node.value.right, context);
            this.query.where.replace(/= null/, "IS NULL");
        }
    }
    protected VisitNotEqualsExpression(node: Token, context: IodataContext): void {
        context.sign = "<>";
        if (!this.VisitDateType(node, context) && !this.VisitRangeType(node, context)) {
            this.Visit(node.value.left, context);
            this.addExpressionToWhere(node, context);
            this.Visit(node.value.right, context);
            this.query.where.replace(/<> null$/, "IS NOT NULL");
        }
    }
    protected VisitLiteral(node: Token, context: IodataContext): void {
        if (this.entity && context.relation && context.table && context.target === EQuery.Where) {
            const temp = this.query.where
                .toString()
                .split(" ")
                .filter((e) => e != "");
            context.sign = temp.pop();
            this.query.where.init(temp.join(" "));
            const relation = relationInfos(this.ctx.model, this.entity.name, context.relation);
            this.addToWhere(
                ` ${context.in && context.in === true ? "" : " IN @START@"}(SELECT ${
                    this.entity.relations[context.relation] ? doubleQuotes(relation.rightKey) : `${doubleQuotes(context.table)}."id"`
                } FROM ${doubleQuotes(context.table)} WHERE `,
                context
            );
            context.in = true;
            if (context.identifier) {
                if (context.identifier.startsWith("CASE") || context.identifier.startsWith("("))
                    this.addToWhere(`${context.identifier} ${context.sign} ${SQLLiteral.convert(node.value, node.raw)})`, context);
                else if (context.identifier.includes("@EXPRESSION@")) {
                    const tempEntity = models.entity(this.ctx.model, context.relation);
                    const alias = tempEntity ? this.getColumnAlias(tempEntity, context.identifier, context, false, undefined) : undefined;

                    this.addToWhere(
                        context.sql
                            ? `${context.sql} ${context.target} ${doubleQuotes(context.identifier)}))@END@`
                            : `${alias ? alias : `${context.identifier.replace("@EXPRESSION@", ` ${SQLLiteral.convert(node.value, node.raw)} ${this.inverseSign(context.sign)}`)}`})`,
                        context
                    );
                } else {
                    const tempEntity = models.entity(this.ctx.model, context.relation);
                    const quotes = context.identifier[0] === '"' ? "" : '"';
                    const alias = tempEntity ? this.getColumnAlias(tempEntity, context.identifier, context, false, undefined) : undefined;
                    this.addToWhere(
                        context.sql
                            ? `${context.sql} ${context.target} ${doubleQuotes(context.identifier)} ${context.sign} ${SQLLiteral.convert(node.value, node.raw)}))@END@`
                            : `${alias ? "" : `${context.table}.`}${alias ? alias : `${quotes}${context.identifier}${quotes}`} ${context.sign} ${SQLLiteral.convert(node.value, node.raw)})`,
                        context
                    );
                }
            }
        } else {
            const temp = (context.literal = node.value == "Edm.Boolean" ? node.raw : SQLLiteral.convert(node.value, node.raw));
            if (this.query.where.toString().includes("@EXPRESSION@")) this.query.where.replace("@EXPRESSION@", temp);
            else if (this.query.where.toString().includes("@EXPRESSIONSTRING@")) this.query.where.replace("@EXPRESSIONSTRING@", `${temp} ${this.inverseSign(context.sign)}`);
            else this.addToWhere(temp, context);
        }
    }
    protected VisitInExpression(node: Token, context: IodataContext): void {
        this.Visit(node.value.left, context);
        this.addToWhere(" IN (", context);
        this.Visit(node.value.right, context);
        this.addToWhere(":list)", context);
    }
    protected VisitArrayOrObject(node: Token, context: IodataContext): void {
        this.addToWhere((context.literal = SQLLiteral.convert(node.value, node.raw)), context);
    }

    protected VisitMethodCallExpression(node: Token, context: IodataContext) {
        const method = node.value.method;
        const params = node.value.parameters || [];

        const isColumn = (input: number | string): string | undefined => {
            const entity = this.entity;
            const column = typeof input === "string" ? input : decodeURIComponent(Literal.convert(params[input].value, params[input].raw));
            if (column.includes("/")) {
                const temp = column.split("/");
                if (entity && entity.relations.hasOwnProperty(temp[0])) {
                    const tempEntity = models.entity(this.ctx.model, temp[0]);
                    if (tempEntity) return temp[1];
                }
            } else if (entity && entity.columns.hasOwnProperty(column)) return column;
            else if (entity && entity.relations.hasOwnProperty(EConstant.encoding)) return EConstant.encoding;
        };
        const columnOrData = (index: number, operation: string, forceString: boolean): string => {
            // convert into string
            const test = decodeURIComponent(Literal.convert(params[index].value, params[index].raw));
            // if (FeatureOfInterest/feature)
            if (this.entity && test.includes("/")) {
                const tests = test.split("/");
                const relation = relationInfos(this.ctx.model, this.entity.name, tests[0]);
                if (relation && relation.entity) {
                    const relationEntity = models.entity(this.ctx.model, tests[0]);
                    if (relationEntity) this.subQuery.from.push(relationEntity.table);
                    this.query.where.add(`${formatPgTableColumn(relation.entity.table, relation.leftKey)} = "src"."id"`);
                    return formatPgTableColumn(tests[0], tests[1]);
                }
            }
            const column = isColumn(test);
            if (column && this.entity)
                return (
                    this.getColumnAlias(this.entity, column, context, false, operation, createIentityColumnAliasOptions(this.entity, column, context, operation, forceString, this)) ||
                    doubleQuotes(column)
                );
            // Geo datas
            const temp = decodeURIComponent(Literal.convert(params[index].value, params[index].raw)).replace("geography", "");
            return simpleQuotes(this.entity && this.entity.columns[temp] ? temp : removeAllQuotes(temp));
        };

        const cleanData = (index: number): string =>
            params[index].value == "Edm.String" ? removeAllQuotes(Literal.convert(params[index].value, params[index].raw)) : Literal.convert(params[index].value, params[index].raw);
        const order = params.length === 2 ? (isColumn(0) ? [0, 1] : [1, 0]) : [0];
        switch (String(this.cleanColumn(method))) {
            case "contains":
                this.Visit(params[0], context);
                this.addToWhere(` ~* '${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}'`, context);
                break;
            case "containsAny":
                this.addToWhere("array_to_string(", context);
                this.Visit(params[0], context);
                this.addToWhere(`, ' ') ~* '${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}'`, context);
                break;
            case "endswith":
                this.addToWhere(`${columnOrData(0, "", true)}  ILIKE '%${cleanData(1)}'`, context);
                break;
            case "startswith":
                this.addToWhere(`${columnOrData(0, "", true)} ILIKE '${cleanData(1)}%'`, context);
                break;
            case "substring":
                this.addToWhere(
                    params.length == 3 ? ` SUBSTR(${columnOrData(0, "", true)}, ${cleanData(1)} + 1, ${cleanData(2)})` : ` SUBSTR(${columnOrData(0, "", true)}, ${cleanData(1)} + 1)`,
                    context
                );
                break;
            case "substringof":
                this.addToWhere(`${columnOrData(0, "", true)} ILIKE '%${cleanData(1)}%'`, context);
                break;
            case "indexof":
                this.addToWhere(` POSITION('${cleanData(1)}' IN ${columnOrData(0, "", true)})`, context);
                break;
            case "concat":
                this.addToWhere(`(${columnOrData(0, "concat", true)} || '${cleanData(1)}')`, context);
                break;
            case "length":
                // possibilty calc length string of each result or result
                context.onEachResult = true;
                this.addToWhere(
                    decodeURIComponent(Literal.convert(params[0].value, params[0].raw)) === "result"
                        ? `${columnOrData(0, "CHAR_LENGTH", true)}`
                        : `CHAR_LENGTH(${columnOrData(0, "CHAR_LENGTH", true)})`,
                    context
                );
                break;
            case "tolower":
                this.addToWhere(`LOWER(${columnOrData(0, "", true)})`, context);
                break;
            case "toupper":
                this.addToWhere(`UPPER(${columnOrData(0, "", true)})`, context);
                break;
            case "year":
            case "month":
            case "day":
            case "hour":
            case "minute":
            case "second":
                this.addToWhere(`EXTRACT(${method.toUpperCase()} FROM ${columnOrData(0, "", false)})`, context);
                break;
            case "round":
            case "floor":
            case "ceiling":
                context.onEachResult = true;
                this.addToWhere(columnOrData(0, method.toUpperCase(), false), context);
                break;
            case "now":
                this.addToWhere("NOW()", context);
                break;
            case "date":
                this.addToWhere(`${method.toUpperCase()}(`, context);
                this.Visit(params[0], context);
                this.addToWhere(")", context);
                break;
            case "time":
                this.addToWhere(`(${columnOrData(0, "", true)})::time`, context);
                break;
            case "geo":
                const tmpGeo = new OdataGeoColumn(this, method, columnOrData(order[0], "", true));
                context = tmpGeo.createColumn(columnOrData(order[1], "", true), context);
                // if (method === "geo.length")
                //   context = tmpGeo.createColumn(`ST_Length(ST_MakeLine(ST_AsText(@GEO@), ${columnOrData(order[1], "", true)}))`, context);
                // else
                //   context = tmpGeo.createColumn(`${method.toUpperCase().replace("GEO.", "ST_")}(ST_AsText(@GEO@), ${columnOrData(order[1], "", true)})`, context);
                break;
            case "trim":
                this.addToWhere(`TRIM(BOTH '${params.length == 2 ? cleanData(1) : " "}' FROM ${columnOrData(0, "", true)})`, context);
                break;
            case "mindatetime":
                this.addToWhere(`MIN(${this.query.where.toString().split('" ')[0]}")`, context);
                break;
        }
    }
    toString(): string {
        return this.query.toString(this);
    }
    toPgQuery(): IpgQuery | undefined {
        return this.query.toPgQuery(this);
    }
}
