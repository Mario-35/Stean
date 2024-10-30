/**
 * returnFormats
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { asDataArray, asGeoJSON, asJson, graphDatastream, graphMultiDatastream, interval, } from "../db/queries";
import { IreturnFormat, koaContext } from "../types";
import { addCssFile } from "../views/css";
import { addJsFile } from "../views/js";
import util from "util";
import { EConstant, EOptions, EReturnFormats } from "../enums";
import { isGraph } from ".";
import { PgVisitor } from "../odata/visitor";
// Default "blank" function
const defaultFunction = (input: string | object) => input;
// Default "blank" format function
const defaultForwat = (input: PgVisitor): string => input.toString();
const generateFields = (input: PgVisitor)=> {
  if (isGraph(input)) {
    const entity = input.parentEntity || input.entity;
    return entity ? [
      `(SELECT ${entity.table}."description" FROM ${entity.table} WHERE ${entity.table}."id" = ${
        input.parentId ? input.parentId : input.id
      }) AS title, `,
    ] : undefined;
  }
};
/**
 * 
 * @param input PgVisitor
 * @returns sSQL Query for graph
 */
const generateGrahSql = (input: PgVisitor) => {
  input.intervalColumns = ["id", "step as date", "result"];
  if (isGraph(input)) input.intervalColumns.push("concat");
  const entity = input.parentEntity || input.entity;
  if (entity) {
    const id = input.parentId ? input.parentId : input.id;
    const query = entity.table === input.ctx.model.Datastreams.table
        ? graphDatastream(entity.table, id, input)
        : graphMultiDatastream( entity.table, id, input );
        
    return asJson({
      query: query,
      singular: false,
      strip: false,
      count: false,
    });
  }
};
// all returns format functions
const _returnFormats: { [key in EReturnFormats]: IreturnFormat } = {
  xlsx: {
    name: "xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    format: defaultFunction,
    generateSql: defaultForwat,
  }, 
  // IMPORTANT TO HAVE THIS BEFORE GRAPHDATAS
  json: {
    name: "json",
    type: "application/json",
    format: defaultFunction,
    generateSql(input: PgVisitor) {
      return input.interval
        ? asJson({ query: interval(input), singular: false, strip: false, count: true })
        : asJson({
            query: input.toString(),
            singular: false,
            count: true,
            strip: input.ctx.service.options.includes(EOptions.stripNull),
            fullCount: input.count === true ? input.toPgQuery()?.count : undefined,
            fields: generateFields(input),
          });
    },
  }, 
  
  // IMPORTANT TO HAVE THIS BEFORE GRAPH
  graphDatas: {
    name: "graphDatas",
    type: "application/json",
    format: defaultFunction,
    generateSql(input: PgVisitor) { return generateGrahSql(input); },
  },
  graph: {
    name: "graph",
    type: "text/html;charset=utf8",
    format(input: string | object, ctx: koaContext): string | Record<string, any> {
      const graphNames: string[] = [];
      const formatedDatas: string[] = [];
      const height = String(100 / Object.entries(input).length).split(".")[0];
      if (typeof input === "object") {
       
        Object.entries(input).forEach((element: Record<string, any>, index: number) => {
          graphNames.push( `<button type="button" id="btngraph${index}" onclick="graph${index}.remove(); btngraph${index}.remove();">X</button>
           <div id="graph${index}" style="width:95%; height:${height}%;"></div>` );
          const infos = element[1]["description"]
            ? `${[ element[1]["description"], element[1]["name"], element[1]["symbol"], ].join('","')}`
            : `${element[1]["infos"].split("|").join(EConstant.doubleQuotedComa)}`;
          const formatedData = `const value${index} = [${element[1]["datas"]}]; 
          const infos${index} = ["${infos}"];`;
          formatedDatas.push(` ${formatedData} showGraph("graph${index}", infos${index}, value${index})`);
        });
      }
      return `<html lang="fr"> <head>
      <style>${addCssFile("dygraph.css")}</style> <!-- htmlmin:ignore --><script>${addJsFile( "dygraph.js" )}</script><!-- htmlmin:ignore -->
      ${graphNames.join("")}
        <script>
        ${addJsFile("graph.js")}
          const linkBase = "${ctx.decodedUrl.root}";
          ${formatedDatas.join(";")}                             
        </script>`;
    },
    generateSql(input: PgVisitor) {
      return generateGrahSql(input);
    },
  },
  dataArray: {
    name: "dataArray",
    type: "application/json",
    format: defaultFunction,
    generateSql(input: PgVisitor) {      
      return asDataArray(input);
    },
  },
  GeoJSON: {
    name: "GeoJSON",
    type: "application/json",
    format: defaultFunction,
    generateSql(input: PgVisitor) {      
      return asGeoJSON(input);
    },
  },
  csv: {
    name: "csv",
    type: "text/csv",
    format: defaultFunction,
    generateSql(input: PgVisitor) {
      return input.toString();
    }
  },
  txt: {
    name: "txt",
    type: "text/plain",
    format: (input: string | object) =>
      Object.entries(input).length > 0
        ? util.inspect(input, { showHidden: true, depth: 4 })
        : JSON.stringify(input),
    generateSql(input: PgVisitor) {
      return asJson({ query: input.toString(), singular: false, strip: false, count: false });
    },
  },
  sql: {
    name: "sql",
    type: "text/plain",
    format: defaultFunction,
    generateSql: defaultForwat,
  },
  html: {
    name: "html",
    type: "text/html;charset=utf8",
    format: defaultFunction,
    generateSql: defaultForwat,
  },
  css: {
    name: "css",
    type: "text/css;charset=utf8",
    format: defaultFunction,
    generateSql: defaultForwat,
  },
  js: {
    name: "js",
    type: "application/javascript;charset=utf8",
    format: defaultFunction,
    generateSql: defaultForwat,
  },
  png: {
    name: "png",
    type: "image/png",
    format: defaultFunction,
    generateSql: defaultForwat,
  },
  jpeg: {
    name: "jpeg",
    type: "image/jpeg",
    format: defaultFunction,
    generateSql: defaultForwat,
  },
  jpg: {
    name: "jpg",
    type: "image/jpeg",
    format: defaultFunction,
    generateSql: defaultForwat,
  },
  icon: {
    name: "icon",
    type: "image/x-icon",
    format: defaultFunction,
    generateSql: defaultForwat,
  },
  ico: {
    name: "ico",
    type: "image/x-icon",
    format: defaultFunction,
    generateSql: defaultForwat,
  },
  
  xml: {
    name: "xml",
    type: "application/xml",
    format: defaultFunction,
    generateSql: defaultForwat,
  },
};
export const returnFormats = Object.freeze(_returnFormats);