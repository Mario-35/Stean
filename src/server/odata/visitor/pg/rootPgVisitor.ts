/**
 * pgVisitor for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IodataContext, IvisitRessource, koaContext } from "../../../types";
import { Token } from "../../parser/lexer";
import { SqlOptions } from "../../parser/sqlOptions";
import { postSqlFromPgVisitor } from "../helper";
import { EConstant, EExtensions, EHttpCode } from "../../../enums";
import { log } from "../../../log";
import { PgVisitor } from "../.";
import { models } from "../../../models";
import { errors } from "../../../messages";
import { link } from "../../../models/helpers";
import { doubleQuotesString } from "../../../helpers";

export class RootPgVisitor extends PgVisitor {
    static root = true;
    special: string[] = [];

    constructor(ctx: koaContext, options = <SqlOptions>{}, node: Token, special?: string[]) {
        console.log(log.whereIam());
        super(ctx, options);
        if (special) this.special = special;
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
                console.log(log.debug_infos("VisitRessources", `VisitRessources${node.type}`));
                console.log(log.debug_infos("node.raw", node.raw));
            }
        } else {
            log.error(`Ressource Not Found ============> VisitRessources${node.type}`);
            throw new Error(`Unhandled node type: ${node.type}`);
        }
        return this;
    }

    protected VisitRessourcesResourcePath(node: Token, context?: IodataContext) {
        if (node.value.resource) this.VisitRessources(node.value.resource, context);
        if (node.value.navigation) this.VisitRessources(node.value.navigation, context);
        if (this.special) {
            this.special.forEach((element: string) => {
                const nodeName = element.includes("(") ? element.split("(")[0] : element;
                const id = element.includes("(") ? String(element.split("(")[1].split(")")[0]) : undefined;
                if (this.entity && this.entity.relations[nodeName]) {
                    const where = this.parentEntity ? `(SELECT id FROM (${this.query.toWhere(this)}) as nop)${id ? `and id = ${id}` : ""}` : this.id;
                    const whereSql = link(this.ctx.service, this.entity.name, nodeName)
                        .split("$ID")
                        .join(<string>where);

                    this.query.where.init(whereSql);
                    const tempEntity = models.getEntity(this.ctx.service, nodeName);
                    if (tempEntity) {
                        this.swapEntity(tempEntity);
                        this.single = tempEntity.singular === nodeName || BigInt(this.id) > 0 ? true : false;
                    }
                } else if (this.entity && this.entity.columns[nodeName]) {
                    this.query.select.add(`${doubleQuotesString(nodeName)}${EConstant.columnSeparator}`);
                    this.showRelations = false;
                }
            });
        }
    }

    protected VisitRessourcesEntitySetName(node: Token, _context: IodataContext) {
        this.entity = models.getEntityStrict(this.ctx.service, node.value.name);
        if (!this.entity) this.ctx.throw(EHttpCode.notFound, "Not Found");
    }

    protected VisitRessourcesRefExpression(node: Token, _context: IodataContext) {
        if (node.type == "RefExpression" && node.raw == "/$ref") this.onlyRef = true;
    }

    protected VisitRessourcesValueExpression(node: Token, _context: IodataContext) {
        if (node.type == "ValueExpression" && node.raw == "/$value") this.onlyValue = true;
    }

    protected VisitRessourcesCollectionNavigation(node: Token, context: IodataContext) {
        if (node.value.path) this.VisitRessources(node.value.path, context);
    }

    protected VisitRessourcesCollectionNavigationPath(node: Token, context: IodataContext) {
        if (node.value.predicate) this.VisitRessources(node.value.predicate, context);
        if (node.value.navigation) this.VisitRessources(node.value.navigation, context);
    }

    protected VisitRessourcesSimpleKey(node: Token, context: IodataContext) {
        if (node.value.value.type === "KeyPropertyValue") {
            this.single = true;
            this.VisitRessources(node.value.value, context);
        }
    }

    protected VisitRessourcesKeyPropertyValue(node: Token, _context: IodataContext) {
        this.id = this.ctx.decodedUrl.idStr ? this.ctx.decodedUrl.idStr : node.value == "Edm.SByte" ? BigInt(node.raw) : node.raw;
        this.query.where.notNull;
        const condition = this.ctx.decodedUrl.idStr ? `"lora"."deveui" = '${this.ctx.decodedUrl.idStr}'` : ` id = ${this.id}`;
        if (this.query.where.notNull() === true) this.query.where.add(` AND ${condition}`);
        else this.query.where.init(condition);
    }

    protected VisitRessourcesSingleNavigation(node: Token, context: IodataContext) {
        if (node.value.path && node.value.path.type === "PropertyPath") this.VisitRessources(node.value.path, context);
    }

    protected VisitRessourcesEntityCollectionNavigationProperty(node: Token, context: any) {
        if (node.value.name.includes("/")) {
            node.value.name.split("/").forEach((element: string) => {
                node.value.name = element;
                this.VisitRessourcesEntityCollectionNavigationProperty(node, context);
            });
        } else if (this.entity && this.entity.relations[node.value.name]) {
            const where = this.parentEntity ? `(SELECT ID FROM (${this.query.toWhere(this)}) AS nop)` : this.id;
            const whereSql = link(this.ctx.service, this.entity.name, node.value.name)
                .split("$ID")
                .join(<string>where);

            this.query.where.init(whereSql);
            const tempEntity = models.getEntity(this.ctx.service, node.value.name);
            if (tempEntity) {
                this.swapEntity(tempEntity);
                this.single = tempEntity.singular === node.value.name || BigInt(this.id) > 0 ? true : false;
            }
        } else if (this.entity && this.entity.columns[node.value.name]) {
            this.query.select.add(`${doubleQuotesString(node.value.name)}${EConstant.columnSeparator}`);
            this.showRelations = false;
        } else this.ctx.throw(EHttpCode.notFound, { code: EHttpCode.notFound, detail: errors.notValid });
    }

    protected VisitRessourcesPropertyPath(node: Token, context: IodataContext) {
        if (node.value.path) this.VisitRessources(node.value.path, context);
        if (node.value.navigation) this.VisitRessources(node.value.navigation, context);
    }

    protected VisitRessourcesODataUri(node: Token, context: IodataContext) {
        this.VisitRessources(node.value.resource, context);
        this.VisitRessources(node.value.query, context);
    }

    StartVisitRessources(node: Token) {
        console.log(log.debug_head("INIT PgVisitor"));
        this.limit = this.ctx.service.nb_page || 200;
        this.numeric = this.ctx.service.extensions.includes(EExtensions.resultNumeric);
        const temp = this.VisitRessources(node);
        this.verifyRessources();
        return temp;
    }

    getSql() {
        if (this.includes)
            this.includes.forEach((include) => {
                if (include.navigationProperty.includes("/")) {
                    const names = include.navigationProperty.split("/");
                    include.navigationProperty = names[0];
                    const visitor = new PgVisitor(this.ctx, { ...this.options });
                    if (visitor) {
                        const nameEntity = models.getEntity(this.ctx.service, names[0]);
                        if (nameEntity) {
                            visitor.entity = nameEntity;
                            visitor.navigationProperty = names[1];
                            if (include.includes) include.includes.push(visitor);
                            else include.includes = [visitor];
                        }
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
