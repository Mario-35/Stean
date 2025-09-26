/**
 * Constants for DataBase
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { ESCAPE_SIMPLE_QUOTE } from "../constants";

export type _STREAM = "Datastream" | "MultiDatastream" | undefined;
export const FORMAT_JSONB = (content: any) => `E'${content ? ESCAPE_SIMPLE_QUOTE(JSON.stringify(content)) : "{}"}'::text::jsonb`;
export const partitionTable = (table: string, index: number = 0) =>
    `CREATE TABLE IF NOT EXISTS "${table}0${index > 0 ? "" : `'||NEW."id"||'`}" PARTITION OF ${table} FOR VALUES IN (${index > 0 ? "0" : `'||NEW."id"||'`})`;
