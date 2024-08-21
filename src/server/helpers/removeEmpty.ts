/**
 * removeEmpty
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- removeEmpty -----------------------------------!");

  export function removeEmpty(obj: object): object {
      if (Array.isArray(obj))  
        return obj
            .map(v => (v && typeof v === 'object') ? removeEmpty(v) : v)
            .filter(v => !(v == null) ); 
        else return Object.entries(obj)
            .map(([k, v]) => [k, v && typeof v === 'object' ? removeEmpty(v) : v])
            .reduce((a: Record<string, any>, [k, v]) => (v == null ? a : (a[k]=v, a)), {});
    }