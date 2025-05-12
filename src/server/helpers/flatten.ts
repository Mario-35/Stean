/**
 * flatten
 *
 * @copyright 2025-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export function flatten(obj: object) {
    return Object.keys(obj).reduce((acc, current) => {
        const _key = `${current}`;
        const currentValue = obj[current as keyof object];
        if (Array.isArray(currentValue) || Object(currentValue) === currentValue) {
            Object.assign(acc, flatten(currentValue));
        } else {
            acc[_key as keyof object] = currentValue;
        }
        return acc;
    }, {});
}
