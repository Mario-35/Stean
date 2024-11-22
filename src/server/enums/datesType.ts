/**
 * datesType Enum
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
export enum EDatesType {    
    date = 'YYYY-MM-DD"T"HH24:MI:SSZ',
    dateTz = 'YYYY-MM-DD HH:MI:SSTZH:TZM',
    dateImport = 'YYYY-MM-DDXHH24:MI:SS',
    time = 'HH24:MI:SSZ',
    timeTz = 'HH:MI:SSTZH:TZM',
    timeImport = 'HH24:MI:SS'
}
// export enum EDatesType {    
//     date = 'YYYY-MM-DD"T"HH24:MI:SSZ',
//     dateWithTimeZone = 'YYYY-MM-DD HH:MI:SSTZH:TZM',
//     dateWithOutTimeZone = 'YYYY-MM-DDXHH24:MI:SS',
//     time = 'HH24:MI:SSZ',
//     timeWithTimeZone = 'HH:MI:SSTZH:TZM',
//     timeWithOutTimeZone = 'HH24:MI:SS'
// }
