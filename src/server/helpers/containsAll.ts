/**
 * containsAll
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export const containsAll = (arr1: string[] | undefined, arr2: string[] | undefined) => (arr1 && arr2 ? arr1.every((i) => arr2.includes(i)) : false);
