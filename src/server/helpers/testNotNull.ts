/**
 * testNotNull
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- testNotNull -----------------------------------!");

/**
 *
 * @param input thing to test
 * @returns bollean test
 */
export const isNull = <T>(input: T): boolean => {
    switch (typeof input) {
        case "string":
            if (input && input != "" && input != null) return true;
        case "object":
            if (input && Object.keys(input).length > 0) return true;    
        default:
            return false;
    } 
};
