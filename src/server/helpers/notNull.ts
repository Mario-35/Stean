/**
 * isNullOrNotNull
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
const isNullOrNotNull = (input: any, ret: boolean): boolean => {
    switch (typeof input) {
      case "string":
        if (input && input != "" && input != null) return ret;
      case "object":
        if (input && Object.keys(input).length > 0) return ret;
      case "number":
        if ((input || input === 0) && input >= 0) return ret;
      default:
        return !ret;
    }
  };
  
export const notNull = (input: any): boolean => isNullOrNotNull(input, true);
  
