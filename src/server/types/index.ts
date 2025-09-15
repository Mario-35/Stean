/**
 * Index Types
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Koa from "koa";
import { allEntitiesType, EDataType, EExtensions } from "../enums";
import { Ientity } from "./entity";
import { IentityColumn } from "./entityColumn";
export { IentityColumnAliasOptions } from "./entityColumnAliasOptions";
export { IrelationInfos } from "./relationInfos";
export { Icomon } from "./comon";
export { Iservice } from "./service";
export { IcsvColumn } from "./csvColumn";
export { IcsvFile } from "./csvFile";
export { IcsvImport } from "./csvImport";
export { IdbConnection } from "./dbConnection";
export { IentityCore, Ientity } from "./entity";
export { IentityColumn } from "./entityColumn";
export { IentityRelation } from "./entityRelation";
export { ILoraDecodingResult } from "./loraDecodingResult";
export { IodataContext } from "./odataContext";
export { IpgQuery } from "./pgQuery";
export { IqueryOptions } from "./queryOptions";
export { IreturnFormat } from "./returnFormat";
export { IreturnResult } from "./returnResult";
export { Isynonyms } from "./synonyms";
export { IserviceInfos } from "./serviceLink";
export { IstreamInfos } from "./streamInfos";
export { Iuser } from "./user";
export { IuserToken } from "./userToken";
export { Iversion } from "./version";
export { IdecodedUrl } from "./decodedUrl";
export { IqueryMaker } from "./queryMaker";
export { Idatas } from "./datas";
export { IforwardConnection } from "./forwardConnection";
export { IvisitRessource } from "./visitRessource";
export type Ientities = { [key in allEntitiesType as string]: Ientity };
export type koaContext = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>;
export const typeExtensions = Object.keys(EExtensions) as Array<keyof typeof EExtensions>;
export type keyobj = keyof object;

export const getColumnType = (input: IentityColumn): string => {
    switch (input.dataType) {
        case EDataType.bigint:
            return "number";
        case EDataType.text:
            return "text";
        case EDataType._text:
            return "text[]";
        // return  "list";
        case EDataType.timestamptz:
            return "date";
        case EDataType.json:
        case EDataType.jsonb:
            return "json";
        case EDataType.link:
            return `relation:${input.entityRelation}`;
        case EDataType.any:
            return `result`;
        case EDataType.bool:
            return `boolean`;
        default:
            return "ERR_OR";
    }
};
