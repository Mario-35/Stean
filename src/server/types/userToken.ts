/**
 * userToken interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export interface IuserToken {
    id: number;
    username: string;
    password: string;
    PDCUAS: [boolean, boolean, boolean, boolean, boolean, boolean];
}
export const blankUserToken: IuserToken = { id: 0, username: "", password: "", PDCUAS: [false, false, false, false, false, false] };
