/**
 * cardinality
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { idColumnName } from ".";
import { models } from "..";
import { _DEBUG } from "../../constants";
import { ERelations, EentityType } from "../../enums";
import { formatPgTableColumn } from "../../helpers";
import { logging } from "../../log";
import { IrelationInfos, Ientity, Ientities } from "../../types";

const _KeyLink = (entity: Ientity, column: string) => Object.keys(entity.columns).filter((e) => e !== column)[0];

const _Key = (entity: Ientity, search: Ientity) => {
    return Object.keys(entity.columns).includes(`${search.table}_id`)
        ? `${search.table}_id`
        : Object.keys(entity.columns).includes(`${search.singular.toLocaleLowerCase()}_id`)
        ? `${search.singular.toLocaleLowerCase()}_id`
        : Object.keys(entity.columns).includes(`_default_${search.singular.toLocaleLowerCase()}`)
        ? `_default_${search.singular.toLocaleLowerCase()}`
        : "id";
};

const extractEntityNames = (input: string, search: string | string[]): string[] => {
    if (typeof search === "string") search = [search];
    return search.map((e) => input.replace(e, "")).filter((e) => e != input);
};

export const relationInfos = (model: Ientities, entityName: string, relationName: string, loop?: boolean): IrelationInfos => {
    console.log(logging.whereIam(new Error().stack));
    const leftEntity = models.entity(model, entityName);
    const rightEntity = models.entity(model, relationName);
    if (entityName !== relationName && leftEntity && rightEntity) {
        logging.head(`Entity ====> ${leftEntity.name} : ${rightEntity.name}`).to().text();
        const leftRelation = models.entityRelation(model, leftEntity, rightEntity);
        const rightRelationName = models.entityRelationName(rightEntity, [
            entityName,
            leftEntity.name,
            leftEntity.singular,
            entityName.replace(relationName, ""),
            relationName.replace(entityName, "")
        ]);
        const rightRelation = rightRelationName ? rightEntity.relations[rightRelationName] : undefined;
        if (leftRelation && leftRelation.type) {
            let leftKey = _Key(leftEntity, rightEntity);
            let rightKey = _Key(rightEntity, leftEntity);

            const fnError = (): IrelationInfos => {
                return { type: "ERROR", rightKey: "", leftKey: "", entity: undefined, column: "cardinality ERROR", expand: "", link: "" };
            };
            const fnHasMany = () => {
                const complexEntity =
                    models.entity(model, `${leftEntity.name}${rightEntity.name}`) ||
                    models.entity(model, `${rightEntity.name}${leftEntity.name}`) ||
                    models.entity(model, `${leftEntity.singular}${rightEntity.singular}`) ||
                    models.entity(model, `${rightEntity.singular}${leftEntity.singular}`);
                if (complexEntity && rightRelation) {
                    leftKey = _Key(complexEntity, leftEntity);
                    rightKey = _Key(complexEntity, rightEntity);
                    const temp = `${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(complexEntity.table, rightKey)} FROM ${formatPgTableColumn(
                        complexEntity.table
                    )} WHERE ${formatPgTableColumn(complexEntity.table, leftKey)} =$ID)`;
                    return {
                        type: `${leftRelation.type}.${rightRelation.type}`,
                        leftKey: leftKey,
                        rightKey: rightKey,
                        entity: complexEntity,
                        column: idColumnName(leftEntity, rightEntity) || "id",
                        link: temp,
                        expand: temp.replace("$ID", formatPgTableColumn(leftEntity.table, "id"))
                    };
                }
                return fnError();
            };
            console.log(
                logging
                    .message("Search For --> leftRelation : rightRelation", `${leftRelation.type} : ${rightRelation ? rightRelation.type : "undefined"}`)
                    .to()
                    .text()
            );

            switch (leftRelation.type) {
                // === : 1
                case ERelations.defaultUnique:
                    logging.message("leftRelation Type", `====> defaultUnique : ${ERelations.defaultUnique}`).to().text();
                    if (rightRelation && rightRelation.type) {
                        switch (rightRelation.type) {
                            // ===> 1.4
                            case ERelations.hasMany:
                                return {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    leftKey: leftKey,
                                    rightKey: rightKey,
                                    entity: leftEntity,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: `${formatPgTableColumn(rightEntity.table, rightKey)} IN (SELECT ${formatPgTableColumn(rightEntity.table, rightKey)} FROM ${formatPgTableColumn(
                                        rightEntity.table
                                    )} WHERE ${formatPgTableColumn(rightEntity.table, rightKey)} =(SELECT ${formatPgTableColumn(leftEntity.table, leftKey)} FROM ${formatPgTableColumn(
                                        leftEntity.table
                                    )} WHERE id = $ID))`,
                                    expand: `${formatPgTableColumn(rightEntity.table, rightKey)} IN (SELECT ${formatPgTableColumn(rightEntity.table, rightKey)} FROM ${formatPgTableColumn(
                                        rightEntity.table
                                    )} WHERE ${formatPgTableColumn(rightEntity.table, rightKey)} =${formatPgTableColumn(leftEntity.table, leftKey)})`
                                };
                        }
                    }
                    logging.error("Relation Infos", "defaultUnique").toLogAndFile();
                    break;
                // === : 2
                case ERelations.belongsTo:
                    if (rightRelation && rightRelation.type) {
                        switch (rightRelation.type) {
                            // ===> 2.2
                            case ERelations.belongsTo:
                                return {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    leftKey: leftKey,
                                    rightKey: rightKey,
                                    entity: leftEntity,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: `${formatPgTableColumn(rightEntity.table, rightKey)} = (SELECT ${formatPgTableColumn(leftEntity.table, leftKey)} FROM ${formatPgTableColumn(
                                        leftEntity.table
                                    )} WHERE ${formatPgTableColumn(leftEntity.table, "id")} =$ID)`,
                                    expand: `${formatPgTableColumn(rightEntity.table, rightKey)} = ${formatPgTableColumn(leftEntity.table, leftKey)}`
                                };
                            // ===> 2.3
                            case ERelations.belongsToMany:
                                if (leftRelation.entityRelation) {
                                    const tempEntity = models.entity(model, leftRelation.entityRelation);
                                    if (leftRelation && tempEntity && tempEntity.type === EentityType.link && !loop) {
                                        leftKey = _Key(tempEntity, rightEntity);
                                        rightKey = _KeyLink(tempEntity, leftKey);
                                        const temp = `${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(tempEntity.table, leftKey)} FROM ${formatPgTableColumn(
                                            tempEntity.table
                                        )} WHERE ${formatPgTableColumn(tempEntity.table, rightKey)} =$ID)`;
                                        return {
                                            type: `${leftRelation.type}.${rightRelation.type}.1`,
                                            leftKey: leftKey,
                                            rightKey: rightKey,
                                            entity: tempEntity,
                                            column: idColumnName(leftEntity, rightEntity) || "id",
                                            link: temp,
                                            expand: temp.replace("$ID", formatPgTableColumn(leftEntity.table, "id"))
                                        };
                                    }
                                } else if (rightRelationName && !loop && leftEntity.type !== EentityType.link) {
                                    const entityName = relationInfos(model, rightRelationName, rightEntity.name, true);
                                    const complexEntity = models.entity(model, `${rightRelationName}${rightEntity.name}`) || models.entity(model, `${rightEntity.name}${rightRelationName}`);
                                    if (complexEntity && entityName.external) {
                                        leftKey = entityName.external.leftKey;
                                        rightKey = entityName.external.rightKey;
                                        return {
                                            type: `${leftRelation.type}.${rightRelation.type}`,
                                            leftKey: leftKey,
                                            rightKey: rightKey,
                                            entity: leftEntity,
                                            column: idColumnName(leftEntity, rightEntity) || "id",
                                            expand: `${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(rightEntity.table, "id")} FROM ${formatPgTableColumn(
                                                rightEntity.table
                                            )} WHERE ${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(complexEntity.table, rightKey)} FROM ${
                                                complexEntity.table
                                            } WHERE ${formatPgTableColumn(complexEntity.table, leftKey)} = ${formatPgTableColumn(leftEntity.table, leftKey)}))`,
                                            link: `${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(rightEntity.table, "id")} FROM ${formatPgTableColumn(
                                                rightEntity.table
                                            )} WHERE ${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(complexEntity.table, rightKey)} FROM ${
                                                complexEntity.table
                                            } WHERE ${formatPgTableColumn(complexEntity.table, leftKey)} IN (SELECT ${formatPgTableColumn(leftEntity.table, leftKey)} FROM ${
                                                leftEntity.table
                                            } WHERE ${formatPgTableColumn(leftEntity.table, "id")} =$ID)))`
                                        };
                                    }
                                }
                            // ===> 2.4
                            case ERelations.hasMany:
                                return {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    leftKey: leftKey,
                                    rightKey: rightKey,
                                    entity: leftEntity,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: `${formatPgTableColumn(rightEntity.table, rightKey)} = (SELECT ${formatPgTableColumn(leftEntity.table, leftKey)} FROM ${formatPgTableColumn(
                                        leftEntity.table
                                    )} WHERE ${formatPgTableColumn(leftEntity.table, rightKey)} =$ID)`,
                                    expand: `${formatPgTableColumn(rightEntity.table, rightKey)} = ${formatPgTableColumn(leftEntity.table, leftKey)}`
                                };
                        }
                    }
                    logging.error("Relation Infos", "belongsTo").toLogAndFile();

                    break;
                // === : 3
                case ERelations.belongsToMany:
                    if (rightRelation && rightRelation.type) {
                        switch (rightRelation.type) {
                            // ===> 3.2
                            case ERelations.belongsTo:
                                const complexEntity2 =
                                    models.entity(model, `${leftEntity.name}${rightEntity.name}`) ||
                                    models.entity(model, `${rightEntity.name}${leftEntity.name}`) ||
                                    models.entity(model, `${leftEntity.singular}${rightEntity.singular}`) ||
                                    models.entity(model, `${rightEntity.singular}${leftEntity.singular}`);
                                // ===> 3.2.1
                                if (rightRelation.entityRelation) {
                                    const tmp = extractEntityNames(rightRelation.entityRelation, [leftEntity.name, rightEntity.name]);
                                    const tempEntity = models.entity(model, tmp[0]);
                                    if (tempEntity && !loop) {
                                        const tempCardinality = relationInfos(model, leftEntity.name, tempEntity.name, true);
                                        if (complexEntity2 && tempCardinality.entity && complexEntity2.type !== EentityType.link) {
                                            leftKey = _Key(complexEntity2, rightEntity);
                                            rightKey = _Key(complexEntity2, leftEntity);
                                            const temp = `${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(rightEntity.table, "id")} FROM ${formatPgTableColumn(
                                                rightEntity.table
                                            )} WHERE ${formatPgTableColumn(rightEntity.table, tempCardinality.rightKey)} IN (SELECT ${formatPgTableColumn(
                                                tempCardinality.entity.table,
                                                tempCardinality.rightKey
                                            )} FROM ${formatPgTableColumn(tempCardinality.entity.table)} WHERE ${formatPgTableColumn(tempCardinality.entity.table, tempCardinality.leftKey)} =$ID))`;
                                            return {
                                                type: `${leftRelation.type}.${rightRelation.type}.1`,
                                                leftKey: leftKey,
                                                rightKey: rightKey,
                                                external: {
                                                    leftKey: tempCardinality.leftKey,
                                                    rightKey: tempCardinality.rightKey,
                                                    table: tempCardinality.entity.table
                                                },
                                                entity: complexEntity2,
                                                column: idColumnName(leftEntity, rightEntity) || "id",
                                                link: temp,
                                                expand: temp.replace("$ID", formatPgTableColumn(leftEntity.table, "id"))
                                            };
                                        }
                                    }
                                }

                                // ===> 3.2.2
                                else if (complexEntity2) {
                                    leftKey = _Key(complexEntity2, rightEntity);
                                    rightKey = _Key(complexEntity2, leftEntity);
                                    const temp = `${formatPgTableColumn(rightEntity.table, rightKey)} IN (SELECT ${formatPgTableColumn(
                                        complexEntity2.table,
                                        idColumnName(complexEntity2, rightEntity) || "id"
                                    )} FROM ${formatPgTableColumn(complexEntity2.table)} WHERE ${formatPgTableColumn(complexEntity2.table, idColumnName(complexEntity2, leftEntity) || "id")} =$ID)`;
                                    return {
                                        type: `${leftRelation.type}.${rightRelation.type}.2`,
                                        leftKey: leftKey,
                                        rightKey: rightKey,
                                        entity: complexEntity2,
                                        column: idColumnName(leftEntity, rightEntity) || "id",
                                        link: temp,
                                        expand: temp.replace("$ID", formatPgTableColumn(complexEntity2.table, rightKey))
                                    };
                                }
                            // ===> 3.3
                            case ERelations.belongsToMany:
                                return fnHasMany();
                            // ===> 3.5
                            case ERelations.hasOne:
                                return fnHasMany();
                        }
                    }
                    logging.error("Relation Infos", "belongsToMany").toLogAndFile();

                    break;
                // === : 4
                case ERelations.hasMany:
                    if (rightRelation && rightRelation.type) {
                        switch (rightRelation.type) {
                            // ===> 4.1
                            case ERelations.defaultUnique:
                                const temp1 = `${formatPgTableColumn(rightEntity.table, leftKey)} IN (SELECT ${formatPgTableColumn(rightEntity.table, leftKey)} FROM ${formatPgTableColumn(
                                    rightEntity.table
                                )} WHERE ${formatPgTableColumn(rightEntity.table, rightKey)} =$ID)`;
                                return {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    leftKey: leftKey,
                                    rightKey: rightKey,
                                    entity: leftEntity,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: temp1,
                                    expand: temp1.replace("$ID", formatPgTableColumn(leftEntity.table, leftKey))
                                };
                            // ===> 4.2
                            case ERelations.belongsTo:
                                // const temp2 = `${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(rightEntity.table, "id")} FROM ${formatPgTableColumn(rightEntity.table)} WHERE ${formatPgTableColumn(rightEntity.table, rightKey)} =$ID)`;
                                const temp2 = `${formatPgTableColumn(rightEntity.table, rightKey)} =$ID`;
                                return {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    rightKey: rightKey,
                                    leftKey: leftKey,
                                    entity: rightEntity,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: temp2,
                                    expand: temp2.replace("$ID", formatPgTableColumn(leftEntity.table, leftKey))
                                };

                            // ===> 4.4
                            case ERelations.hasMany:
                                return fnHasMany();
                        }
                    }
                    logging.error("Relation Infos", "hasMany").toLogAndFile();
                    break;
                // === : 5
                case ERelations.hasOne:
                    if (rightRelation && rightRelation.type) {
                        switch (rightRelation.type) {
                            // ===> 5.2
                            case ERelations.belongsTo:
                            // ===> 5.3
                            case ERelations.belongsToMany:
                                return {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    leftKey: leftKey,
                                    rightKey: rightKey,
                                    entity: leftEntity,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: `${formatPgTableColumn(rightEntity.table, rightKey)} = (SELECT ${formatPgTableColumn(leftEntity.table, leftKey)} FROM ${formatPgTableColumn(
                                        leftEntity.table
                                    )} WHERE ${formatPgTableColumn(leftEntity.table, leftKey)} =$ID)`,
                                    expand: `${formatPgTableColumn(rightEntity.table, rightKey)} = ${formatPgTableColumn(leftEntity.table, leftKey)}`
                                };
                            // ===> 5.3
                            // return {
                            //     type: `${leftRelation.type}.${rightRelation.type}`,
                            //     leftKey: leftKey,
                            //     rightKey: rightKey,
                            //     entity: leftEntity,
                            //     column: idColumnName(leftEntity, rightEntity) || "id",
                            //     link: `${formatPgTableColumn(rightEntity.table, rightKey)} = (SELECT ${formatPgTableColumn(leftEntity.table, leftKey)} FROM ${formatPgTableColumn(
                            //         leftEntity.table
                            //     )} WHERE ${formatPgTableColumn(leftEntity.table, leftKey)} =$ID)`,
                            //     expand: `${formatPgTableColumn(rightEntity.table, rightKey)} = ${formatPgTableColumn(leftEntity.table, leftKey)}`
                            // };
                            // ===> 5.5
                            case ERelations.hasOne:
                                return {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    leftKey: leftKey,
                                    rightKey: rightKey,
                                    entity: leftEntity,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: rightEntity.columns[leftKey]
                                        ? `${formatPgTableColumn(rightEntity.table, rightKey)} = (SELECT ${formatPgTableColumn(leftEntity.table, leftKey)} FROM ${formatPgTableColumn(
                                              leftEntity.table
                                          )} WHERE ${formatPgTableColumn(leftEntity.table, leftEntity.columns[rightKey] ? rightKey : leftKey)} =$ID)`
                                        : `${formatPgTableColumn(rightEntity.table, rightKey)} =$ID`,
                                    expand: `${formatPgTableColumn(rightEntity.table, rightKey)} = ${formatPgTableColumn(leftEntity.table, leftKey)}`
                                };
                        }
                    }
                    logging.error("Relation Infos", "hasOne").toLogAndFile();
                    break;
            }
        }
        logging.message("Relation Infos", `[${leftEntity.name} ${leftRelation?.type}] : [${rightEntity.name} ${rightRelation?.type}]`).toLogAndFile();
    }

    return { type: "ERROR", rightKey: "", leftKey: "", entity: undefined, column: "cardinality ERROR", expand: "", link: "" };
};
