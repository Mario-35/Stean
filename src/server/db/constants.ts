/**
 * Constants for DataBase
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Constants for DataBase -----------------------------------!");

export const _RIGHTS = "SUPERUSER CREATEDB NOCREATEROLE INHERIT LOGIN NOREPLICATION NOBYPASSRLS CONNECTION LIMIT -1";
export const _ID = '@iot.id'
export const _NAVLINK= '@iot.navigationLink'
export const _SELFLINK= '@iot.selfLink'
export type _STREAM = "Datastream" | "MultiDatastream" | undefined;
