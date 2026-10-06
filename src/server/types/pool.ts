/**
 * pool interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EState } from "../enums";

export interface Ipool {
    name: string;
    state: EState;
    query: string;
}
