/**
 * relations Enum
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- relations Enum -----------------------------------!\n");

export enum ERelations {
    nop, // for not use index 0
    defaultUnique, // par défaut Unique
    belongsTo, // add a foreign key and singular association.
    belongsToMany, // creates an N:M association with a join table and adds plural association mixins to the source. The junction table is created with sourceId and targetId.
    hasMany, // adds a foreign key to target and plural association.
    hasOne, // adds a foreign key to the target and singular association.
}
