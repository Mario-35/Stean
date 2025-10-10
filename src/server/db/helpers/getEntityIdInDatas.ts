/**
 * getEntityIdInDatas
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant } from "../../enums";
import { getBigIntFromString } from "../../helpers";
import { RootPgVisitor } from "../../odata/visitor";

export const getEntityIdInDatas = (dataInput: Record<string, string>, pg: RootPgVisitor) => {
    const res: { [key: string]: number | BigInt | undefined } = {};
    if (pg.entity)
        Object.keys(pg.entity.relations).forEach((elem) => {
            if (dataInput[elem]) {
                res[elem] =
                    dataInput[elem] && dataInput[elem] != null && dataInput[elem][EConstant.id as keyof object]
                        ? BigInt(dataInput[elem][EConstant.id as keyof object])
                        : pg.parentEntity && (pg.parentEntity.singular === elem || pg.parentEntity.name === elem)
                        ? getBigIntFromString(pg.parentId)
                        : undefined;
            }
        });
    return res;
};
