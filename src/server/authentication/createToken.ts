/**
 * createToken
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { espireTime } from "../constants";
import { paths } from "../paths";
import { Iuser } from "../types";
import jsonwebtoken from "jsonwebtoken";

/**
 * create a token for Iuser
 * @param input Iuser
 * @param password string
 * @returns token as string
 */

export const createToken = (input: Iuser, password: string): string => {
    return jsonwebtoken.sign(
        {
            data: {
                id: input.id,
                username: input.username,
                password: password,
                PDCUAS: [input.canPost, input.canDelete, input.canCreateDb, input.canCreateUser, input.admin, input.superAdmin]
            },
            exp: espireTime()
        },
        paths.key
    );
};
