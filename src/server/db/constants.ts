/**
 * Constants for DataBase
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { escapeSimpleQuotes } from "../helpers";

export type _STREAM = "Datastream" | "MultiDatastream" | undefined;
export const FORMAT_JSONB = (content: any) => `E'${content ? escapeSimpleQuotes(JSON.stringify(content)) : "{}"}'::text::jsonb`;
