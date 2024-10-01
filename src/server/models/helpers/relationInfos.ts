/**
 * cardinality
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- cardinality -----------------------------------!\n");

import { idColumnName } from ".";
import { models } from "..";
import { errorMessage } from "../../constants";
import { ERelations } from "../../enums";
import { formatPgTableColumn } from "../../helpers";
import { log } from "../../log";
import { IrelationInfos, Ientity, Iservice } from "../../types";

const _Key = (entity: Ientity, search: Ientity) => {  
    return Object.keys(entity.columns).includes(`${search.table}_id`) 
    ? `${search.table}_id`
    : Object.keys(entity.columns).includes(`${search.singular.toLocaleLowerCase()}_id`) 
        ?  `${search.singular.toLocaleLowerCase()}_id`
        : Object.keys(entity.columns).includes(`_default_${search.singular.toLocaleLowerCase()}`) 
        ?  `_default_${search.singular.toLocaleLowerCase()}`
        : "id";
}

export const relationInfos = (service: Iservice, entityName: string, relationName: string, loop?:boolean): IrelationInfos => {
    console.log(log.whereIam());
    let r: IrelationInfos | undefined = undefined;
    const leftEntity = models.getEntity(service, entityName);
    const rightEntity = models.getEntity(service, relationName);
    if ((entityName !== relationName) && leftEntity && rightEntity) {
        console.log(log.debug_head("Entity" ,`====> ${leftEntity.name} : ${rightEntity.name}`));           
        const leftRelation  = models.getRelation(service, leftEntity, rightEntity);  
        const rightRelationName = models.getRelationName(rightEntity, [entityName, leftEntity.name, leftEntity.singular, entityName.replace(relationName,""), relationName.replace(entityName,"")]);
        const rightRelation = rightRelationName ? rightEntity.relations[rightRelationName] : undefined;
        if (leftRelation  && leftRelation.type) {
            let leftKey = _Key(leftEntity, rightEntity);
            let rightKey = _Key(rightEntity, leftEntity);
            
            const fnError = (): IrelationInfos => {
                return {type: "ERROR", rightKey: "", leftKey: "", table : "cardinality ERROR", column: "cardinality ERROR", expand :  '', link :  '' };
            }

            const fnHasMany = () => {
                const complexEntity = models.getEntity(service, `${leftEntity.name}${rightEntity.name}`) || models.getEntity(service, `${rightEntity.name}${leftEntity.name}`) || models.getEntity(service, `${leftEntity.singular}${rightEntity.singular}`) || models.getEntity(service, `${rightEntity.singular}${leftEntity.singular}`);
                if(complexEntity && rightRelation) {
                    leftKey = _Key(complexEntity, leftEntity);
                    rightKey = _Key(complexEntity, rightEntity);
                    r = {
                        type: `${leftRelation.type}.${rightRelation.type}`,
                        leftKey: leftKey,
                        rightKey: rightKey,
                        table: complexEntity.table,
                        column: idColumnName(leftEntity, rightEntity) || "id",
                        link: `${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(complexEntity.table, rightKey)} FROM ${formatPgTableColumn(complexEntity.table)} WHERE ${formatPgTableColumn(complexEntity.table, leftKey)} =$ID)`,
                        expand: '', 
                    }     
                    r.expand = r.link.replace("$ID", formatPgTableColumn(leftEntity.table, "id"));
                    return r;
                }
                return fnError();
            }

            // infoMessage(`PASS [${leftEntity?.name} : ${rightEntity?.name} ${leftRelation.type}]`);
            switch (leftRelation.type) {
                // === : 1
                case ERelations.defaultUnique:
                    if (rightRelation && rightRelation.type) {
                        switch (rightRelation.type) {
                            // ===> 1.4
                            case ERelations.hasMany:
                                r = {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    leftKey: leftKey,
                                    rightKey: rightKey,
                                    table: leftEntity.table,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: `${formatPgTableColumn(rightEntity.table, rightKey)} IN (SELECT ${formatPgTableColumn(rightEntity.table, rightKey)} FROM ${formatPgTableColumn(rightEntity.table)} WHERE ${formatPgTableColumn(rightEntity.table, rightKey)} =$ID)`,
                                    expand: ''
                                }       
                                r.expand = r.link.replace("$ID", formatPgTableColumn(leftEntity.table, leftKey));
                                return r;
                            }
                        }
                        errorMessage("defaultUnique");
                        break;

                // === : 2
                case ERelations.belongsTo:
                    if (rightRelation  && rightRelation.type) {
                        switch (rightRelation.type) {
                            // ===> 2.2
                            case ERelations.belongsTo:
                                return {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    leftKey: leftKey,
                                    rightKey: rightKey,
                                    table: leftEntity.table,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: `${formatPgTableColumn(rightEntity.table, rightKey)} = (SELECT ${formatPgTableColumn(leftEntity.table, leftKey)} FROM ${formatPgTableColumn(leftEntity.table)} WHERE ${formatPgTableColumn(leftEntity.table, rightKey)} =$ID)`,
                                    expand: `${formatPgTableColumn(rightEntity.table, rightKey)} = ${formatPgTableColumn(leftEntity.table, leftKey)}`,
                            }

                            // ===> 2.3
                            case ERelations.belongsToMany:                            
                                if (rightRelationName && !loop) {                                
                                    const entityName = relationInfos(service, rightRelationName, rightEntity.name, true);
                                    const complexEntity = models.getEntity(service, `${rightRelationName}${rightEntity.name}`) || models.getEntity(service, `${rightEntity.name}${rightRelationName}`);
                                    if(complexEntity && entityName.external) {
                                        leftKey = entityName.external.leftKey;
                                        rightKey= entityName.external.rightKey;
                                        return {
                                            type: `${leftRelation.type}.${rightRelation.type}`,
                                            leftKey: leftKey,
                                            rightKey: rightKey,
                                            table: leftEntity.table,
                                            column: idColumnName(leftEntity, rightEntity) || "id",
                                            expand: `${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(rightEntity.table, "id")} FROM ${formatPgTableColumn(rightEntity.table)} WHERE ${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(complexEntity.table, rightKey)} FROM ${complexEntity.table} WHERE ${formatPgTableColumn(complexEntity.table, leftKey)} = ${formatPgTableColumn(leftEntity.table, leftKey)}))`,
                                            link: `${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(rightEntity.table, "id")} FROM ${formatPgTableColumn(rightEntity.table)} WHERE ${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(complexEntity.table, rightKey)} FROM ${complexEntity.table} WHERE ${formatPgTableColumn(complexEntity.table, leftKey)} IN (SELECT ${formatPgTableColumn(leftEntity.table, leftKey)} FROM ${leftEntity.table} WHERE ${formatPgTableColumn(leftEntity.table, "id")} =$ID)))`,
                                        }
                                }
                            }

                            // ===> 2.4
                            case ERelations.hasMany:
                                    return {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    leftKey: leftKey,
                                    rightKey: rightKey,
                                    table: leftEntity.table,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: `${formatPgTableColumn(rightEntity.table, rightKey)} = (SELECT ${formatPgTableColumn(leftEntity.table, leftKey)} FROM ${formatPgTableColumn(leftEntity.table)} WHERE ${formatPgTableColumn(leftEntity.table, rightKey)} =$ID)`,
                                    expand: `${formatPgTableColumn(rightEntity.table, rightKey)} = ${formatPgTableColumn(leftEntity.table, leftKey)}`
                            }
                        }
                    }
                    errorMessage("belongsTo");
                    break;

                // === : 3
                case ERelations.belongsToMany:
                    if (rightRelation  && rightRelation.type) {
                        switch (rightRelation.type) {
                            // ===> 3.2
                            case ERelations.belongsTo:
                                const complexEntity2 = models.getEntity(service, `${leftEntity.name}${rightEntity.name}`) || models.getEntity(service, `${rightEntity.name}${leftEntity.name}`) || models.getEntity(service, `${leftEntity.singular}${rightEntity.singular}`) || models.getEntity(service, `${rightEntity.singular}${leftEntity.singular}`);
                                // ===> 3.2.1
                                if (rightRelation.entityRelation) {     
                                    const tmp = models.extractEntityNames(rightRelation.entityRelation, [leftEntity.name, rightEntity.name]);
                                    const tempEntity = models.getEntity(service, tmp[0]);
                                    if (tempEntity && !loop) {
                                        const tempCardinality = relationInfos(service, leftEntity.name, tempEntity.name, true);
                                        if(complexEntity2) {
                                            leftKey = _Key(complexEntity2, rightEntity);
                                            rightKey = _Key(complexEntity2, leftEntity);
                                            r = {
                                                type: `${leftRelation.type}.${rightRelation.type}.1`,
                                                leftKey: leftKey,
                                                rightKey: rightKey,
                                                external: {
                                                    leftKey: tempCardinality.leftKey,
                                                    rightKey: tempCardinality.rightKey,
                                                    table: tempCardinality.table

                                                },
                                                table: complexEntity2.table,
                                                column: idColumnName(leftEntity, rightEntity) || "id",
                                                link: `${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(rightEntity.table, "id")} FROM ${formatPgTableColumn(rightEntity.table)} WHERE ${formatPgTableColumn(rightEntity.table, tempCardinality.rightKey)} IN (SELECT ${formatPgTableColumn(tempCardinality.table, tempCardinality.rightKey)} FROM ${formatPgTableColumn(tempCardinality.table)} WHERE ${formatPgTableColumn(tempCardinality.table, tempCardinality.leftKey)} =$ID))`,
                                                expand: '', 
                                            }
                                            r.expand = r.link.replace("$ID", formatPgTableColumn(leftEntity.table, "id"));
                                            return r;
                                        } 
                                    }
                                }
                                
                                // ===> 3.2.2
                                else if (complexEntity2) { 
                                    leftKey = _Key(complexEntity2, rightEntity);
                                    rightKey = _Key(complexEntity2, leftEntity);
                                    r = {
                                        type: `${leftRelation.type}.${rightRelation.type}.2`,
                                        leftKey: leftKey,
                                        rightKey: rightKey,
                                        table: complexEntity2.table,
                                        column: idColumnName(leftEntity, rightEntity) || "id",
                                        link: `${formatPgTableColumn(rightEntity.table, rightKey)} IN (SELECT ${formatPgTableColumn(complexEntity2.table, idColumnName(complexEntity2, rightEntity) || "id")} FROM ${formatPgTableColumn(complexEntity2.table)} WHERE ${formatPgTableColumn(complexEntity2.table, idColumnName(complexEntity2, leftEntity) || "id")} =$ID)`,
                                        expand: '', 
                                    }
                                    r.expand = r.link.replace("$ID", formatPgTableColumn(complexEntity2.table, rightKey));
                                    return r;
                            }

                            // ===> 3.3
                            case ERelations.belongsToMany:
                                return fnHasMany();

                        }   
                    }
                    errorMessage("belongsToMany");
                    break;

                // === : 4
                case ERelations.hasMany:
                    if (rightRelation  && rightRelation.type) {
                        switch (rightRelation.type) {
                            // ===> 4.1
                            case ERelations.defaultUnique:
                                r = {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    leftKey: leftKey,
                                    rightKey: rightKey,
                                    table: leftEntity.table,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: `${formatPgTableColumn(rightEntity.table, leftKey)} IN (SELECT ${formatPgTableColumn(rightEntity.table, leftKey)} FROM ${formatPgTableColumn(rightEntity.table)} WHERE ${formatPgTableColumn(rightEntity.table, rightKey)} =$ID)`,
                                    expand: '',
                                }      
                                r.expand = r.link.replace("$ID", formatPgTableColumn(leftEntity.table, leftKey));
                                return r;

                            // ===> 4.2
                            case ERelations.belongsTo:
                                r = {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    rightKey: rightKey,
                                    leftKey: leftKey,
                                    table: rightEntity.table,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: `${formatPgTableColumn(rightEntity.table, "id")} IN (SELECT ${formatPgTableColumn(rightEntity.table, "id")} FROM ${formatPgTableColumn(rightEntity.table)} WHERE ${formatPgTableColumn(rightEntity.table, rightKey)} =$ID)`,
                                    expand: '',
                                }      
                                r.expand = r.link.replace("$ID", formatPgTableColumn(leftEntity.table, "id"));
                                return r;


                            // ===> 4.4
                            case ERelations.hasMany:
                                return fnHasMany();
                        }
                    }
                    errorMessage("hasMany");
                    break;
                // === : 5
                case ERelations.hasOne:
                    if (rightRelation  && rightRelation.type) {
                        switch (rightRelation.type) {
                            // ===> 5.2
                            case ERelations.belongsTo:
                                return {
                                    type: `${leftRelation.type}.${rightRelation.type}`,
                                    leftKey: leftKey,
                                    rightKey: rightKey,
                                    table: leftEntity.table,
                                    column: idColumnName(leftEntity, rightEntity) || "id",
                                    link: `${formatPgTableColumn(rightEntity.table, rightKey)} = (SELECT ${formatPgTableColumn(leftEntity.table, leftKey)} FROM ${formatPgTableColumn(leftEntity.table)} WHERE ${formatPgTableColumn(leftEntity.table, leftKey)} =$ID)`,
                                    expand: `${formatPgTableColumn(rightEntity.table, rightKey)} = ${formatPgTableColumn(leftEntity.table, leftKey)}`,
                                }
                            }
                        }
                    errorMessage("hasOne");
                    break;
            }
           if (r) return r;
        }
        errorMessage(`relationInfos [${leftEntity.name} ${leftRelation?.type}] : [${rightEntity.name} ${rightRelation?.type}]`);
    }
    
    return {type: "ERROR", rightKey: "", leftKey: "", table : "cardinality ERROR", column: "cardinality ERROR", expand :  '', link :  '' };


}
