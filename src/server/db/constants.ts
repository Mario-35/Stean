/**
 * Constants for DataBase
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export type _STREAM = "Datastream" | "MultiDatastream" | undefined;


export const _CREATE_SERVICE_TABLE = `CREATE TABLE public.services (
    "name" text NOT NULL,
    "datas" jsonb NULL,
    "stats" jsonb NULL,
    CONSTRAINT services_unik_name UNIQUE (name)
  ); CREATE INDEX services_name ON public.services USING btree (name);`
