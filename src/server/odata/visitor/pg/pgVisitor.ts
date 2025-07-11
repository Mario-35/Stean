/**
 * pgVisitor for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { doubleQuotesString, simpleQuotesString, isGraph, isTest, removeAllQuotes, returnFormats, formatPgTableColumn } from "../../../helpers";
import { IodataContext, Ientity, IpgQuery, koaContext, IvisitRessource } from "../../../types";
import { Token } from "../../parser/lexer";
import { Literal } from "../../parser/literal";
import { SQLLiteral } from "../../parser/sqlLiteral";
import { SqlOptions } from "../../parser/sqlOptions";
import { oDataDateFormat, OdataGeoColumn } from "../helper";
import { errors, msg } from "../../../messages";
import { EColumnType, EConstant, EHttpCode, EQuery } from "../../../enums";
import { models } from "../../../models";
import { log } from "../../../log";
import { _DEBUG } from "../../../constants";
import { Visitor } from "./visitor";
import { Query } from "../builder";
import { relationInfos } from "../../../models/helpers";
import { isFile, isTestEntity } from "../../../helpers/tests";
import { DATASTREAM } from "../../../models/entities";
import { formatResultColuwn } from "../../../models/types";
export class PgVisitor extends Visitor {
    entity: Ientity | undefined = undefined;
    columnSpecials: { [key: string]: string[] } = {};
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
    intervalColumns: string[] | undefined = undefined;
    splitResult: string[] | undefined;
    interval: string | undefined;
    payload: string | undefined;
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
        console.log(log.whereIam());
        super(ctx, options);
    }

    // ***********************************************************************************************************************************************************************
    // ***                                                           ROSSOURCES                                                                                            ***
    // ***********************************************************************************************************************************************************************
    public noLimit() {
        this.limit = 0;
        this.skip = 0;
    }

    swapEntity(newEntity: Ientity, id?: bigint | string) {
        this.parentEntity = this.entity;
        this.entity = newEntity;
        this.parentId = this.id;
        this.id = id ? id : BigInt(0);
    }

    addToIntervalColumns(input: string) {
        // TODO test with create
        if (input.endsWith('Time"')) input = `step AS ${input}`;
        else if (input === doubleQuotesString(EConstant.id)) input = `coalesce(${doubleQuotesString(EConstant.id)}, 0) AS ${doubleQuotesString(EConstant.id)}`;
        else if (input.startsWith("CONCAT")) input = `${input}`;
        else if (input[0] !== "'") input = `${input}`;
        if (this.intervalColumns) this.intervalColumns.push(input);
        else this.intervalColumns = [input];
    }

    protected getColumn(input: string, operation: string, context: IodataContext) {
        console.log(log.whereIam(input));
        const tempEntity =
            context.target === EQuery.Where && context.identifier
                ? models.getEntity(this.ctx.service, this.cleanColumn(context.identifier))
                : this.isSelect(context)
                ? models.getEntity(this.ctx.service, this.entity || this.parentEntity || this.navigationProperty)
                : undefined;

        const columnName = input === "result" ? this.formatColumnResult(context, operation) : tempEntity ? this.getColumnNameOrAlias(tempEntity, input, this.createDefaultOptions()) : undefined;
        if (columnName) return columnName;

        if (this.isSelect(context) && tempEntity && tempEntity.relations[input]) {
            const entityName = models.getEntityName(this.ctx.service, input);
            return tempEntity && entityName
                ? `CONCAT('${this.ctx.decodedUrl.root}/${tempEntity.name}(', "${tempEntity.table}"."id", ')/${entityName}') AS "${entityName}${EConstant.navLink}"`
                : undefined;
        }
    }

    cleanColumn(input: string) {
        return removeAllQuotes(input).split(".")[0];
    }

    // ***********************************************************************************************************************************************************************
    // ***                                                              QUERY                                                                                              ***
    // ***********************************************************************************************************************************************************************
    formatColumnResult(context: IodataContext, operation: string, ForceString?: boolean) {
        switch (context.target) {
            case EQuery.Where:
                const nbs = Array.from({ length: this.parentEntity?.name === DATASTREAM.name ? 1 : 5 }, (v, k) => k + 1);
                const translate = `TRANSLATE (SUBSTRING ("result"->>'value' FROM '(([0-9]+.*)*[0-9]+)'), '[]','')`;
                const isOperation = operation.trim() != "";
                const test = ForceString || isFile(this.ctx.service);
                // json path = had to be ==
                if (!test && !context.onEachResult && context.sign && context.sign === "=") context.sign = "==";
                return test
                    ? // operation on string
                      context.onEachResult
                        ? `@EXPRESSIONSTRING@ ALL (ARRAY_REMOVE( ARRAY[${EConstant.return}${nbs
                              .map((e) => `${isOperation ? `${operation} (` : ""} SPLIT_PART ( ${translate}, ',', ${e}))`)
                              .join(`,${EConstant.return}`)}], null))`
                        : `"result"->>'value'`
                    : context.onEachResult
                    ? // OPERATION ROUND FLOOR CEILING (jsonpath can't process it)
                      `@EXPRESSION@ ALL (ARRAY_REMOVE( ARRAY[${EConstant.return}${nbs
                          .map((e) => `${isOperation ? `${operation} (` : ""}NULLIF (SPLIT_PART ( ${translate}, ',', ${e}),'')::numeric${isOperation ? `)` : ""}`)
                          .join(`,${EConstant.return}`)}], null))`
                    : // jsonpath postgres operation
                      `result @? '$.value ? (@EXPRESSION@ @)'`;

            default:
                return formatResultColuwn({ numeric: this.numeric, valueskeys: this.valueskeys, as: this.isSelect(context) });
        }
    }

    getColumnNameOrAlias(entity: Ientity, column: string, options: Record<string, boolean>): string | undefined {
        let result: string | undefined | void = undefined;
        if (entity && column != "" && entity.columns[column]) {
            result = entity.columns[column].alias(this.ctx.service, options);
            if (!result) result = doubleQuotesString(column);
        }
        return result ? `${options.table === true && result && result[0] === '"' ? `"${entity.table}".${result}` : result}` : undefined;
    }
    clear(input: string) {
        if (input.includes("@START@")) {
            input = input.split("@START@").join("(");
            input = input.split("@END@").join("") + ")";
        }
        return input;
    }
    start(node: Token) {
        console.log(log.debug_head("Start PgVisitor"));
        const temp = this.Visit(node);
        this.verifyQuery();
        // Logs.infos("PgVisitor", temp);
        temp.query.where.init(this.clear(temp.query.where.toString()));
        return temp;
    }
    verifyQuery = (): void => {
        console.log(log.debug_head("verifyQuery"));
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
            } else this.ctx.throw(EHttpCode.badRequest, { detail: msg(errors.invalid, "entity") + elems[0] });
        });
        if (this.entity && isTestEntity(this.entity, "Observations") === true && this.splitResult !== undefined && Number(this.parentId) == 0) {
            this.ctx.throw(EHttpCode.badRequest, { detail: errors.splitNotAllowed });
        }
        if (this.returnFormat === returnFormats.dataArray && BigInt(this.id) > 0 && !this.parentEntity) {
            this.ctx.throw(EHttpCode.badRequest, { detail: errors.dataArrayNotAllowed });
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Visit(node: Token, context?: IodataContext) {
        this.ast = this.ast || node;
        context = context || {
            target: EQuery.Where,
            key: undefined,
            entity: undefined,
            table: undefined,
            identifier: undefined,
            relation: undefined,
            literal: undefined,
            sign: undefined,
            sql: undefined,
            onEachResult: undefined,
            in: undefined
        };
        if (node) {
            const visitor: IvisitRessource = this[`Visit${node.type}` as keyof object];
            if (visitor) {
                visitor.call(this, node, context);
                if (this.debugOdata) {
                    console.log(log._infos("Visit", `Visit${node.type}`));
                    console.log(log._result("node.raw", node.raw));
                    console.log(log._result("this.query.where", this.query.where.toString()));
                    console.log(log._infos("context", context));
                }
            } else {
                log.error(`Node error =================> Visit${node.type}`);
                log.error(node);
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
        if (isGraph(this)) {
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
        context.target = EQuery.Where;
        if (this.query.where.toString().trim() != "") this.addToWhere(" AND ", context);
        this.Visit(node.value, context);
    }
    protected VisitOrderBy(node: Token, context: IodataContext) {
        context.target = EQuery.OrderBy;
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
        context.target = EQuery.Select;
        node.value.items.forEach((item: Token) => {
            this.Visit(item, context);
        });
    }
    protected VisitSelectItem(node: Token, context: IodataContext) {
        const tempColumn = this.getColumn(node.raw, "", context);
        if (isFile(this.ctx.service)) {
            context.identifier = `(result->'valueskeys')->>'${node.raw}' AS "${node.raw}"`;
            // this.ctx.columnSpecials["result"] =`(result->'valueskeys')->>'${node.raw}' AS "${node.raw}"`;
        } else context.identifier = tempColumn ? tempColumn : node.raw;
        if (context.target)
            // @ts-ignore
            (this.query[context.target as keyof object] as Query).add(tempColumn ? `${tempColumn}${EConstant.columnSeparator}` : `${doubleQuotesString(node.raw)}${EConstant.columnSeparator}`);
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
                models.getRelationColumnTable(this.ctx.service, this.entity, node.value.current.raw) === EColumnType.Column &&
                models.isColumnType(this.ctx.service, this.entity, node.value.current.raw, "json") &&
                node.value.next.raw[0] == "/"
            ) {
                this.addToWhere(`${doubleQuotesString(node.value.current.raw)}->>${simpleQuotesString(node.value.next.raw.slice(1))}`, context);
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
        if (!this.VisitDateType(node, context)) {
            this.Visit(node.value.left, context);
            this.addExpressionToWhere(node, context);
            this.Visit(node.value.right, context);
        }
    }
    protected VisitLesserOrEqualsExpression(node: Token, context: IodataContext) {
        context.sign = "<=";
        if (!this.VisitDateType(node, context)) {
            this.Visit(node.value.left, context);
            this.addExpressionToWhere(node, context);
            this.Visit(node.value.right, context);
        }
    }
    protected VisitDateType(node: Token, context: IodataContext): boolean {
        if (
            this.entity &&
            context.sign &&
            models.getRelationColumnTable(this.ctx.service, this.entity, node.value.left.raw) === EColumnType.Column &&
            models.isColumnType(this.ctx.service, this.entity, node.value.left.raw, "date")
        ) {
            const testIsDate = oDataDateFormat(node, context.sign);
            const columnName = this.getColumnNameOrAlias(this.ctx.model[context.identifier || this.entity.name], node.value.left.raw, {
                table: true,
                as: true,
                cast: false,
                ...this.createDefaultOptions()
            });
            if (testIsDate) {
                this.addToWhere(`${columnName ? columnName : `${doubleQuotesString(node.value.left.raw)}`}${testIsDate}`, context);
                return true;
            }
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
        console.log(log.debug_head("addToWhere"));

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
        if (!this.VisitDateType(node, context)) {
            this.Visit(node.value.left, context);
            this.addExpressionToWhere(node, context);
            this.Visit(node.value.right, context);
        }
    }
    protected VisitGreaterOrEqualsExpression(node: Token, context: IodataContext) {
        context.sign = ">=";
        if (!this.VisitDateType(node, context)) {
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
        console.log(log.debug_head("createComplexWhere"));

        if (context.target) {
            if (!models.getEntity(this.ctx.service, entity)) return;
            const tempEntity = models.getEntity(this.ctx.service, node.value.name);
            if (tempEntity) {
                const relation = relationInfos(this.ctx.service, entity, node.value.name);
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
                    this.query[context.target].add(doubleQuotesString(relation.column));
                }
            }
        }
    }

    protected VisitODataIdentifier(node: Token, context: IodataContext) {
        const alias = this.getColumn(node.value.name, "", context);
        node.value.name = alias ? alias : node.value.name;
        if (context.relation && context.identifier && models.isColumnType(this.ctx.service, this.ctx.model[context.relation], this.cleanColumn(context.identifier), "json")) {
            context.identifier = `${doubleQuotesString(this.cleanColumn(context.identifier))}->>${simpleQuotesString(node.raw)}`;
        } else {
            if (context.target === EQuery.Where && this.entity) this.createComplexWhere(context.identifier ? this.cleanColumn(context.identifier) : this.entity.name, node, context);
            if (!context.relation && !context.identifier && alias && context.target) {
                // @ts-ignore
                this.query[context.target].add(alias);
            } else {
                context.identifier = node.value.name;
                if (this.entity && context.target && !context.key) {
                    let alias = this.getColumnNameOrAlias(this.entity, node.value.name, this.createDefaultOptions());
                    alias = context.target === EQuery.Where ? alias?.split(" AS ")[0] : EQuery.OrderBy ? doubleQuotesString(node.value.name) : alias;
                    // @ts-ignore
                    this.query[context.target].add(
                        node.value.name.includes("->>") || node.value.name.includes("->") || node.value.name.includes("::")
                            ? node.value.name
                            : this.entity && this.ctx.model[this.entity.name]
                            ? alias
                                ? alias
                                : node.value.name
                            : doubleQuotesString(node.value.name)
                    );
                }
            }
        }
    }

    protected VisitEqualsExpression(node: Token, context: IodataContext): void {
        context.sign = "=";
        if (!this.VisitDateType(node, context)) {
            this.Visit(node.value.left, context);
            this.addExpressionToWhere(node, context);
            this.Visit(node.value.right, context);
            this.query.where.replace(/= null/, "IS NULL");
        }
    }
    protected VisitNotEqualsExpression(node: Token, context: IodataContext): void {
        context.sign = "<>";
        if (!this.VisitDateType(node, context)) {
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
            const relation = relationInfos(this.ctx.service, this.entity.name, context.relation);
            this.addToWhere(
                ` ${context.in && context.in === true ? "" : " IN @START@"}(SELECT ${
                    this.entity.relations[context.relation] ? doubleQuotesString(relation.rightKey) : `${doubleQuotesString(context.table)}."id"`
                } FROM ${doubleQuotesString(context.table)} WHERE `,
                context
            );
            context.in = true;
            if (context.identifier) {
                if (context.identifier.startsWith("CASE") || context.identifier.startsWith("("))
                    this.addToWhere(`${context.identifier} ${context.sign} ${SQLLiteral.convert(node.value, node.raw)})`, context);
                else if (context.identifier.includes("@EXPRESSION@")) {
                    const tempEntity = models.getEntity(this.ctx.service, context.relation);
                    const alias = tempEntity ? this.getColumnNameOrAlias(tempEntity, context.identifier, this.createDefaultOptions()) : undefined;
                    this.addToWhere(
                        context.sql
                            ? `${context.sql} ${context.target} ${doubleQuotesString(context.identifier)}))@END@`
                            : `${alias ? alias : `${context.identifier.replace("@EXPRESSION@", ` ${SQLLiteral.convert(node.value, node.raw)} ${this.inverseSign(context.sign)}`)}`})`,
                        context
                    );
                } else {
                    const tempEntity = models.getEntity(this.ctx.service, context.relation);
                    const quotes = context.identifier[0] === '"' ? "" : '"';
                    const alias = tempEntity ? this.getColumnNameOrAlias(tempEntity, context.identifier, this.createDefaultOptions()) : undefined;
                    this.addToWhere(
                        context.sql
                            ? `${context.sql} ${context.target} ${doubleQuotesString(context.identifier)} ${context.sign} ${SQLLiteral.convert(node.value, node.raw)}))@END@`
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
                    const tempEntity = models.getEntity(this.ctx.service, temp[0]);
                    if (tempEntity) return temp[1];
                }
            } else if (entity && entity.columns.hasOwnProperty(column)) return column;
            else if (entity && entity.relations.hasOwnProperty(EConstant.encoding)) return EConstant.encoding;
        };
        const columnOrData = (index: number, operation: string, ForceString: boolean): string => {
            // convert into string
            const test = decodeURIComponent(Literal.convert(params[index].value, params[index].raw));
            // if (FeatureOfInterest/feature)
            if (this.entity && test.includes("/")) {
                const tests = test.split("/");
                const relation = relationInfos(this.ctx.service, this.entity.name, tests[0]);
                if (relation && relation.entity) {
                    const relationEntity = models.getEntity(this.ctx.service, tests[0]);
                    if (relationEntity) this.subQuery.from.push(relationEntity.table);
                    this.query.where.add(`${formatPgTableColumn(relation.entity.table, relation.leftKey)} = "src"."id"`);
                    return formatPgTableColumn(tests[0], tests[1]);
                }
            }
            if (test === "result") return this.formatColumnResult(context, operation, ForceString);
            const column = isColumn(test);
            return column ? doubleQuotesString(column) : simpleQuotesString(geoColumnOrData(index, false));
        };
        const geoColumnOrData = (index: number, srid: boolean): string => {
            const temp = decodeURIComponent(Literal.convert(params[index].value, params[index].raw)).replace("geography", "");
            return this.entity && this.entity.columns[temp] ? temp : `${srid === true ? "SRID=4326;" : ""}${removeAllQuotes(temp)}`;
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
