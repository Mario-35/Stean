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
