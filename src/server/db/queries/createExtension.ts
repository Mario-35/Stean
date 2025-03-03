/**
 * createExtension.
 *
 * @copyright 2020-present Inrae
 * @review 27-01-2024
 * @author mario.adam@inrae.fr
 *
 */

export const createExtension = (name: string): string => `CREATE EXTENSION IF NOT EXISTS ${name}`;
