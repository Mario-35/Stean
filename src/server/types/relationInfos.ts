import { Ientity } from "./";

/**
 * IrelationInfos
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
export interface IrelationInfos {
    type:  string; 
    entity: Ientity | undefined;
    column: string;
    leftKey: string;
    rightKey: string;
    external?: {
        table: string;
        leftKey: string;
        rightKey: string;
    };
    expand: string;
    link: string;
}
