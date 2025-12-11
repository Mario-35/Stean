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
export { postgresAdmin } from "./postgresAdmin";
export { formatConfig } from "./formatConfig";
export { adminRoute } from "./adminRoute";
export { exportRoute } from "./exportRoute";
export { logsRoute } from "./logsRoute";
export { docRoute } from "./docRoute";
