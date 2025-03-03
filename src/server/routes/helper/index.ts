/**
 * Routes Helpers.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export const emailIsValid = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// at least one number, one lowercase and one uppercase letter
// at least six characters that are letters, numbers or the underscore
export const checkPassword = (str: string): boolean => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/.test(str);
export const sqlStopDbName = (dbName: string): string => `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = ${dbName};`;
export { decodeUrl } from "./decodeUrl";
export { testRoute } from "./testRoute";
export { postgresAdmin } from "./postgresAdmin";
export { formatConfig } from "./formatConfig";
export { adminRoute } from "./adminRoute";
export { exportRoute } from "./exportRoute";
export { updateRoute } from "./updateRoute";
export { logsRoute } from "./logsRoute";
