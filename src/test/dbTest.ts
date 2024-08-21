/**
 * Knex.js database sensorthings client and query builder for PostgreSQL.
 *
 * @see https://github.com/porsager/postgres
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 */

import postgres from "postgres";
import config from "../server/configuration/configuration.json";
import { identification } from "./integration/constant";

export const dbTest = postgres(`postgres://${identification.username}:${identification.password}@${config["admin" as keyof object]["pg" as keyof object]["host"]}:${config["admin" as keyof object]["pg" as keyof object]["port"] || 5432}/test`,{});
