/**
 * pgVisitor for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- pgVisitor for odata -----------------------------------!");

import { doubleQuotesString, simpleQuotesString, isGraph, isObservation, isTest, removeAllQuotes, returnFormats } from "../../../helpers";
import { IodataContext, IKeyString, Ientity, IKeyBoolean, IpgQuery, koaContext, IvisitRessource } from "../../../types";
import { Token } from "../../parser/lexer";
import { Literal } from "../../parser/literal";
import { SQLLiteral } from "../../parser/sqlLiteral";
import { SqlOptions } from "../../parser/sqlOptions";
import { oDataDateFormat } from "../helper";
import { errors, msg } from "../../../messages";
import { EColumnType, EQuery } from "../../../enums";
import { models } from "../../../models";
import { log } from "../../../log";
import { _COLUMNSEPARATOR, _DEBUG } from "../../../constants";
import { Visitor } from "./visitor";
import { _ID, _NAVLINK } from "../../../db/constants";
import { Query } from "../builder";

export class PgVisitor extends Visitor {
  public entity = "";
  navigation : [{
    entity: string | undefined;  
    query: string | undefined;  
    id: bigint | string;
  }] | undefined = undefined;  
  // parent entity
  parentEntity: string | undefined = undefined;  
  id: bigint | string = BigInt(0);
  parentId: bigint | string = BigInt(0);
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
  results: IKeyString = {};
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

  swapEntity(name: string, id ?:bigint | string) {
    this.parentEntity = this.entity;
    this.entity = name;
    this.parentId = this.id ;
    this.id = id ? id : BigInt(0);

  }
testo(input: string) {
  console.log(`******************* ${input} ********************`);
  console.log(`entity  =====> ${this.entity}  id : [${this.id}]`);
  console.log(`parent  =====> ${this.parentEntity}  id : [${this.parentId}]`);
  console.log("***************************************");
  
}

  addToIntervalColumns(input: string) {
    // TODO test with create    
    if (input.endsWith('Time"')) input = `step AS ${input}`;
      else if (input === doubleQuotesString(_ID)) input = `coalesce(${doubleQuotesString(_ID)}, 0) AS ${doubleQuotesString(_ID)}`;
        else if (input.startsWith("CONCAT")) input = `${input}`;
          else if (input[0] !== "'") input = `${input}`;
    if (this.intervalColumns) this.intervalColumns.push(input); 
      else this.intervalColumns = [input];
  }

  protected getColumn(input: string, operation: string ,context: IodataContext ) {   
    console.log(log.whereIam(input));
    const tempEntity = 
      context.target ===  EQuery.Where && context.identifier
        ? models.getEntity(this.ctx.config, context.identifier.split(".")[0])
        : this.isSelect(context) 
          ? models.getEntity(this.ctx.config, this.entity || this.parentEntity || this.navigationProperty) 
          : undefined;
          
    const columnName = input === "result" 
                        ? this.formatColumnResult(context, operation) 
                        : tempEntity 
                          ? this.getColumnNameOrAlias(tempEntity, input, this.createDefaultOptions()) 
                          : undefined;

    if (columnName) return columnName;
    if (this.isSelect(context) && tempEntity && tempEntity.relations[input]) {
      const entityName = models.getEntityName(this.ctx.config ,input);       
      return tempEntity && entityName 
        ? `CONCAT('${this.ctx.decodedUrl.root}/${tempEntity.name}(', "${tempEntity.table}"."id", ')/${entityName}') AS "${entityName}${_NAVLINK}"` 
        : undefined;    
    }   
  }



  // ***********************************************************************************************************************************************************************
  // ***                                                              QUERY                                                                                              ***
  // ***********************************************************************************************************************************************************************

  formatColumnResult(context: IodataContext, operation: string, ForceString?: boolean) {
    switch (context.target) {
      case EQuery.Where:
        const nbs = Array.from({length: 5}, (v, k) => k+1);
        const translate = `TRANSLATE (SUBSTRING ("result"->>'value' FROM '(([0-9]+.*)*[0-9]+)'), '[]','')`;
        const isOperation = operation.trim() != "";
        return ForceString 
          ? `@EXPRESSIONSTRING@ ALL (ARRAY_REMOVE( ARRAY[\n${nbs.map(e => `${isOperation ? `${operation} (` : ''} SPLIT_PART ( ${translate}, ',', ${e}))`).join(",\n")}], null))`
          : `@EXPRESSION@ ALL (ARRAY_REMOVE( ARRAY[\n${nbs.map(e => `${isOperation ? `${operation} (` : ''}NULLIF (SPLIT_PART ( ${translate}, ',', ${e}),'')::numeric${isOperation ? `)` : ''}`).join(",\n")}], null))`;
    default:
      return `CASE 
          WHEN JSONB_TYPEOF( "result"->'value') = 'number' THEN ("result"->${this.numeric == true? '>': ''}'value')::jsonb
          WHEN JSONB_TYPEOF( "result"->'value') = 'array'  THEN ("result"->'${this.valueskeys == true ? 'valueskeys' : 'value'}')::jsonb
      END${this.isSelect(context) === true ? ' AS "result"' : ''}`;
  }
}

  getColumnNameOrAlias(entity: Ientity, column : string, options: IKeyBoolean): string | undefined {
    let result: string | undefined | void = undefined;
    if (entity && column != "" && entity.columns[column]) {
      result = entity.columns[column].alias(this.ctx.config, options);
      if (!result) result = doubleQuotesString(column);
    }
    return result ? `${ options.table === true && result && result[0] === '"' ? `"${entity.table}".${result}` : result }` : undefined;
  }; 

  clear(input: string) {    
    if (input.includes('@START@')) {
      input = input.split('@START@').join("(");
      input = input.split('@END@').join('') +')';      
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
    if (this.includes) this.includes.forEach((element: PgVisitor) => {
      if (element.ast.type === "ExpandItem")
        expands.push(element.ast.raw.split("(")[0]);
    });

    expands.forEach((elem: string) => {
      const elems = elem.split("/");
      elems.unshift(this.entity);
      if (elems[0]) {
        if (!Object.keys(this.ctx.model[elems[0]].relations).includes(elems[1]))
          this.ctx.throw(400, {
            detail: `Invalid expand path ${elems[1]} for ${elems[0]}`,
          });
      } else this.ctx.throw(400, { detail: msg(errors.invalid, "entity") + elems[0] });
    });

    if (isObservation(this.entity) === true && this.splitResult !== undefined && Number(this.parentId) == 0 ) {
      this.ctx.throw(400, { detail: errors.splitNotAllowed });
    }

    if (this.returnFormat === returnFormats.dataArray && BigInt(this.id) > 0 && !this.parentEntity) {
      this.ctx.throw(400, { detail: errors.dataArrayNotAllowed });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Visit(node: Token, context?: IodataContext) {
    this.ast = this.ast || node;
    context = context || { target: EQuery.Where, key: undefined, entity: undefined, table: undefined, identifier: undefined, identifierType: undefined, relation: undefined, literal: undefined, sign: undefined, sql: undefined, in: undefined }
    if (node) {
      const visitor: IvisitRessource = this[`Visit${node.type}` as keyof object];
      if (visitor) {
      visitor.call(this, node, context);
        if (this.debugOdata) {
          console.log(log._infos("Visit",`Visit${node.type}`, ));
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
      if (this.entity.startsWith("Lora")) {
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
      let visitor = this.includes ?  this.includes.filter( (v) => v.navigationProperty == expandPath )[0] : undefined;
      if (!visitor) {
        visitor = new PgVisitor(this.ctx, { ...this.options });
        this.includes ? this.includes.push(visitor) : this.includes = [visitor];
      }
      visitor.Visit(item, context);
    });
  }

  protected VisitEntity(node: Token, context: IodataContext) {
    this.Visit(node.value.path, context);
    if (node.value.options)
      node.value.options.forEach((item: Token) => this.Visit(item, context));
  }

  protected VisitSplitResult(node: Token, context: IodataContext) {
    this.Visit(node.value.path, context);    
    if (node.value.options)
      node.value.options.forEach((item: Token) => this.Visit(item, context));
    this.splitResult = removeAllQuotes(node.value).split(",");
  }

  protected VisitInterval(node: Token, context: IodataContext) {
    this.Visit(node.value.path, context);
    if (node.value.options)
      node.value.options.forEach((item: Token) => this.Visit(item, context));
    this.interval = node.value;
    if (this.interval) this.noLimit();
  }

  protected VisitPayload(node: Token, context: IodataContext) {
    this.Visit(node.value.path, context);
    if (node.value.options)
      node.value.options.forEach((item: Token) => this.Visit(item, context));
    this.payload = node.value;
  }

  protected VisitDebug(node: Token, context: IodataContext) {
    this.Visit(node.value.path, context);
    if (node.value.options)
      node.value.options.forEach((item: Token) => this.Visit(item, context));
  }
 
  protected VisitResultFormat(node: Token, context: IodataContext) {
    if (node.value.format) 
      this.returnFormat = returnFormats[node.value.format as keyof object];
    if ( [ returnFormats.dataArray, returnFormats.graph, returnFormats.graphDatas, returnFormats.csv ].includes(this.returnFormat) ) 
      this.noLimit();
      this.showRelations = false;
    if (isGraph(this)) { 
      this.showRelations = false;
    }
  }

  protected VisitExpandItem(node: Token, context: IodataContext) {
    this.Visit(node.value.path, context);
    if (node.value.options)
      node.value.options.forEach((item: Token) => this.Visit(item, context));
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
    if (this.query.where.toString().trim() != "") this.query.where.add(" AND ");
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
    context.identifier = tempColumn ? tempColumn : node.raw;
    if (context.target)
      // @ts-ignore
      (this.query[context.target as keyof object] as Query).add(tempColumn ? `${tempColumn}${_COLUMNSEPARATOR}` : `${doubleQuotesString(node.raw)}${_COLUMNSEPARATOR}`); 
      this.showRelations = false;
  }

  protected VisitAndExpression(node: Token, context: IodataContext) {
    this.Visit(node.value.left, context);
    this.query.where.add(context.in && context.in === true ? " INTERSECT " : " AND ");
    this.Visit(node.value.right, context);
  }

  protected VisitOrExpression(node: Token, context: IodataContext) {
    this.Visit(node.value.left, context);
    this.query.where.add(" OR ");
    this.Visit(node.value.right, context);
  }

  protected VisitNotExpression(node: Token, context: IodataContext) {
    this.query.where.add(" NOT ");
    this.Visit(node.value, context);
  }

  protected VisitBoolParenExpression(node: Token, context: IodataContext) {
    this.query.where.add("(");
    this.Visit(node.value, context);
    this.query.where.add(")");
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
      if (models.getRelationColumnTable(this.ctx.config, this.ctx.model[this.entity], node.value.current.raw) === EColumnType.Column
            && models.isColumnType(this.ctx.config, this.ctx.model[this.entity], node.value.current.raw, "json") 
            && node.value.next.raw[0] == "/" ) {
              this.query.where.add(`${doubleQuotesString(node.value.current.raw)}->>${simpleQuotesString(node.value.next.raw.slice(1))}`);
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

  protected VisitDateType(node: Token, context: IodataContext):boolean {  
    if (context.sign && models.getRelationColumnTable(this.ctx.config, this.ctx.model[this.entity], node.value.left.raw) === EColumnType.Column && models.isColumnType(this.ctx.config, this.ctx.model[this.entity], node.value.left.raw, "date")) {
      const testIsDate = oDataDateFormat(node, context.sign);
      const columnName = this.getColumnNameOrAlias(this.ctx.model[context.identifier || this.entity], node.value.left.raw, {table: true, as: true, cast: false, ...this.createDefaultOptions()});
      if (testIsDate) {
        this.query.where.add(`${columnName 
                          ? columnName 
                          : `${doubleQuotesString(node.value.left.raw)}`}${testIsDate}`);
        return true;
      }
    }
    return false;
  }

  inverseSign(input: string | undefined) {
    if (input) switch (input) {
      case ">": return "<";    
      case ">=": return "<=";
      case "<": return ">";    
      case "<=": return ">=";    
      default:
        return input;
    }
  }
  protected addExpressionToWhere(node: Token, context: IodataContext) {
    if (this.query.where.toString().includes("@EXPRESSION@") ) 
      this.query.where.replace("@EXPRESSION@",`@EXPRESSION@ ${this.inverseSign(context.sign)}`);
      else if (!this.query.where.toString().includes("@EXPRESSIONSTRING@") && this.inverseSign(context.sign)) 
      // Important to keep space
        this.query.where.add(" " + context.sign);
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

  public createDefaultOptions(): IKeyBoolean {
    return {
      valueskeys: this.valueskeys,
      numeric: this.numeric
    };
  }

  public createComplexWhere(entity: string, node: Token, context: IodataContext) {
    if (context.target) {
      const tempEntity = models.getEntity(this.ctx.config, entity);
      if (!tempEntity) return;
      const colType = models.getRelationColumnTable(this.ctx.config, tempEntity, node.value.name);
      if (colType === EColumnType.Column) {
        if (context.relation) {
          if ( Object.keys(tempEntity.relations).includes(context.relation) ) {
            if (!context.key) {
              context.key = tempEntity.relations[context.relation].entityColumn; 
      // @ts-ignore

              this.query[context.target].add(context.key);
              // this[context.target] += doubleQuotesString(context.key);
            }
          }
        }
      } else if (colType === EColumnType.Relation) {
        const tempEntity = models.getEntity(this.ctx.config, node.value.name);
        if (tempEntity) {
          if (context.relation) {
            context.sql = `${doubleQuotesString(this.ctx.model[entity].table)}.${doubleQuotesString(this.ctx.model[entity].relations[node.value.name].entityColumn)} IN (SELECT ${doubleQuotesString(tempEntity.table)}.${doubleQuotesString(this.ctx.model[entity].relations[node.value.name].relationKey)} FROM ${doubleQuotesString(tempEntity.table)}`;
          } else {
            context.relation = node.value.name;
            context.table = tempEntity.table;
          }
          if (!context.key && context.relation) {
            context.key = this.ctx.model[entity].relations[context.relation].entityColumn; 
      // @ts-ignore

            this.query[context.target].add(doubleQuotesString(this.ctx.model[entity].relations[context.relation].entityColumn));
          }
          return;
        }
      }
    }
  }

  protected VisitODataIdentifier(node: Token, context: IodataContext) {    
    const alias = this.getColumn(node.value.name, "", context);
    node.value.name = alias ? alias : node.value.name;
    if (context.relation && context.identifier && models.isColumnType(this.ctx.config, this.ctx.model[context.relation], removeAllQuotes(context.identifier).split(".")[0], "json")) {
      context.identifier = `${doubleQuotesString(context.identifier.split(".")[0])}->>${simpleQuotesString(node.raw)}`;     
    } else {
      if (context.target ===  EQuery.Where) this.createComplexWhere(context.identifier ? context.identifier.split(".")[0] : this.entity, node, context);
      if (!context.relation && !context.identifier && alias && context.target) {
        // @ts-ignore
        this.query[context.target].add(alias);  
      } else {
        context.identifier = node.value.name;
        if (context.target && !context.key) {
          let alias = this.getColumnNameOrAlias(this.ctx.model[this.entity], node.value.name, this.createDefaultOptions());
          alias = context.target ===  EQuery.Where ? alias?.split(" AS ")[0]: EQuery.OrderBy ? doubleQuotesString(node.value.name ) : alias;
          // @ts-ignore
          this.query[context.target].add(node.value.name.includes("->>") ||node.value.name.includes("->") || node.value.name.includes("::")
            ? node.value.name
            : this.entity && this.ctx.model[this.entity] 
              ? alias 
                ? alias 
                : ''
              : doubleQuotesString(node.value.name));
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
    if (context.relation && context.table && context.target === EQuery.Where) {
      const temp = this.query.where.toString().split(" ").filter(e => e != "");      
      context.sign = temp.pop(); 
      this.query.where.init(temp.join(" "));
      this.query.where.add(` ${context.in && context.in === true ? '' : ' IN @START@'}(SELECT ${this.ctx.model[this.entity].relations[context.relation] ? doubleQuotesString(this.ctx.model[this.entity].relations[context.relation]["relationKey"]) : `${doubleQuotesString(context.table)}."id"`} FROM ${doubleQuotesString(context.table)} WHERE `);
      context.in = true;
      if (context.identifier) {
        if (context.identifier.startsWith("CASE") || context.identifier.startsWith("("))
          this.query.where.add(`${context.identifier} ${context.sign} ${SQLLiteral.convert(node.value, node.raw)})`);
        else if (context.identifier.includes("@EXPRESSION@")) {
            const tempEntity = models.getEntity(this.ctx.config, context.relation);    
            const alias = tempEntity ? this.getColumnNameOrAlias(tempEntity, context.identifier , this.createDefaultOptions()) : undefined;
            this.query.where.add((context.sql)
              ? `${context.sql} ${context.target} ${doubleQuotesString(context.identifier)}))@END@`
              : `${alias ? alias : `${ context.identifier.replace("@EXPRESSION@", ` ${SQLLiteral.convert(node.value, node.raw)} ${this.inverseSign(context.sign)}`) }`})`);
        } else {
          const tempEntity = models.getEntity(this.ctx.config, context.relation);    

          const quotes = context.identifier[0] === '"' ? '' : '"';
          const alias = tempEntity ? this.getColumnNameOrAlias(tempEntity, context.identifier , this.createDefaultOptions()) : undefined;


          this.query.where.add((context.sql)
            ? `${context.sql} ${context.target} ${doubleQuotesString(context.identifier)} ${context.sign} ${SQLLiteral.convert(node.value, node.raw)}))@END@`
            : `${alias ? '' : `${context.table}.`}${alias ? alias : `${quotes}${ context.identifier }${quotes}`} ${context.sign} ${SQLLiteral.convert(node.value, node.raw)})`);
        }
      }
    } else {
      const temp = context.literal = node.value == "Edm.Boolean" ? node.raw : SQLLiteral.convert(node.value, node.raw);
      if (this.query.where.toString().includes("@EXPRESSION@")) this.query.where.replace("@EXPRESSION@", temp); 
      else if (this.query.where.toString().includes("@EXPRESSIONSTRING@")) this.query.where.replace("@EXPRESSIONSTRING@", `${temp} ${this.inverseSign(context.sign)}`);       
      else this.query.where.add(temp);
      
    }
  }

  protected VisitInExpression(node: Token, context: IodataContext): void {
    this.Visit(node.value.left, context);
    this.query.where.add(" IN (");
    this.Visit(node.value.right, context);
    this.query.where.add(":list)");
  }

  protected VisitArrayOrObject(node: Token, context: IodataContext): void {
    this.query.where.add(context.literal = SQLLiteral.convert(node.value, node.raw));
  }

  protected createGeoColumn(entity: string | Ientity, column: string): string {    
    column = removeAllQuotes(column);
    let test: string | undefined = undefined;
    const tempEntity: Ientity = (typeof entity === "string") ? this.ctx.model[entity] : entity ;
    if (column.includes("/")) {
      const temp = column.split("/");
      if (tempEntity.relations.hasOwnProperty(temp[0])) {
        const rel = tempEntity.relations[temp[0]];
        column = `(SELECT ${doubleQuotesString(temp[1])} FROM ${doubleQuotesString(rel.tableName)} WHERE ${rel.expand} AND length(${doubleQuotesString(temp[1])}::text) > 2)`;
        test = this.ctx.model[rel.entityName].columns[temp[1]].test;
        if (test)  test = `(SELECT ${doubleQuotesString(test)} FROM ${doubleQuotesString(rel.tableName)} WHERE ${rel.expand})`;
      }
    } else if (!tempEntity.columns.hasOwnProperty(column)) {
      if (tempEntity.relations.hasOwnProperty(column)) {
        const rel = tempEntity.relations[column];
        column = `(SELECT ${doubleQuotesString(rel.entityColumn)} FROM ${doubleQuotesString(rel.tableName)} WHERE ${rel.expand} AND length(${doubleQuotesString(rel.entityColumn)}::text) > 2)`;
        test = this.ctx.model[rel.entityName].columns[rel.entityColumn].test;
      } else throw new Error(`Invalid column ${column}`);
    } else {      
      // TODO ADD doubleQuotesString
      const temp = tempEntity.columns[column].test;
      if (temp) test = doubleQuotesString(temp);
      column = doubleQuotesString(column);
    }
    if (test)
      column = `CASE WHEN ${test} LIKE '%geo+json' THEN ST_GeomFromEWKT(ST_GeomFromGeoJSON(coalesce(${column}->'geometry',${column}))) ELSE ST_GeomFromEWKT(${column}::text) END`;
    return column;
  }
  
  protected VisitMethodCallExpression(node: Token, context: IodataContext) {
    const method = node.value.method;
    const params = node.value.parameters || [];

    const isColumn = (input: number | string): string | undefined => {
      const entity: Ientity = this.ctx.model[this.entity];
      const column = typeof input === "string" ? input : decodeURIComponent( Literal.convert(params[input].value, params[input].raw) );

      if (column.includes("/")) {
        const temp = column.split("/");
        if (entity.relations.hasOwnProperty(temp[0])) 
          return this.ctx.model[entity.relations[temp[0]].entityName].columns[temp[1]].test;
      } 
      else if (entity.columns.hasOwnProperty(column)) 
        return column;
      else if (entity.relations.hasOwnProperty(column)) 
        return this.ctx.model[entity.relations[column].entityName].columns[entity.relations[column].entityColumn].test;
    }

    const columnOrData = (index: number, operation: string, ForceString: boolean): string => {
      const test = decodeURIComponent( Literal.convert(params[index].value, params[index].raw) );
      if (test === "result") return this.formatColumnResult(context, operation, ForceString);
      const column = isColumn(test);       
      return column ? doubleQuotesString(column) : simpleQuotesString(geoColumnOrData(index, false));
    };

    const geoColumnOrData = (index: number, srid: boolean): string => {
      const temp = decodeURIComponent(
        Literal.convert(params[index].value, params[index].raw)
     ).replace("geography", "");
      return this.ctx.model[this.entity].columns[temp]
        ? temp
        : `${srid === true ? "SRID=4326;" : ""}${removeAllQuotes(temp)}`;
    };

    const cleanData = (index: number): string =>
      params[index].value == "Edm.String"
        ? removeAllQuotes(Literal.convert(params[index].value, params[index].raw))
        : Literal.convert(params[index].value, params[index].raw);

    const order = params.length === 2 ? isColumn(0) ? [0,1] : [1,0] : [0];
    switch (method) {
      case "contains":
        this.Visit(params[0], context);
        this.query.where.add(` ~* '${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}'`);
        break;
      case "containsAny":
        this.query.where.add("array_to_string(");
        this.Visit(params[0], context);
        this.query.where.add(`, ' ') ~* '${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}'`);
        break;
      case "endswith":
        this.query.where.add(`${columnOrData(0, "", true)}  ILIKE '%${cleanData(1)}'`);
        break;
      case "startswith":
        this.query.where.add(`${columnOrData(0, "", true)} ILIKE '${cleanData(1)}%'`);
        break;
      case "substring":
        this.query.where.add((params.length == 3) 
            ? ` SUBSTR(${columnOrData(0, "", true)}, ${cleanData( 1 )} + 1, ${cleanData(2)})`
            : ` SUBSTR(${columnOrData(0, "", true)}, ${cleanData(1)} + 1)`);
        break;
      case "substringof":
        this.query.where.add(`${columnOrData(0, "", true)} ILIKE '%${cleanData(1)}%'`);
        break;
      case "indexof":
        this.query.where.add(` POSITION('${cleanData(1)}' IN ${columnOrData(0, "", true)})`);
        break;
      case "concat":
        this.query.where.add(`(${columnOrData(0, "concat", true)} || '${cleanData(1)}')`);
        break;
      case "length":
        // possibilty calc length string of each result or result 
        this.query.where.add((decodeURIComponent( Literal.convert(params[0].value, params[0].raw) ) === "result") 
        ? `${columnOrData(0, "CHAR_LENGTH", true)}`
        :  `CHAR_LENGTH(${columnOrData(0, "CHAR_LENGTH", true)})`);
        break;
      case "tolower":
        this.query.where.add(`LOWER(${columnOrData(0, "", true)})`);
        break;
      case "toupper":
        this.query.where.add(`UPPER(${columnOrData(0, "", true)})`);
        break;
      case "year":
      case "month":
      case "day":
      case "hour":
      case "minute":
      case "second":
        this.query.where.add(`EXTRACT(${method.toUpperCase()} FROM ${columnOrData( 0, "", false )})`);
        break;
      case "round":
      case "floor":
      case "ceiling":
        this.query.where.add(columnOrData(0, method.toUpperCase(),false));
        break;
      case "now":
        this.query.where.add("NOW()");
        break;
      case "date":
        this.query.where.add(`${method.toUpperCase()}(`);
        this.Visit(params[0], context);
        this.query.where.add(")");
        break;
      case "time":
        this.query.where.add(`(${columnOrData(0, "", true)})::time`);
        break;
      case "geo.distance":
      case "geo.contains":
      case "geo.crosses":
      case "geo.disjoint":
      case "geo.equals":
      case "geo.overlaps":
      case "geo.relate":
      case "geo.touches":
      case "geo.within":
        this.query.where.add(`${method .toUpperCase() .replace("GEO.", "ST_")}(${this.createGeoColumn(this.entity, columnOrData(order[0], "", true) )}), ${columnOrData(order[1], "", true)}')`);
        break;
      case "geo.length":
        this.query.where.add(`ST_Length(ST_MakeLine(ST_AsText(${this.createGeoColumn(this.entity, columnOrData(order[0], "", true) )}), ${columnOrData(order[1], "", true)}'))`);
        break;
      case "geo.intersects":        
        this.query.where.add(`st_intersects(ST_AsText(${this.createGeoColumn(this.entity, columnOrData(order[0], "", true) )}), ${columnOrData(order[1], "", true)})`);
        break;
      case "trim":
        this.query.where.add(`TRIM(BOTH '${ params.length == 2 ? cleanData(1) : " " }' FROM ${columnOrData(0, "", true)})`);
        break;
      case "mindatetime":
        this.query.where.add(`MIN(${this.query.where.toString().split('" ')[0]}")`);
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
