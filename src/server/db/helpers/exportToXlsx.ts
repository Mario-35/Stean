/**
 * exportToXlsx.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- exportToXlsx -----------------------------------!");

import Excel from "exceljs";
import postgres from "postgres";
import { serverConfig } from "../../configuration";
import { asyncForEach } from "../../helpers";
import { models } from "../../models";
import { EHttpCode, filterEntities } from "../../enums";
import { keyobj, koaContext } from "../../types";

const addConfigToExcel = async ( workbook: Excel.Workbook, config: object ) => {
  const worksheet = workbook.addWorksheet("Config");
  const cols: Partial<Excel.Column>[] = [
    { key: "key", header: "key" },
    { key: "value", header: "value" }
  ];
  worksheet.columns = cols;
  worksheet.columns.forEach((sheetColumn) => {
    sheetColumn.font = {
      size: 12,
    };
    sheetColumn.width = 30;
  });  

  worksheet.getRow(1).font = {
    bold: true,
    size: 13,
  };

  Object.keys(config).forEach((item: string) => {
    worksheet.addRow({key: item, value: typeof config[item as keyobj] === "object" ? Array(config[item as keyobj]).toString() : config[item as keyobj]});
  });
  
};

const addToExcel = async ( workbook: Excel.Workbook, name: string, input: Record<string, any> ) => {
  if (input && input[0]) {
    const worksheet = workbook.addWorksheet(name);
    const cols: Partial<Excel.Column>[] = [];
    Object.keys(input[0]).forEach((temp: string) => { cols.push({ key: temp, header: temp }); });
      
    worksheet.columns = cols;
    worksheet.columns.forEach((sheetColumn) => { sheetColumn.font = { size: 12, }; sheetColumn.width = 30; });
  
    if (Object.values(input).length > 0) {
        worksheet.getRow(1).font = { bold: true, size: 13, };
        Object.values(input).forEach((item: any) => { worksheet.addRow(item); });
    }
  }
};

// Create column List
const createColumnsList = async (ctx: koaContext, entity: string) => {
  const columnList: string[] = [];
  await asyncForEach(
    Object.keys(ctx.model[entity].columns),
    async (column: string) => {
      const createQuery = (input: string) => `select distinct ${input} AS "${column}" from "${ctx.model[entity].table}" LIMIT 200`;
      if (ctx.model[entity].columns[column].create !== "") {
        // IF JSON create column-key  note THAT is limit 200 firts items
        if (models.isColumnType(ctx.config, ctx.model[entity], column, "json")) {
          const tempSqlResult = await serverConfig.connection(ctx.config.name).unsafe(createQuery(`jsonb_object_keys("${column}")`))
            .catch(async (e) => {
              if (e.code === "22023") {
                const tempSqlResult = await serverConfig.connection(ctx.config.name).unsafe(createQuery(`jsonb_object_keys("${column}"[0])`)).catch(async (e) => {
                  if (e.code === "42804") {
                    const tempSqlResult = await serverConfig.connection(ctx.config.name).unsafe(createQuery(`jsonb_object_keys(jsonb_array_elements("${column}"))`));
                    if (tempSqlResult && tempSqlResult.length > 0)
                      tempSqlResult.forEach((e: Iterable<postgres.Row> ) => { columnList.push( `jsonb_array_elements("${column}")->>'${e[column as keyobj]}' AS "${column}-${e[column as keyobj]}"`); });
                  } else console.log(e);
                });    
                if (tempSqlResult && tempSqlResult.length > 0) 
                  tempSqlResult.forEach((e: Iterable<postgres.Row> ) => { columnList.push( `"${column}"[0]->>'${e[column as keyobj]}' AS "${column}-${e[column as keyobj]}"`); });
              } else console.log(e);
            });            
            if (tempSqlResult && tempSqlResult.length > 0)
              tempSqlResult.forEach((e: Iterable<postgres.Row> ) => { columnList.push( `"${column}"->>'${e[column as keyobj]}' AS "${column}-${e[column as keyobj]}"`); });
        } else columnList.push(`"${column}"`);
      }
    });    
  return columnList;
};

export const exportToXlsx = async (ctx: koaContext) => {
  // CReate new workBook
  const workbook = new Excel.Workbook();
  workbook.creator = "Me";
  workbook.lastModifiedBy = "Her";
  workbook.created = new Date(Date.now());
  workbook.modified = new Date(Date.now());
  // Get configs infos
  addConfigToExcel(workbook, serverConfig.getConfigForExcelExport(ctx.config.name));
  // Loop on entities
  await asyncForEach(
    Object.keys(filterEntities(ctx.config.extensions)).filter((entity: string) => ctx.model[entity].table !== "" ),
    async (entity: string) => {
      const cols = await createColumnsList(ctx, entity);      
      const temp = await serverConfig.connection(ctx.config.name).unsafe(`select ${cols} from "${ctx.model[entity].table}" LIMIT 200`);  
      await addToExcel(workbook, entity, temp);
  });
  // Save file
  ctx.status = EHttpCode.ok;
  ctx.response.attachment(`${ctx.config.name}.xlsx`);
  await workbook.xlsx.write(ctx.res);
  // Close all
  ctx.res.end();
};

