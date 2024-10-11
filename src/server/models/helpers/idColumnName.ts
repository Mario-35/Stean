/**
 * idColumnName
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { Ientity } from "../../types";
/**
 * 
 * @param entity Entity
 * @param search string or Entity
 * @returns String or undefined
 */
export const idColumnName = (entity: Ientity, search: string | Ientity) => {
	if (typeof search === "string") return Object.keys(entity.columns).includes(search) ? search : undefined;
	else {
		return Object.keys(entity.columns).includes(`${search.table}_id`) ?
			`${search.table}_id` :
			Object.keys(entity.columns).includes(`${search.singular.toLocaleLowerCase()}_id`) ?
			`${search.singular.toLocaleLowerCase()}_id` :
			Object.keys(entity.columns).includes(`_default_${search.singular.toLocaleLowerCase()}`) ?
			`_default_${search.singular.toLocaleLowerCase()}` :
			undefined;
	}
}