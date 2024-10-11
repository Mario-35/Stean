/**
 * getModelVersion
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import { models } from "..";
import { Ientity, Iservice } from "../../types";
export function relationKey(service: Iservice , entity: Ientity, relation: Ientity | string): string {
    const tmp = models.getEntity(service, relation);
    return tmp && Object.keys(entity.columns).includes(`${tmp.table}_id`) ? `${tmp.table}_id` : "id";
  }