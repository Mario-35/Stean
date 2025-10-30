/**
 * postSqlFromPgVisitor
 *
 * @copyright 2022-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { doubleQuotes, getBigIntFromString, reorganiseRecord, simpleQuotes } from "../../../helpers";
import { Id, Ientity, IqueryMaker } from "../../../types";
import { EConstant, EOperation, EOptions, EentityType } from "../../../enums";
import { models } from "../../../models";
import { logging } from "../../../log";
import { createInsertValues, createUpdateValues, getUniques, getIsId, relationInfos } from "../../../models/helpers";
import { apiAccess } from "../../../db/dataAccess";
import { PgVisitor } from "..";
import { DATASTREAM } from "../../../models/entities";
import { _DEBUG } from "../../../constants";
import { queries } from "../../../db/queries";

export function postSqlFromPgVisitor(datas: Record<string, any>, src: PgVisitor): string | undefined {
    datas = reorganiseRecord(datas);
    const formatInsertEntityData = (entity: string, datas: object, main: PgVisitor): Record<string, any> => {
        const goodEntity = models.getEntityName(main.ctx.model, entity);
        if (goodEntity && goodEntity in src.ctx.model) {
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
    console.log(logging.whereIam(new Error().stack));
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
    const onConflict = (element: string, nothing?: boolean): string => {
        console.log(logging.whereIam(new Error().stack));
        let conflictNames = Object.keys(queryMaker[element].datas).filter((e) => queryMaker[element].entity.columns[e].create.includes("UNIQUE"));
        if (conflictNames.length <= 0 && src.id) conflictNames = Object.keys(queryMaker[element].datas);
        return conflictNames.length <= 0
            ? ""
            : `\n\tON CONFLICT ("${conflictNames.join('","')}") DO ${nothing ? "NOTHING " : `UPDATE SET ${createUpdateValues(queryMaker[element].entity, queryMaker[element].datas)}`}`;
    };

    const essai = (element: string): string[] => {
        console.log(logging.whereIam(new Error().stack));
        let conflictNames = Object.keys(queryMaker[element].datas).filter((e) => queryMaker[element].entity.columns[e].create.includes("UNIQUE"));
        return conflictNames;
    };

    const queryMakerToString = (query: string): string => {
        const returnValue: string[] = [query];
        const links: { [key: string]: string[] } = {};
        const sorting: string[] = [];
        Object.keys(queryMaker).forEach((element: string) => {
            Object.keys(queryMaker).forEach((elem: string) => {
                if (JSON.stringify(queryMaker[elem].datas).includes(`SELECT ${element}`)) {
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
            const canSpec = getIsId(queryMaker[element].entity) && getUniques(queryMaker[element].entity).length > 0;
            const isMain = postEntity.table == queryMaker[element].entity.table;
            const retCol = isMain ? allFields : queryMaker[element].keyId === "all" ? "*" : doubleQuotes(queryMaker[element].keyId);

            if (queryMaker[element].datas.hasOwnProperty(EConstant.id)) {
                const searchId = queryMaker[element].datas[EConstant.id as keyof object];
                returnValue.push(`, ${element} AS (SELECT verifyId('${queryMaker[element].entity.table}', ${searchId}) AS id)`);
            } else if (queryMaker[element].datas.hasOwnProperty(EConstant.name)) {
                const searchByName = queryMaker[element].datas[EConstant.name as keyof object];
                returnValue.push(`, ${element} AS (SELECT "id" FROM "${queryMaker[element].entity.table}" WHERE "name" = '${searchByName}')`);
            } else {
                returnValue.push(`,${canSpec === true && isMain === false ? "insert" : ""}${element} AS (`);
                if (src.id) {
                    if (queryMaker[element].type == EOperation.Association) {
                        returnValue.push(
                            `\tINSERT INTO "${queryMaker[element].entity.table}" ${createInsertValues(
                                queryMaker[element].entity,
                                formatInsertEntityData(queryMaker[element].entity.table, queryMaker[element].datas, src)
                            )}${onConflict(element)} WHERE "${queryMaker[element].entity.table}"."${queryMaker[element].keyId}" = ${BigInt(src.id).toString()}`
                        );
                    } else
                        returnValue.push(
                            `\tUPDATE "${queryMaker[element].entity.table}" SET ${createUpdateValues(queryMaker[element].entity, queryMaker[element].datas)} WHERE "${
                                queryMaker[element].entity.table
                            }"."${queryMaker[element].keyId}" = (SELECT verifyId('${queryMaker[element].entity.table}', ${src.id}) AS id)`
                        );
                } else {
                    returnValue.push(
                        `\tINSERT INTO "${queryMaker[element].entity.table}" ${createInsertValues(
                            queryMaker[element].entity,
                            formatInsertEntityData(queryMaker[element].entity.table, queryMaker[element].datas, src)
                        )}${queryMaker[element].entity.type === EentityType.link ? onConflict(element) : ""}`
                    );
                }

                if (canSpec === true && !src.id && isMain === false) {
                    returnValue.push(
                        `${
                            canSpec == true ? "\tON CONFLICT DO NOTHING" : ""
                        } RETURNING ${retCol}),\n${element} AS (\n\tSELECT ${retCol} FROM "insert${element}" WHERE EXISTS (SELECT ${retCol} FROM "insert${element}")\n\tUNION ALL\n\tSELECT ${retCol} FROM "${
                            queryMaker[element].entity.table
                        }" WHERE ${essai(element)
                            .map((e) => `${doubleQuotes(e)} = ${simpleQuotes(queryMaker[element].datas[e as keyof object])}`)
                            .join(" AND ")} AND NOT EXISTS (SELECT ${retCol} FROM "insert${element}"))`
                    );
                } else returnValue.push(`RETURNING ${retCol})`);
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
        console.log(
            logging
                .head(`start level ${level + 1}`)
                .to()
                .text()
        );
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
            logging.message(`addAssociation in ${subEntity.name} for parent`, subParentEntity.name).toLogAndFile();
            const relationName = getRelationNameFromEntity(subEntity, subParentEntity);
            const parentRelationName = getRelationNameFromEntity(subParentEntity, subEntity);
            if (parentRelationName && relationName) {
                const relCardinality = relationInfos(src.ctx.model, subEntity.name, relationName);
                const parentCardinality = relationInfos(src.ctx.model, subParentEntity.name, subEntity.name);
                logging.message(`Found a parent relation in ${subEntity.name}`, subParentEntity.name).toLogAndFile();
                if (relCardinality.entity && parentCardinality.entity && relCardinality.entity.table == parentCardinality.entity.table && relCardinality.entity.table == subEntity.table) {
                    logging.message("Found a relation to do in sub query", subParentEntity.name).toLogAndFile();
                    const tableName = names[subEntity.table];
                    const parentTableName = names[subParentEntity.table];
                    addToQueryMaker(EOperation.Relation, tableName, subEntity, `@(SELECT ${parentTableName}.id FROM ${parentTableName})@`, parentCardinality.leftKey, parentCardinality.rightKey);
                } else if (relCardinality.entity && parentCardinality.entity && relCardinality.entity.table == parentCardinality.entity.table) {
                    if (relCardinality.entity.table == subParentEntity.table) {
                        const tableName = names[subEntity.table];
                        const parentTableName = names[subParentEntity.table];
                        logging.message(`Add parent relation ${tableName} IN`, parentTableName).toLogAndFile();
                        addToQueryMaker(EOperation.Relation, parentTableName, subParentEntity, `@(SELECT ${tableName}.id from ${tableName})@`, parentCardinality.leftKey, relCardinality.rightKey);
                    } else if (relCardinality.entity && relCardinality.entity.table != subParentEntity.table && relCardinality.entity.table != subEntity.table) {
                        const tableName = names[subEntity.table];
                        const parentTableName = names[subParentEntity.table];
                        logging.message(`Add Table association ${tableName} IN`, parentTableName).toLogAndFile();
                        addToQueryMaker(
                            EOperation.Association,
                            relCardinality.entity.table,
                            relCardinality.entity,
                            {
                                [`${subEntity.table}_id`]: `@(SELECT ${tableName}.id FROM ${tableName})@`,
                                [`${subParentEntity.table}_id`]: `@(SELECT ${parentTableName}.id FROM ${parentTableName})@`
                            },
                            relCardinality.entity.columns[relCardinality.rightKey].create.includes("UNIQUE") ? relCardinality.rightKey : relCardinality.leftKey,
                            undefined
                        );
                    }
                } else {
                    const tableName = names[subEntity.table];
                    const parentTableName = names[subParentEntity.table];
                    if (entity.columns.hasOwnProperty(`_default_${subEntity.table}`) && entity.columns[`_default_${subEntity.table}`].entityRelation === subEntity.name) {
                        const tableName = names[subEntity.table];
                        const parentTableName = names[subParentEntity.table];
                        logging.message(`Add default relation ${tableName} IN`, parentTableName).toLogAndFile();
                        addToQueryMaker(EOperation.Relation, parentTableName, subParentEntity, `@(SELECT ${tableName}.id from ${tableName})@`, parentCardinality.leftKey, relCardinality.rightKey);
                    } else if (entity.relations[subEntity.name].entityRelation === subEntity.relations[entity.name].entityRelation) {
                        const tmp = entity.relations[subEntity.name].entityRelation;
                        if (tmp) {
                            const tableRel = models.getEntity(src.ctx.model, tmp);
                            if (tableRel)
                                addToQueryMaker(
                                    EOperation.Table,
                                    tableRel.name,
                                    tableRel,
                                    {
                                        [`${entity.table}_id`]: `@(SELECT ${entity.table}.id FROM ${entity.table})@`,
                                        [`${subEntity.table}_id`]: `@(SELECT id FROM ${subEntity.table}1)@`
                                    },
                                    "all",
                                    undefined
                                );
                        }
                    } else {
                        addToQueryMaker(
                            EOperation.Table,
                            parentTableName,
                            subParentEntity,
                            {
                                [relCardinality.rightKey]: `@(SELECT ${tableName}.id FROM ${tableName})@`
                            },
                            relCardinality.leftKey,
                            undefined
                        );
                    }
                }
                logging.error("addAssociation", "Case not found").toLogAndFile();
            }
        };
        /**
         *
         * @param key key Name
         * @param value Datas to process
         */
        const subBlock = (key: string, value: object) => {
            const entityNameSearch = models.getEntityName(src.ctx.model, key);
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
                            logging.message(`Found a relation for ${entity.name}`, key).toLogAndFile();
                            subBlock(key, value as object);
                        } else {
                            logging
                                .message(`data ${key}`, datas[key as keyof object])
                                .to()
                                .log()
                                .file();
                            returnValue[key as keyof object] = datas[key as keyof object];
                        }
                    });
                } else if (typeof datas[key as keyof object] === "object") {
                    if (Object.keys(entity.relations).includes(key)) {
                        logging.message(`Found a relation for ${entity.name}`, key).toLogAndFile();
                        subBlock(key, datas[key as keyof object]);
                    }
                } else returnValue[key as keyof object] = datas[key as keyof object];
            }
        }
        return returnValue;
    };

    if (src.parentEntity) {
        const entityName = src.parentEntity.name;
        logging.message("Found entity : ", entityName).toLogAndFile();
        const callEntity = entityName ? src.ctx.model[entityName] : undefined;
        const id: Id = typeof src.parentId == "string" ? getBigIntFromString(src.parentId) : src.parentId;
        if (entityName && callEntity && id && Number(id) > 0) {
            const relationName = getRelationNameFromEntity(postEntity, callEntity);
            if (relationName) datas[relationName] = { [EConstant.id]: id.toString() };
        }
    }
    const root = start(datas);

    if ((names[postEntity.table] && queryMaker[postEntity.table] && queryMaker[postEntity.table].datas) || root === undefined) {
        queryMaker[postEntity.table].datas = Object.assign(root as object, queryMaker[postEntity.table].datas);
        queryMaker[postEntity.table].keyId = src.id ? "id" : "*";
        sqlResult = queryMakerToString(`WITH "${EConstant.voidtable}" AS (${EConstant.return}${EConstant.tab}${EConstant.voidSql})`);
    } else {
        sqlResult = queryMakerToString(
            src.id
                ? root && Object.entries(root).length > 0
                    ? `WITH ${postEntity.table} AS (${EConstant.return}${EConstant.tab}UPDATE ${doubleQuotes(postEntity.table)}${EConstant.return}${EConstant.tab}SET ${createUpdateValues(
                          postEntity,
                          root
                      )} WHERE "id" = (${EConstant.return}${EConstant.tab}SELECT verifyId('${postEntity.table}', ${src.id}) as id) RETURNING ${allFields})`
                    : `WITH ${postEntity.table} AS (${EConstant.return}${EConstant.tab}SELECT * FROM ${doubleQuotes(postEntity.table)}${EConstant.return}${
                          EConstant.tab
                      }WHERE "id" = ${src.id.toString()})`
                : `WITH ${postEntity.table} AS (${EConstant.return}${EConstant.tab}INSERT INTO ${doubleQuotes(postEntity.table)} ${createInsertValues(
                      postEntity,
                      formatInsertEntityData(postEntity.name, root, src)
                  )} RETURNING ${allFields})`
        );
    }
    const temp = src.toPgQuery();
    if (temp)
        sqlResult += queries.asJson({
            query: `SELECT ${temp && temp.select ? temp.select : "*"} FROM ${names[postEntity.table]} ${temp && temp.groupBy ? `GROUP BY ${temp.groupBy}` : ""}`,
            singular: false,
            strip: src.ctx.service.options.includes(EOptions.stripNull),
            count: false
        });
    return sqlResult;
}
