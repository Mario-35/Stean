/**
 * pgVisitor for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- pgVisitor for odata -----------------------------------!");

import { IodataContext, IvisitRessource, koaContext } from "../../../types";
import { Token } from "../../parser/lexer";
import { SqlOptions } from "../../parser/sqlOptions";
import { postSqlFromPgVisitor } from "../helper";
import { EColumnType, EExtensions, EHttpCode } from "../../../enums";
import { log } from "../../../log";
import { _COLUMNSEPARATOR } from "../../../constants";
import { PgVisitor } from "../.";
import { doubleQuotesString } from "../../../helpers";
import { models } from "../../../models";
import { errors } from "../../../messages";

export class RootPgVisitor extends PgVisitor {
  static root = true;
  constructor(ctx: koaContext, options = <SqlOptions>{}, node?: Token) {
      console.log(log.whereIam());
      super(ctx, options);      
      if (node) this.StartVisitRessources(node);
  }

  protected verifyRessources = (): void => {
    console.log(log.debug_head("verifyRessources"));
  };

  protected VisitRessources(node: Token, context?: IodataContext) {    
    const ressource: IvisitRessource = this[`VisitRessources${node.type}` as keyof object];
    if (ressource) {
      ressource.call(this, node, context);
      if (this.debugOdata) {
        console.log(log.debug_infos("VisitRessources",`VisitRessources${node.type}`));
        console.log(log.debug_infos("node.raw", node.raw));
      }
    } else {
      log.error(`Ressource Not Found ============> VisitRessources${node.type}`);
      throw new Error(`Unhandled node type: ${node.type}`);
    }
    return this;
  }

  protected VisitRessourcesResourcePath(node: Token, context?: IodataContext) {
    if (node.value.resource)
      this.VisitRessources(node.value.resource, context);
    if (node.value.navigation)
      this.VisitRessources(node.value.navigation, context);
  }
  
  protected VisitRessourcesEntitySetName(node: Token, _context: IodataContext) {
    this.entity = node.value.name;
  }
 
  protected VisitRessourcesRefExpression(node: Token, _context: IodataContext) {
    if (node.type == "RefExpression" && node.raw == "/$ref")
      this.onlyRef = true;
  }
 
  protected VisitRessourcesValueExpression(node: Token, _context: IodataContext) {
    if (node.type == "ValueExpression" && node.raw == "/$value")
      this.onlyValue = true;
  }
 
  protected VisitRessourcesCollectionNavigation(node: Token, context: IodataContext) {
    if (node.value.path) this.VisitRessources(node.value.path, context);
  }
 
  protected VisitRessourcesCollectionNavigationPath(node: Token, context: IodataContext) {
    if (node.value.predicate)
      this.VisitRessources(node.value.predicate, context);
    if (node.value.navigation)
      this.VisitRessources(node.value.navigation, context);
  }
 
  protected VisitRessourcesSimpleKey(node: Token, context: IodataContext) {
    if (node.value.value.type === "KeyPropertyValue") {
      this.single = true;
      this.VisitRessources(node.value.value, context);
    }
  }
 
  protected VisitRessourcesKeyPropertyValue(node: Token, _context: IodataContext) {
    this.id = this.ctx.decodedUrl.idStr
                ? this.ctx.decodedUrl.idStr
                  : node.value == "Edm.SByte"
                      ? BigInt(node.raw)
                      : node.raw; 
                      this.query.where.notNull     
    const condition = this.ctx.decodedUrl.idStr ? `"lora"."deveui" = '${this.ctx.decodedUrl.idStr}'` : ` id = ${this.id}`;
    if (this.query.where.notNull() === true)  this.query.where.add(` AND ${condition}`); else this.query.where.init(condition);
  }

  protected VisitRessourcesSingleNavigation(node: Token, context: IodataContext) {
    if (node.value.path && node.value.path.type === "PropertyPath")
      this.VisitRessources(node.value.path, context);
  }
 

  protected VisitRessourcesPropertyPathNew(node:Token, context:any) {
    if (node.type == "PropertyPath") {
      if (models.getRelationColumnTable(this.ctx.config, this.entity, node.value.path.raw) === EColumnType.Relation) {
        this.parentId = this.id;
        this.id = BigInt(0);
        if ( node.value.navigation && node.value.navigation.type == "CollectionNavigation" ) {
          this.VisitRessources(node.value.navigation, context);
        }
      } else if (this.ctx.model[this.entity].columns[node.value.path.raw]) {
        this.query.select.add(`${doubleQuotesString(node.value.path.raw )}${_COLUMNSEPARATOR}`);
        this.showRelations = false;
      } else this.entity = node.value.path.raw;
    }
		this.VisitRessources(node.value.navigation, context);
	}

  protected VisitRessourcesEntityCollectionNavigationProperty(node:Token, context:any){
          // if(this.parentEntity) {
      //   const temp = this.query.toWhere(this);
      //   const tmpLink = this.ctx.model[this.entity].relations[node.value.name].link
      //   .split("$ID")
      //   .join(<string>`(SELECT ID FROM (${temp}) as g)`);
      //   this.query.where.init(tmpLink);
      //   const tempEntity =  models.getEntity(this.ctx.config, node.value.name);
      //   if (tempEntity) {
      //     this.swapEntity(tempEntity.name);
      //     this.single = tempEntity.singular === node.value.name || BigInt(this.id) > 0  ? true : false;
      //   }

    if (this.ctx.model[this.entity].relations[node.value.name]) {
         const where = (this.parentEntity) ? `(SELECT ID FROM (${this.query.toWhere(this)}) as nop)` : this.id;
        const whereSql = this.ctx.model[this.entity].relations[node.value.name].link
        .split("$ID")
        .join(<string>where);
        this.query.where.init(whereSql);
        const tempEntity =  models.getEntity(this.ctx.config, node.value.name);
        if (tempEntity) {
          this.swapEntity(tempEntity.name);
          this.single = tempEntity.singular === node.value.name || BigInt(this.id) > 0  ? true : false;
        }
    } else if (this.ctx.model[this.entity].columns[node.value.name]) {
      this.query.select.add(`${doubleQuotesString(node.value.name)}${_COLUMNSEPARATOR}`);
      this.showRelations = false;
    } else this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: errors.notValid });
	}
  
  protected VisitRessourcesPropertyPath(node: Token, context: IodataContext) {
		if (node.value.path)
		  this.VisitRessources(node.value.path, context);
		if (node.value.navigation)
      this.VisitRessources(node.value.navigation, context);
  }

  protected VisitRessourcesODataUri(node: Token, context: IodataContext) {
    this.VisitRessources(node.value.resource, context);
    this.VisitRessources(node.value.query, context);
  }

  StartVisitRessources(node: Token) {
    console.log(log.debug_head("INIT PgVisitor"));
    this.limit = this.ctx.config.nb_page || 200;
    this.numeric = this.ctx.config.extensions.includes(EExtensions.resultNumeric);
    const temp = this.VisitRessources(node);
    this.verifyRessources();
    return temp;
  }

  getSql(): string {  
    if (this.includes) this.includes.forEach((include) => {
      if (include.navigationProperty.includes("/")) {              
        const names = include.navigationProperty.split("/");
        include.navigationProperty = names[0];
        const visitor = new PgVisitor(this.ctx, {...this.options});
        if (visitor) {
          visitor.entity =names[0];
          visitor.navigationProperty = names[1];
          if (include.includes) include.includes.push(visitor); else include.includes = [visitor];
        }            
      }
    });
    return this.onlyValue ? this.toString() : this.returnFormat.generateSql(this);
  }

  patchSql(datas: object): string | undefined {
    try {
      return postSqlFromPgVisitor(datas, this);
    } catch (error) {
      return undefined;
    }
  }

  postSql(datas: object): string | undefined {
    try {
      return postSqlFromPgVisitor(datas, this);
    } catch (error) {
      return undefined;
    }
  }

}