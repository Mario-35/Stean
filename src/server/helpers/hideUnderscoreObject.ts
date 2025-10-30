/**
 * hideUnderscoreObject
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export function hideUnderscoreObject(obj: object) {
    return Object.entries(obj).filter((v, k) => k[0 as keyof object] !== "_");
}
