/**
 * Common class entity
 *f
 * @copyright 2020-present Inrae
 * @review 29-01-2024
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Common class entity -----------------------------------!\n");

import { doubleQuotesString, returnFormats } from "../../helpers/index";
import { IreturnResult, keyobj, koaContext } from "../../types";
import { executeSqlValues, removeKeyFromUrl } from "../helpers";
import { getErrorCode, info } from "../../messages";
import { log } from "../../log";
import { config } from "../../configuration";
import { EConstant } from "../../enums";
import { asCsv } from "../queries";
import { isFile } from "../../helpers/tests";

// Common class
export class Common {
  readonly ctx: koaContext;
  public nextLinkBase: string;
  public linkBase: string;

  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    this.ctx = ctx;
    this.nextLinkBase = removeKeyFromUrl(`${this.ctx.decodedUrl.root}/${ this.ctx.href.split(`${ctx.config.apiVersion}/`)[1] }`, ["top", "skip"] );
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
        : +this.ctx.config.nb_page;
    if (resLength >= max) 
     return `${encodeURI(this.nextLinkBase)}${this.nextLinkBase.includes("?") ? "&" : "?" }$top=${this.ctx.odata.limit}&$skip=${this.ctx.odata.skip + this.ctx.odata.limit }`;
  };

  // Create the prevLink
  public prevLink = (resLength: number): string | undefined => {
    if (this.ctx.odata.limit < 1) return;
    const prev = this.ctx.odata.skip - this.ctx.odata.limit;
    if ( ((this.ctx.config.nb_page && resLength >= this.ctx.config.nb_page) || this.ctx.odata.limit) && prev >= 0 )
      return `${encodeURI(this.nextLinkBase)}${ this.nextLinkBase.includes("?") ? "&" : "?" }$top=${this.ctx.odata.limit}&$skip=${prev}`;
  };

  // Return all items
  async getAll(): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    // create query
    let sql = this.ctx.odata.getSql();
    
    // Return results
    if (sql) {
      switch (this.ctx.odata.returnFormat) {
       case returnFormats.sql:
         return this.formatReturnResult({ body: sql }); 
       case returnFormats.csv:
         if (!isFile(this.ctx)) sql =  asCsv(sql);
            try {            
              config.writeLog(log.query(sql));
              this.ctx.attachment(`${this.ctx.odata.entity?.name || "export"}.csv`)
              return this.formatReturnResult({
                body: await config
                .connection(this.ctx.config.name)
                .unsafe(sql)
                .readable()
                .catch(err => {
                  return err
                }).then(async (e: any) => {
                  this.ctx.body = "";
                  for await (const chunk of e) {
                    if (chunk.json) {
                      const data = chunk.json;
                      if (this.ctx.body)
                        this.ctx.body += `${Object.keys(data).map(key => data[key]).join(";")}\n`;
                      else this.ctx.body = `${Object.keys(data).map(key => key).join(";")}\n`;
                    } else  this.ctx.body += chunk;
                  }
                  return this.ctx.body;
                })
              });
            } catch (error) {
              return this.formatReturnResult({ body: error });
            }

       case returnFormats.graph:
         return await executeSqlValues(this.ctx.config, sql).then(async (res: Record<string, any>) => {         
           return (res[0] > 0) 
          ? this.formatReturnResult({ 
             id: isNaN(res[0][0]) ? undefined : +res[0], 
             nextLink: this.nextLink(res[0]), 
             prevLink: this.prevLink(res[0]), 
             body: res[1],
          }) 
          : this.formatReturnResult({ body: res[0] == 0 ? [] : res[0]});
        }).catch((err: Error) => this.ctx.throw(400, { code: 400, detail: err.message }) );
       default:        
         return await executeSqlValues(this.ctx.config, sql).then(async (res: Record<string, any>) => {         
           return (res[0] > 0) 
           ? this.formatReturnResult({ 
              id: isNaN(res[0][0]) ? undefined : +res[0], 
              nextLink: this.nextLink(res[0]), 
              prevLink: this.prevLink(res[0]), 
              body: res[1], }) 
            : this.formatReturnResult({ body: res[0] == 0 ? [] : res[0]});
         }).catch((err: Error) => this.ctx.throw(400, { code: 400, detail: err.message }) );
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
           return await executeSqlValues(this.ctx.config, sql).then((res: Record<string, any>) => {
             return this.formatReturnResult({ body: res[0] });
           });
       default:
         return await executeSqlValues(this.ctx.config, sql).then((res: Record<string, any>) => {
           if (this.ctx.odata.query.select && this.ctx.odata.onlyValue  === true) {
             return this.formatReturnResult({ 
               body: String(res[ this.ctx.odata.query.select[0 as keyobj] == "id" ? EConstant.id : 0 ]),
             });
           }
             return this.formatReturnResult({ 
               id: isNaN(res[0]) ? undefined : +res[0], 
               nextLink: this.nextLink(res[0]), 
               prevLink: this.prevLink(res[0]), 
               body: this.ctx.odata.single === true ?  res[1][0] : {value : res[1] },
             });
         }).catch((err: Error) => this.ctx.throw(400, { code: 400, detail: err }) );
     }
  }

  // Execute multilines SQL in one query
  async addWultipleLines(dataInput: Record<string, any>  | undefined): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
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
    await executeSqlValues(this.ctx.config, sqls.join(";")).then((res: Record<string, any> ) => results.push(res[0 as keyobj]) )
        .catch((error: Error) => { 
          console.log(error);           
          this.ctx.throw(400, { code: 400, detail: error["detail" as keyobj] });
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
        return await executeSqlValues(this.ctx.config, sql) 
          .then((res: Record<string, any>) => {
            if (res[0]) {
              if (res[0].duplicate)
                this.ctx.throw(409, {
                  code: 409,
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
        return await executeSqlValues(this.ctx.config, sql) 
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
        return this.formatReturnResult( { id: await executeSqlValues(this.ctx.config, sql) .then((res) => res[0 as keyobj]) .catch(() => BigInt(0)) } );
    }
  }
}
 