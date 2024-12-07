/**
 * CreateFile entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "./common";
import { IcsvColumn, IcsvFile, IreturnResult, koaContext } from "../../types";
import { getColumnsNamesFromCsvFile, executeSqlValues } from "../helpers";
import { errors } from "../../messages/";
import * as entities from "../entities/index";
import { returnFormats } from "../../helpers";
import { createReadStream } from 'fs';
import { addAbortSignal } from 'stream';
import { config } from "../../configuration";
import { log } from "../../log";
import { EConstant } from "../../enums";
import { FILE, LINE } from "../../models/entities";

export class CreateFile extends Common {
  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    super(ctx);
  }
  
  streamCsvFileInFiles = async ( ctx: koaContext, paramsFile: IcsvFile ): Promise<string | undefined> => {
    console.log(log.debug_head("streamCsvFileInPostgreSqlFileInDatastream"));
    const headers = await getColumnsNamesFromCsvFile(paramsFile.filename);
    if (!headers) {
      ctx.throw(400, {
        code: 400,
        detail: errors.noHeaderCsv + paramsFile.filename,
      });
    }
    const nameOfFile = paramsFile.filename.split("/").reverse()[0];
    const createDataStream = async () => {
      const copyCtx = Object.assign({}, ctx.odata);
      ctx.odata.entity = FILE;
      // IMPORTANT TO ADD instead update
      ctx.odata.returnFormat = returnFormats.json;
      ctx.log = undefined;
      // @ts-ignore
      const objectFile = new entities[FILE.name]( ctx );
      try {
        return await objectFile.post({
          "name": nameOfFile,
          "description": `${FILE.name} import file ${nameOfFile}`,
        });
      } catch (err) {
        console.log(err);        
        ctx.odata.query.where.init(`"name" ~* '${nameOfFile}'`);
        const returnValueError = await objectFile.getAll();        
        ctx.odata = copyCtx;
        if (returnValueError) {
          returnValueError.body = returnValueError.body
            ? returnValueError.body[0]
            : {};
          if (returnValueError.body) await executeSqlValues(ctx.service, `DELETE FROM "${LINE.table}" WHERE "file_id" = ${returnValueError.body[EConstant.id]}`);
          return returnValueError;
        }
      } finally {
        ctx.odata = copyCtx;
      }
    };
    const returnValue = await createDataStream().catch((err: Error) => console.log(err));
    
    const controller = new AbortController();
    const readable = createReadStream(paramsFile.filename);
    const cols:string[] = [];
    headers.forEach((value: string) => cols.push(`${value} TEXT NULL`));  
    const createTable = `CREATE TABLE public."${paramsFile.tempTable}" (${cols});`;
    await executeSqlValues(ctx.service, createTable);
    const writable = config.connection(ctx.service.name).unsafe(`COPY ${paramsFile.tempTable}  (${headers.join( "," )}) FROM STDIN WITH(FORMAT csv, DELIMITER ';'${ paramsFile.header })`).writable();
    return await new Promise<string | undefined>(async (resolve, reject) => {      
      readable
        .pipe(addAbortSignal(controller.signal, await writable))
        .on('close', async () => {
          const sql = `INSERT INTO "${ LINE.table }" 
                    (
                    "file_id", 
                    "result") 
                    SELECT '${Number( returnValue.body[EConstant.id] )}', 
                    json_build_object('valueskeys',ROW_TO_JSON(p)) FROM (SELECT * FROM ${ paramsFile.tempTable }) AS p 
                    ON CONFLICT DO NOTHING`;
                    
          await config.connection(this.ctx.service.name).unsafe(sql);          
          if (returnValue) resolve(returnValue);
        })
        .on('error', (err) => {          
          log.error('ABORTED-STREAM');
          reject(err);
        });
      });
  };
  
  async getAll(): Promise<IreturnResult | undefined> {
    this.ctx.throw(400, { code: 400 });
  }
  
  async getSingle(): Promise<IreturnResult | undefined> {
    console.log(log.whereIam());
    this.ctx.throw(400, { code: 400 });
  }
    
  async post(dataInput: Record<string, string>): Promise<IreturnResult | undefined> {
    console.log(log.whereIam(dataInput));
    if (this.ctx.datas) {      
      const myColumns: IcsvColumn[] = [];
        return this.formatReturnResult({
          body: await this.streamCsvFileInFiles( this.ctx, {
            tempTable: `temp${Date.now().toString()}`,
            filename: this.ctx.datas["file"],
            columns: myColumns,
            header: ", HEADER",
            stream: [], 
          }),
        });      
    } else {
      log.error("No Datas");
      return;
    }
  }

}
