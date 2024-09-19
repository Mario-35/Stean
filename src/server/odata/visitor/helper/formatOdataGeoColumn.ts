/**
 * OdataGeoColumn
 *
 * @copyright 2022-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- OdataGeoColumn class -----------------------------------!");

import { _TESTENCODING } from "../../../db/constants";
import { EQuery } from "../../../enums";
import { doubleQuotesString, removeAllQuotes } from "../../../helpers";
import { log } from "../../../log";
import { models } from "../../../models";
import { relationInfos, expand } from "../../../models/helpers";
import { IodataContext } from "../../../types";
import { PgVisitor } from "../pg/pgVisitor";


export class OdataGeoColumn {
  src: PgVisitor;
  test: string | undefined;
  column: string;
  method: string;
  key: string;
  
  constructor(src: PgVisitor, method: string, column: string) {    
    this.src = src ;
    this.column = column ;
    this.method =  method ===  "geo.length" ? "ST_Length" : method.toUpperCase().replace("GEO.", "ST_");
    this.test = this.init();
  }

  init(): string | undefined {
    console.log(log.whereIam());    
    this.column = removeAllQuotes(this.column);
    let test: string | undefined = undefined;
    const tempEntity =  models.getEntity(this.src.ctx.config, this.src.entity);
    if (tempEntity) {
      if (this.column.includes(".")) {
        const temp = this.column.split(".");
        const tm = models.getEntity(this.src.ctx.config, temp[0]);
        if (tm && tm.columns.hasOwnProperty(temp[1])) {
          this.src.subQuery.select = `"featureofinterest"."id"`;
          this.src.subQuery.where = `CASE WHEN "${_TESTENCODING}" LIKE '%geo+json' THEN ST_GeomFromEWKT(ST_GeomFromGeoJSON(coalesce(${doubleQuotesString(temp[1])}->'geometry',${doubleQuotesString(temp[1])}))) ELSE ST_GeomFromEWKT(${doubleQuotesString(temp[1])}::text) END`;
          this.key = `"${temp[1]}"->>'type'`;
          return undefined;
        }
      } else if (this.column.includes("/")) {
        const temp = this.column.split("/");        
        if (tempEntity.relations.hasOwnProperty(temp[0])) {
          const relation = relationInfos(this.src.ctx.config, tempEntity.name, temp[0]);
          this.column = `(SELECT ${doubleQuotesString(temp[1])} FROM ${doubleQuotesString(relation.table)} WHERE ${expand(this.src.ctx,tempEntity.name, temp[0])} AND length(${doubleQuotesString(temp[1])}::text) > 2)`;
          if (tempEntity.columns.hasOwnProperty(_TESTENCODING))  test = `(SELECT ${doubleQuotesString(_TESTENCODING)} FROM ${doubleQuotesString(relation.table)} WHERE ${expand(this.src.ctx,tempEntity.name, temp[0])})`;
        }
      } else if (!tempEntity.columns.hasOwnProperty(this.column)) {        
        if (tempEntity.relations.hasOwnProperty(this.column)) {
          const relation = relationInfos(this.src.ctx.config, tempEntity.name, this.column);        
          this.column = `(SELECT ${doubleQuotesString(relation.column)} FROM ${doubleQuotesString(relation.table)} WHERE ${expand(this.src.ctx,tempEntity.name, this.column)} AND length(${doubleQuotesString(relation.column)}::text) > 2)`;
          if (tempEntity.columns.hasOwnProperty(_TESTENCODING))  test = _TESTENCODING;

        } else if (this.src.ctx.model[this.src.parentEntity as keyof object].columns.hasOwnProperty(this.column)) {
          const relation = relationInfos(this.src.ctx.config, tempEntity.name, this.column);        
          this.column = `(SELECT ${doubleQuotesString(relation.column)} FROM ${doubleQuotesString(relation.table)} WHERE ${expand(this.src.ctx,tempEntity.name, this.column)} AND length(${doubleQuotesString(relation.column)}::text) > 2)`;
          if (tempEntity.columns.hasOwnProperty(_TESTENCODING))  test = _TESTENCODING;

        } else throw new Error(`Invalid this.column ${this.column}`);
      } else {      
        // TODO ADD doubleQuotesString
        const temp = tempEntity.columns.hasOwnProperty(_TESTENCODING);
        if (temp) test = doubleQuotesString(_TESTENCODING);
        this.column = doubleQuotesString(this.column);
      }
    }    
    if (test) 
      return `CASE WHEN "${_TESTENCODING}" LIKE '%geo+json' THEN ST_GeomFromEWKT(ST_GeomFromGeoJSON(coalesce(${this.column}->'geometry',${this.column}))) ELSE ST_GeomFromEWKT(${this.column}::text) END`
  }

  toString() {
    return this.test 
    ? this.test 
    : this.src.subQuery.where
      ? this.src.subQuery.where
      : "";
  }

  createFunc(datas: string) {
    switch (this.method) {
      case "ST_Length":
        return `${this.method}(ST_MakeLine(ST_AsText(${this.toString()}), ${datas}))`    
      default:
        return`${this.method}(ST_AsText(${this.toString()}), ${datas})`;
    }
  }

  createColumn(datas: string, context: IodataContext){
    if (this.test) {
      this.src.addToWhere(this.createFunc(datas), context);
    } else {
        this.src.subQuery.where = `${this.key} = 'Point' AND ${this.createFunc(datas)}`;
        context.target =  EQuery.Geo;
    }
    return context;
  }
}
