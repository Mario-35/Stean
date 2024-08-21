/**
 * deepClone
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- deepClone -----------------------------------!");

export const deepClone = (obj: any) => {
    if (obj === null) return null;
    const clone = { ...obj };
    Object.keys(clone).forEach( (key) => (clone[key] = typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key]) );
    return Array.isArray(obj) && obj.length
      ? (clone.length = obj.length) && Array.from(clone)
      : Array.isArray(obj)
      ? Array.from(obj)
      : clone;
  };