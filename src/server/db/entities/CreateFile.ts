/**
 * CreateFile entity
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- CreateFile entity -----------------------------------!");

import { Common } from "./common";
import { IcsvColumn, IcsvFile, IreturnResult, koaContext } from "../../types";
import { columnsNameFromCsv, executeSqlValues } from "../helpers";
import { errors } from "../../messages/";
import * as entities from "../entities/index";
import { returnFormats } from "../../helpers";
import { createReadStream } from 'fs';
import { addAbortSignal } from 'stream';
import { config } from "../../configuration";
import { log } from "../../log";

export class CreateFile extends Common {
  constructor(ctx: koaContext) {
    console.log(log.whereIam());
    super(ctx);
  }

  streamCsvFileInPostgreSqlFileInDatastream = async ( ctx: koaContext, paramsFile: IcsvFile ): Promise<string | undefined> => {
    console.log(log.debug_head("streamCsvFileInPostgreSqlFileInDatastream"));
    const headers = await columnsNameFromCsv(paramsFile.filename);

    if (!headers) {
      ctx.throw(400, {
        code: 400,
        detail: errors.noHeaderCsv + paramsFile.filename,
      });
    }
    const createDataStream = async () => {
      const nameOfFile = paramsFile.filename.split("/").reverse()[0];
      const copyCtx = Object.assign({}, ctx.odata);
      const tempId = ctx.odata.id.toString();
      ctx.odata.entity = this.ctx.model.Datastreams.name;

      // IMPORTANT TO ADD instead update
      ctx.odata.id = "";
      ctx.odata.returnFormat = returnFormats.json;
      ctx.log = undefined;
      // @ts-ignore
      const objectDatastream = new entities[this.ctx.model.Datastreams.name]( ctx );
      const myDatas = {
        name: `${this.ctx.model.Datastreams.name} import file ${nameOfFile}`,
        description: "Description in meta ?",
        observationType:
          "http://www.opengis.net/def/observation-type/ogc-omxml/2.0/swe-array-observation",
        Thing: { "@iot.id": tempId },
        unitOfMeasurement: {
          name: headers.join(),
          symbol: "csv",
          definition: "https://www.rfc-editor.org/rfc/pdfrfc/rfc4180.txt.pdf",
        },
        ObservedProperty: {
          name: `is Generik ${nameOfFile}`,
          description: "KOIKE observe",
          definition:
            "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature",
        },
        Sensor: {
          name: `Nom du Kapteur${nameOfFile}`,
          description: "Capte heures a la seconde",
          encodingType: "application/pdf",
          metadata: "https://time.com/datasheets/capteHour.pdf",
        },
      };
      try {
        return await objectDatastream.post(myDatas);
      } catch (error) {
        // ctx.odata.where = `"name" ~* '${nameOfFile}'`;
        ctx.odata.query.where.init(`"name" ~* '${nameOfFile}'`);
        const returnValueError = await objectDatastream.getAll();
        ctx.odata = copyCtx;
        if (returnValueError) {
          returnValueError.body = returnValueError.body
            ? returnValueError.body[0]
            : {};
          if (returnValueError.body) await executeSqlValues(ctx.config, `DELETE FROM "${this.ctx.model.Observations.table}" WHERE "datastream_id" = ${returnValueError.body["@iot.id"]}`);
          return returnValueError;
        }
      } finally {
        ctx.odata = copyCtx;
      }
    };

    const returnValue = await createDataStream();
    
      const controller = new AbortController();
      const readable = createReadStream(paramsFile.filename);
      const cols:string[] = [];
      headers.forEach((value) => cols.push(`"${value}" varchar(255) NULL`));
  
      const createTable = `CREATE TABLE public."${paramsFile.tempTable}" (
        id serial4 NOT NULL,
        "date" varchar(255) NULL,
        "hour" varchar(255) NULL,
        ${cols}, 
        CONSTRAINT ${paramsFile.tempTable}_pkey PRIMARY KEY (id));`;
        await executeSqlValues(ctx.config, createTable);
      const writable = config.connection(ctx.config.name).unsafe(`COPY ${paramsFile.tempTable}  (${headers.join( "," )}) FROM STDIN WITH(FORMAT csv, DELIMITER ';'${ paramsFile.header })`).writable();
      return await new Promise<string | undefined>(async (resolve, reject) => {
      
      readable
        .pipe(addAbortSignal(controller.signal, await writable))
        .on('close', async () => {
          // TODO DATES !!!!
          const sql = `INSERT INTO "${ this.ctx.model.Observations.table }" 
                    ("datastream_id", "phenomenonTime", "resultTime", "result") 
                    SELECT '${String(
                      returnValue.body["@iot.id"]
                    )}', '2021-09-17T14:56:36+02:00', '2021-09-17T14:56:36+02:00', json_build_object('value',ROW_TO_JSON(p)) FROM (SELECT * FROM ${
                      paramsFile.tempTable
                    }) AS p`;
          await config.connection(this.ctx.config.name).unsafe(sql);          
          resolve(returnValue["body"]);
        })
        .on('error', (err) => {
          log.error('ABORTED-STREAM');
          reject(err);
        });
      // await finished(stream);
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
          body: await this.streamCsvFileInPostgreSqlFileInDatastream( this.ctx, {
            tempTable: `temp${Date.now().toString()}`,
            filename: this.ctx.datas["file"],
            columns: myColumns,
            header: ", HEADER",
            stream: [], // only for interface
          }),
        });      
    } else {
      log.error("No Datas");
      return;
    }
  }


}
