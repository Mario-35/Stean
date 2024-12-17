/**
 * Common class entity
 *f
 * @copyright 2020-present Inrae
 * @review 29-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { doubleQuotesString, returnFormats } from "../../helpers/index";
import { IreturnResult, keyobj, koaContext } from "../../types";
import { removeKeyFromUrl } from "../helpers";
import { getErrorCode, info } from "../../messages";
import { log } from "../../log";
import { config } from "../../configuration";
import { EConstant, EHttpCode } from "../../enums";
import { asCsv } from "../queries";
import { replayLoraLogs } from "../../lora";

// Common class
export class Common {
  readonly ctx: koaContext;
  public nextLinkBase: string;
  public linkBase: string;
  
  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    this.ctx = ctx;
    this.nextLinkBase = removeKeyFromUrl(`${this.ctx.decodedUrl.root}/${ this.ctx.href.split(`${ctx.service.apiVersion}/`)[1] }`, ["top", "skip"] );
    this.linkBase = `${this.ctx.decodedUrl.root}/${this.constructor.name}`;     
  }
  // Get a key value
  private getKeyValue(input: Record<string, any>, key: string): string | undefined {
    let result: string | undefined = undefined;
    if (input[key]) {
      result = input[key][EConstant.id] ? input[key][EConstant.id] : input[key];
      delete input[key];
    }
    return result;
  }
  
  // Get a list of key values
  public getKeysValue(input: Record<string, any>, keys: string[]): string | undefined {
    keys.forEach((key) => {
      const temp = this.getKeyValue(input, key);
      if (temp) return temp;
    });
    return undefined;
  }

  // Only for override
  formatDataInput(input: Record<string, any> | undefined ): Record<string, any> | undefined {    
    return input;
  }
  // create a blank ReturnResult
  public formatReturnResult(args: Record<string, any>): IreturnResult {    
    console.log(log.whereIam());    
    return {
      ...{
        id: undefined,
        selfLink: args.body && typeof args.body === 'object' ? args.body['@iot.selfLink' as keyof object] : undefined,
        nextLink: args.nextLink ? (args.nextLink as string) : undefined,
        prevLink: args.prevLink ? (args.prevLink as string) : undefined,
        body: undefined,
        total: undefined,
      },
      ...args,
    };
  }

  // Create the nextLink
  public nextLink = (resLength: number): string | undefined => {
    if (this.ctx.odata.limit < 1) return;
    const max: number =
      this.ctx.odata.limit > 0
        ? +this.ctx.odata.limit
        : +this.ctx.service.nb_page;
    if (resLength >= max) 
     return `${encodeURI(this.nextLinkBase)}${this.nextLinkBase.includes("?") ? "&" : "?" }$top=${this.ctx.odata.limit}&$skip=${this.ctx.odata.skip + this.ctx.odata.limit }`;
  };

  // Create the prevLink
  public prevLink = (resLength: number): string | undefined => {
    if (this.ctx.odata.limit < 1) return;
    const prev = this.ctx.odata.skip - this.ctx.odata.limit;
    if ( ((this.ctx.service.nb_page && resLength >= this.ctx.service.nb_page) || this.ctx.odata.limit) && prev >= 0 )
      return `${encodeURI(this.nextLinkBase)}${ this.nextLinkBase.includes("?") ? "&" : "?" }$top=${this.ctx.odata.limit}&$skip=${prev}`;
  };

  // Return all items
  async getAll(): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    // create query
    let sql = this.ctx.odata.getSql();
    if (this.ctx.odata.replay === true) await replayLoraLogs(this.ctx, sql);
    // Return results
    if (sql) {      
      switch (this.ctx.odata.returnFormat) {
       case returnFormats.sql:
         return this.formatReturnResult({ body: sql }); 
       case returnFormats.csv:
          sql = asCsv(sql, this.ctx.service.csvDelimiter);          
          config.writeLog(log.query(sql));
          this.ctx.attachment(`${this.ctx.odata.entity?.name || "export"}.csv`);
          return this.formatReturnResult({ body:  await config
              .connection(this.ctx.service.name)
              .unsafe(sql)
              .readable()});
       default:        
         return await config.executeSqlValues(this.ctx.service, sql).then(async (res: Record<string, any>) => {         
           return (res[0] > 0) 
           ? this.formatReturnResult({ 
              id: isNaN(res[0][0]) ? undefined : +res[0], 
              nextLink: this.nextLink(res[0]), 
              prevLink: this.prevLink(res[0]), 
              body: res[1], }) 
            : this.formatReturnResult({ body: res[0] == 0 ? [] : res[0]});
         }).catch((err: Error) => this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: err.message }));
     }
    }
  }
  // Return one item
  async getSingle(): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    // create query
    const sql = this.ctx.odata.getSql();
    // Return results
    if (sql)
     switch (this.ctx.odata.returnFormat) {
       case returnFormats.sql:
         return this.formatReturnResult({ body: sql }); 
         case returnFormats.GeoJSON:
           return await config.executeSqlValues(this.ctx.service, sql).then((res: Record<string, any>) => {
             return this.formatReturnResult({ body: res[0] });
           });
       default:
         return await config.executeSqlValues(this.ctx.service, sql).then((res: Record<string, any>) => {

           if (this.ctx.odata.query.select && this.ctx.odata.onlyValue  === true) {
            const temp = res[ this.ctx.odata.query.select[0 as keyobj] == "id" ? EConstant.id : 0 ];
            if(typeof temp === "object") {
              this.ctx.odata.returnFormat = returnFormats.json;
              return this.formatReturnResult({ body: temp });
            } else return this.formatReturnResult({ body: String(temp), });
           }
             return this.formatReturnResult({ 
               id: isNaN(res[0]) ? undefined : +res[0], 
               nextLink: this.nextLink(res[0]), 
               prevLink: this.prevLink(res[0]), 
               body: this.ctx.odata.single === true ?  res[1][0] : {value : res[1] },
             });
         }).catch((err: Error) => this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: err }) );
     }
  }
  // Execute multilines SQL in one query
  async addWultipleLines(dataInput: Record<string, any>  | undefined): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    process.stdout.write("***********************************************************************************************************" + "\n");

    // stop save to log cause if datainput too big 
    if (this.ctx.log) this.ctx.log.datas = {datas: info.MultilinesNotSaved};
    // create queries
    const sqls:string[] = Object(dataInput).map((datas: Record<string, any> ) => {
      const modifiedDatas = this.formatDataInput(datas);
      if (modifiedDatas) {
       const sql = this.ctx.odata.postSql(modifiedDatas);
        if (sql) return sql;
      }
    });
    // return results
    const results: Record<string, any>[] = [];
    // execute query
    await config.executeSqlValues(this.ctx.service, sqls.join(";")).then((res: Record<string, any> ) => results.push(res[0 as keyobj]) )
        .catch((error: Error) => { 
          console.log(error);           
          this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: error["detail" as keyobj] });
        });
    // Return results
    return this.formatReturnResult({
      body: results,
    });
  }
  // Post an item
  async post(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined | void> {
    console.log(log.whereIam());
    // Format datas
    dataInput = this.formatDataInput(dataInput);
    if (!dataInput) return;
    // create query
    const sql = this.ctx.odata.postSql(dataInput);
    // Return results
    if (sql) switch (this.ctx.odata.returnFormat ) {
      case returnFormats.sql:
        return this.formatReturnResult({ body: sql }); 
      default:
        return await config.executeSqlValues(this.ctx.service, sql) 
          .then((res: Record<string, any>) => {
            if (res[0]) {
              if (res[0].duplicate)
                this.ctx.throw(EHttpCode.conflict, {
                  code: EHttpCode.conflict,
                  detail: `${this.constructor.name} already exist`,
                  link: `${this.linkBase}(${[res[0].duplicate]})`,
                });
              return this.formatReturnResult({
                body: res[0][0],
                query: sql,
              });
            }
          })
          .catch((err: Error) => {    
            const code = getErrorCode(err, 400);     
            this.ctx.throw(code, { code: code, detail: err.message });
          });
    }
  }
  // Update an item
  async update( idInput: bigint | string, dataInput: Record<string, any>  | undefined ): Promise<IreturnResult | undefined | void> {
    console.log(log.whereIam()); 
    // Format datas
    dataInput = this.formatDataInput(dataInput);
    if (!dataInput) return;
    // create Query
    const sql = this.ctx.odata.patchSql(dataInput);
    // Return results
    if (sql) switch (this.ctx.odata.returnFormat ) {
      case returnFormats.sql:
        return this.formatReturnResult({ body: sql });        
      default:
        return await config.executeSqlValues(this.ctx.service, sql) 
        .then((res: Record<string, any>) => {  
          if (res[0]) {
            return this.formatReturnResult({
              body: res[0][0],
              query: sql,
            });
          }
        })
        .catch((err: Error) => {
        const code = getErrorCode(err, 400);     
        this.ctx.throw(code, { code: code, detail: err.message });
        });
    }
  }
  // Delete an item
  async delete(idInput: bigint | string): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    // create Query
    const sql = `DELETE FROM ${doubleQuotesString(this.ctx.model[this.constructor.name].table)} WHERE "id" = ${idInput} RETURNING id`;
    // Return results
    if (sql) switch (this.ctx.odata.returnFormat ) {
      case returnFormats.sql:
        return this.formatReturnResult({ body: sql });          
      default:
        return this.formatReturnResult( { id: await config.executeSqlValues(this.ctx.service, sql) .then((res) => res[0 as keyobj]) .catch(() => BigInt(0)) } );
    }
  }
}
 