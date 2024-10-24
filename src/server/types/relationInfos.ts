/**
 * IrelationInfos
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
export interface IrelationInfos {
    type:  string; 
    table: string;
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
