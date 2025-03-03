/**
 * postSqlFromPgVisitor
 *
 * @copyright 2022-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { doubleQuotesString, getBigIntFromString } from "../../../helpers";
import { Ientity, IqueryMaker } from "../../../types";
import { EConstant, EOperation, EOptions, ETable } from "../../../enums";
import { asJson } from "../../../db/queries";
import { models } from "../../../models";
import { log } from "../../../log";
import { createInsertValues, createUpdateValues, relationInfos } from "../../../models/helpers";
import { apiAccess } from "../../../db/dataAccess";
import * as entities from "../../../db/entities";
import { PgVisitor } from "..";
import { DATASTREAM } from "../../../models/entities";
export function postSqlFromPgVisitor(datas: Record<string, any>, src: PgVisitor): string | undefined {
    const formatInsertEntityData = (entity: string, datas: object, main: PgVisitor): Record<string, any> => {
        const goodEntity = models.getEntityName(main.ctx.service, entity);
        if (goodEntity && goodEntity in entities) {
            try {
                const objectEntity = new apiAccess(main.ctx, entity);
                const tempDatas = objectEntity.formatDataInput(datas);
                if (tempDatas) return tempDatas;
            } catch (error) {
                console.log(error);
            }
        }
        return datas;
    };
    console.log(log.whereIam());
    let sqlResult = "";
    const queryMaker: IqueryMaker = {};
    const tempEntity = src.entity;
    const postEntity = tempEntity && tempEntity.name == "CreateFile" ? DATASTREAM : tempEntity;
    if (!postEntity) return;
    const postParentEntity: Ientity | undefined = src.parentEntity ? src.parentEntity : undefined;
    const names: Record<string, string> = {
        [postEntity.table]: postEntity.table
    };
    let level = 0;
    const allFields = "*";
    const getRelationNameFromEntity = (source: Ientity, from: Ientity): string | undefined => {
        return Object.keys(source.relations).includes(from.name) ? from.name : Object.keys(source.relations).includes(from.singular) ? from.singular : undefined;
    };

    /**
     *
     * @param query query for the query not in as
     * @returns
     */
    const onConflict = (element: string): string => {
        let conflictNames = Object.keys(queryMaker[element].datas).filter((e) => queryMaker[element].entity.columns[e].create.includes("UNIQUE"));
        if (conflictNames.length <= 0 && src.id) conflictNames = Object.keys(queryMaker[element].datas);
        return conflictNames.length <= 0 ? "" : ` ON CONFLICT ("${conflictNames.join('","')}") do update set ${createUpdateValues(queryMaker[element].entity, queryMaker[element].datas)}`;
    };
    const queryMakerToString = (query: string): string => {
        const returnValue: string[] = [query];
        const links: { [key: string]: string[] } = {};
        const sorting: string[] = [];
        Object.keys(queryMaker).forEach((element: string) => {
            Object.keys(queryMaker).forEach((elem: string) => {
                if (JSON.stringify(queryMaker[elem].datas).includes(`select ${element}`)) {
                    if (links[elem]) links[elem].push(element);
                    else links[elem] = [element];
                }
            });
        });
        //  pre sorting for some case like multidatastreams
        Object.keys(links).forEach((elem: string) => {
            Object.keys(links).forEach((subElem: string) => {
                if (links[elem].includes(subElem) && !sorting.includes(subElem)) sorting.push(subElem);
            });
        });
        // sorting
        Object.keys(queryMaker).forEach((elem: string) => {
            if (Object.keys(links).includes(elem)) {
                if (!sorting.includes(elem)) sorting.push(elem);
            } else {
                sorting.unshift(elem);
            }
        });
        // LOOP on sorting
        sorting.forEach((element: string) => {
            if (queryMaker[element].datas.hasOwnProperty(EConstant.id)) {
                const searchId = queryMaker[element].datas[EConstant.id as keyof object];
                returnValue.push(`, ${element} AS (select verifyId('${queryMaker[element].entity.table}', ${searchId}) as id)`);
            } else if (queryMaker[element].datas.hasOwnProperty(EConstant.name)) {
                const searchByName = queryMaker[element].datas[EConstant.name as keyof object];
                returnValue.push(`, ${element} AS (select "id" from "${queryMaker[element].entity.table}" where "name" = '${searchByName}')`);
            } else {
                returnValue.push(`, ${element} AS (`);
                if (src.id) {
                    if (queryMaker[element].type == EOperation.Association) {
                        returnValue.push(`INSERT INTO "${queryMaker[element].entity.table}" ${createInsertValues(src.ctx, formatInsertEntityData(queryMaker[element].entity.table, queryMaker[element].datas, src))}${onConflict(element)} WHERE "${queryMaker[element].entity.table}"."${queryMaker[element].keyId}" = ${BigInt(src.id).toString()}`);
                    } else returnValue.push(`UPDATE "${queryMaker[element].entity.table}" SET ${createUpdateValues(queryMaker[element].entity, queryMaker[element].datas)} WHERE "${queryMaker[element].entity.table}"."${queryMaker[element].keyId}" = (select verifyId('${queryMaker[element].entity.table}', ${src.id}) as id)`);
                } else returnValue.push(`INSERT INTO "${queryMaker[element].entity.table}" ${createInsertValues(src.ctx, formatInsertEntityData(queryMaker[element].entity.table, queryMaker[element].datas, src))}${queryMaker[element].entity.type === ETable.link ? onConflict(element) : ""}`);

                returnValue.push(`RETURNING ${postEntity.table == queryMaker[element].entity.table ? allFields : queryMaker[element].keyId})`);
            }
        });
        return returnValue.join(EConstant.return).replace(/\'@/g, "").replace(/\@'/g, "");
    };

    /**
     *
     * @param datas datas
     * @param entity entity for the datas if not root entity
     * @param parentEntity parent entity for the datas if not root entity
     * @returns result
     */
    const start = (datas: object, entity?: Ientity, parentEntity?: Ientity): object | undefined => {
        console.log(log.debug_head(`start level ${level++}`));
        const returnValue: Record<string, any> = {};
        entity = entity ? entity : postEntity;
        parentEntity = parentEntity ? parentEntity : postParentEntity ? postParentEntity : postEntity;

        for (const key in datas) {
            if (entity && !Object.keys(entity.relations).includes(key)) {
                returnValue[key] = typeof datas[key as keyof object] === "object" ? JSON.stringify(datas[key as keyof object]) : datas[key as keyof object];
                delete datas[key as keyof object];
            }
        }
        /**
         *
         * @param inputNameEntity {string} name of the entity
         * @returns name of th next entity {inputNameEntity1}
         */
        const createName = (inputNameEntity: string): string => {
            let number = 0;
            if (names[inputNameEntity]) {
                const numbers = names[inputNameEntity].match(/[0-9]/g);
                number = numbers !== null ? Number(numbers.join("")) : 0;
            }
            return `${inputNameEntity}${(number + 1).toString()}`;
        };

        /**
         *  add or make query entry
         * @param name name
         * @param tableName table nae for insert
         * @param datas datas to insert string if key is send or object
         * @param key key of the value
         */
        const addToQueryMaker = (type: EOperation, name: string, entity: Ientity, datas: string | Record<string, any>, keyId: string, key: string | undefined): void => {
            const isTypeString = typeof datas === "string";
            if (queryMaker.hasOwnProperty(name)) {
                if (key && isTypeString) {
                    // @ts-ignore
                    queryMaker[name].datas[key] = datas;
                    queryMaker[name].keyId = keyId;
                } else if (!isTypeString) {
                    if (queryMaker[name].type == EOperation.Table || queryMaker[name].type == EOperation.Relation) queryMaker[name].datas = Object.assign(queryMaker[name].datas, datas);
                    queryMaker[name].keyId = keyId;

                    if (queryMaker[name].type == EOperation.Association)
                        queryMaker[createName(name)] = {
                            type: queryMaker[name].type,
                            entity: queryMaker[name].entity,
                            datas: datas,
                            keyId: queryMaker[name].keyId
                        };
                }
            } else {
                if (key && isTypeString)
                    queryMaker[name] = {
                        type: type,
                        entity: entity,
                        datas: { [key]: datas },
                        keyId: keyId
                    };
                else if (!isTypeString)
                    queryMaker[name] = {
                        type: type,
                        entity: entity,
                        datas: datas,
                        keyId: keyId
                    };
            }
        };

        /**
         *
         * @param subEntity {Ientity} entity to use
         * @param subParentEntity {Ientity} entity parent
         */
        const addAssociation = (subEntity: Ientity, subParentEntity: Ientity) => {
            console.log(log.debug_infos(`addAssociation in ${subEntity.name} for parent`, subParentEntity.name));
            const relationName = getRelationNameFromEntity(subEntity, subParentEntity);
            const parentRelationName = getRelationNameFromEntity(subParentEntity, subEntity);
            if (parentRelationName && relationName) {
                const relCardinality = relationInfos(src.ctx, subEntity.name, relationName);
                const parentCardinality = relationInfos(src.ctx, subParentEntity.name, subEntity.name);
                console.log(log.debug_infos(`Found a parent relation in ${subEntity.name}`, subParentEntity.name));
                if (relCardinality.entity && parentCardinality.entity && relCardinality.entity.table == parentCardinality.entity.table && relCardinality.entity.table == subEntity.table) {
                    console.log(log.debug_infos("Found a relation to do in sub query", subParentEntity.name));
                    const tableName = names[subEntity.table];
                    const parentTableName = names[subParentEntity.table];
                    addToQueryMaker(EOperation.Relation, tableName, subEntity, `@(select ${parentTableName}.id from ${parentTableName})@`, parentCardinality.leftKey, parentCardinality.rightKey);
                } else if (relCardinality.entity && parentCardinality.entity && relCardinality.entity.table == parentCardinality.entity.table) {
                    if (relCardinality.entity.table == subParentEntity.table) {
                        const tableName = names[subEntity.table];
                        const parentTableName = names[subParentEntity.table];
                        console.log(log.debug_infos(`Add parent relation ${tableName} in`, parentTableName));
                        addToQueryMaker(EOperation.Relation, parentTableName, subParentEntity, `@(select ${tableName}.id from ${tableName})@`, parentCardinality.leftKey, relCardinality.rightKey);
                    } else if (relCardinality.entity && relCardinality.entity.table != subParentEntity.table && relCardinality.entity.table != subEntity.table) {
                        const tableName = names[subEntity.table];
                        const parentTableName = names[subParentEntity.table];
                        console.log(log.debug_infos(`Add Table association ${tableName} in`, parentTableName));
                        addToQueryMaker(
                            EOperation.Association,
                            relCardinality.entity.table,
                            relCardinality.entity,
                            {
                                [`${subEntity.table}_id`]: `@(select ${tableName}.id from ${tableName})@`,
                                [`${subParentEntity.table}_id`]: `@(select ${parentTableName}.id from ${parentTableName})@`
                            },
                            relCardinality.entity.columns[relCardinality.rightKey].create.includes("UNIQUE") ? relCardinality.rightKey : relCardinality.leftKey,
                            undefined
                        );
                    }
                } else {
                    const tableName = names[subEntity.table];
                    const parentTableName = names[subParentEntity.table];
                    console.log(log.debug_infos(`Add Relation ${tableName} in`, parentTableName));
                    addToQueryMaker(
                        EOperation.Table,
                        parentTableName,
                        subParentEntity,
                        {
                            [relCardinality.rightKey]: `@(select ${tableName}.id from ${tableName})@`
                        },
                        relCardinality.leftKey,
                        undefined
                    );
                }
            }
        };
        /**
         *
         * @param key key Name
         * @param value Datas to process
         */
        const subBlock = (key: string, value: object) => {
            const entityNameSearch = models.getEntityName(src.ctx.service, key);
            if (entityNameSearch) {
                const newEntity = src.ctx.model[entityNameSearch];
                const name = createName(newEntity.table);
                names[newEntity.table] = name;
                const test = start(value, newEntity, entity);
                if (test) {
                    addToQueryMaker(EOperation.Table, name, newEntity, test, "id", undefined);
                    level--;
                }
                if (entity) addAssociation(newEntity, entity);
            }
        };

        // Main loop
        if (entity && parentEntity) {
            for (const key in datas) {
                if (Array.isArray(datas[key as keyof object])) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    Object.entries(datas[key as keyof object]).forEach(([_key, value]) => {
                        if (entity && parentEntity && Object.keys(entity.relations).includes(key)) {
                            console.log(log.debug_infos(`Found a relation for ${entity.name}`, key));
                            subBlock(key, value as object);
                        } else {
                            console.log(log.debug_infos(`data ${key}`, datas[key as keyof object]));
                            returnValue[key as keyof object] = datas[key as keyof object];
                        }
                    });
                } else if (typeof datas[key as keyof object] === "object") {
                    if (Object.keys(entity.relations).includes(key)) {
                        console.log(log.debug_infos(`Found a object relation for ${entity.name}`, key));
                        subBlock(key, datas[key as keyof object]);
                    }
                } else returnValue[key as keyof object] = datas[key as keyof object];
            }
        }
        return returnValue;
    };

    if (src.parentEntity) {
        const entityName = src.parentEntity.name;
        console.log(log.debug_infos("Found entity : ", entityName));
        const callEntity = entityName ? src.ctx.model[entityName] : undefined;
        const id: bigint | undefined = typeof src.parentId == "string" ? getBigIntFromString(src.parentId) : src.parentId;
        if (entityName && callEntity && id && id > 0) {
            const relationName = getRelationNameFromEntity(postEntity, callEntity);
            if (relationName) datas[relationName] = { "@iot.id": id.toString() };
        }
    }
    const root = start(datas);

    if ((names[postEntity.table] && queryMaker[postEntity.table] && queryMaker[postEntity.table].datas) || root === undefined) {
        queryMaker[postEntity.table].datas = Object.assign(root as object, queryMaker[postEntity.table].datas);
        queryMaker[postEntity.table].keyId = src.id ? "id" : "*";
        sqlResult = queryMakerToString(`WITH "log_request" AS (${EConstant.return}${EConstant.tab}SELECT srid FROM ${doubleQuotesString(EConstant.voidtable)} LIMIT 1${EConstant.return})`);
    } else {
        sqlResult = queryMakerToString(
            src.id
                ? root && Object.entries(root).length > 0
                    ? `WITH ${postEntity.table} AS (${EConstant.return}${EConstant.tab}UPDATE ${doubleQuotesString(postEntity.table)}${EConstant.return}${EConstant.tab}SET ${createUpdateValues(postEntity, root)} WHERE "id" = (${EConstant.return}${EConstant.tab}select verifyId('${postEntity.table}', ${src.id}) as id) RETURNING ${allFields})`
                    : `WITH ${postEntity.table} AS (${EConstant.return}${EConstant.tab}SELECT * FROM ${doubleQuotesString(postEntity.table)}${EConstant.return}${EConstant.tab}WHERE "id" = ${src.id.toString()})`
                : `WITH ${postEntity.table} AS (${EConstant.return}${EConstant.tab}INSERT INTO ${doubleQuotesString(postEntity.table)} ${createInsertValues(src.ctx, formatInsertEntityData(postEntity.name, root, src))} RETURNING ${allFields})`
        );
    }
    const temp = src.toPgQuery();
    if (temp)
        sqlResult += asJson({
            query: `SELECT ${temp && temp.select ? temp.select : "*"} FROM ${names[postEntity.table]} ${temp && temp.groupBy ? `GROUP BY ${temp.groupBy}` : ""}`,
            singular: false,
            strip: src.ctx.service.options.includes(EOptions.stripNull),
            count: false
        });
    return sqlResult;
}
