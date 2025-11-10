/**
 * User dataAccess
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Iuser } from "../../types";
import { encrypt } from "../../helpers";
import { config } from "../../configuration";
import { USER } from "../../models/entities";

// Get all the columns of user table
const userColumns = () => Object.keys(USER.columns);

// TODO why not class ?
export const userAccess = {
    getAll: async (configName: string) => {
        const conn = config.connection(configName);
        const query = await conn<Iuser[]>`SELECT ${conn(userColumns())} FROM ${conn(USER.table)} ORDER BY id`;
        return query[0];
    },
    getSingle: async (configName: string, id: string | number) => {
        const conn = config.connection(configName);
        id = typeof id === "number" ? String(id) : id;
        const query = await conn<Iuser[]>`SELECT ${conn(userColumns())} FROM ${conn(USER.table)} WHERE id = ${+id} LIMIT 1`;
        if (query.length === 1) return query[0];
    },
    post: async (configName: string, data: Iuser) => {
        const conn = config.connection(configName);
        return await conn
            .unsafe(
                `INSERT INTO "user" ("username", "email", "password", "database", "canPost", "canDelete", "canCreateUser", "canCreateDb", "superAdmin", "admin") VALUES ('${data.username}', '${
                    data.email
                }', '${encrypt(data.password)}', '${data.database || "all"}', ${data.canPost || false}, ${data.canDelete || false}, ${data.canCreateUser || false}, ${data.canCreateDb || false}, ${
                    data.superAdmin || false
                }, ${data.admin || false}) RETURNING *`
            )
            .catch(async (err) => {
                if (err.code === "23505") {
                    const id = await conn.unsafe(`SELECT id FROM "${USER.table}" WHERE "username" = '${data.username}'`);
                    if (id[0]) {
                        data.id = id[0].id;
                        return await conn.unsafe(
                            `UPDATE "user" SET "username" = '${data.username}', "email" = '${data.email}', "database" = '${data.database}', "canPost" = ${data.canPost || false}, "canDelete" = ${
                                data.canDelete || false
                            }, "canCreateUser" = ${data.canCreateUser || false}, "canCreateDb" = ${data.canCreateDb || false}, "superAdmin" = ${data.superAdmin || false}, "admin" = ${
                                data.admin || false
                            } WHERE "id" = ${data.id} RETURNING *`
                        );
                    }
                }
            });
    },
    update: async (configName: string, data: Iuser): Promise<Iuser | any> => {
        const conn = config.connection(configName);
        return await conn.unsafe(
            `UPDATE "user" SET "username" = '${data.username}', "email" = '${data.email}', "database" = '${data.database}', "canPost" = ${data.canPost || false}, "canDelete" = ${
                data.canDelete || false
            }, "canCreateUser" = ${data.canCreateUser || false}, "canCreateDb" = ${data.canCreateDb || false}, "superAdmin" = ${data.superAdmin || false}, "admin" = ${
                data.admin || false
            } WHERE "id" = ${data.id} RETURNING *`
        );
    }
};
