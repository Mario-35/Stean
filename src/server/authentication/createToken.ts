/**
 * createToken
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- createToken -----------------------------------!");

import { Iuser } from "../types";
import jsonwebtoken from "jsonwebtoken";
import { APP_KEY } from "../constants";

export const createToken = (input: Iuser, password: string) => {  
  return jsonwebtoken.sign(
    {
      data: {
        id: input.id,
        username: input.username,
        password: password,
        PDCUAS: [
          input.canPost,
          input.canDelete,
          input.canCreateDb,
          input.canCreateUser,
          input.admin,
          input.superAdmin,
        ],
      },
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 60 seconds * 60 minutes = 1 hour
    },
    APP_KEY
  );
};
