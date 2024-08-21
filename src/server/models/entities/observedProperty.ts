/**
 * entity ObservedProperty
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity ObservedProperty -----------------------------------!");
import { createEntity } from ".";
import { ERelations } from "../../enums";
import { IconfigFile, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _text } from "./constants";
import { addDoubleQuotes } from "../../helpers";
import { _ID } from "../../db/constants";

export const ObservedProperty:Ientity  = createEntity("ObservedProperties", {
    createOrder: 5,
    order: 8,
    orderBy: `"id"`,
    columns: {
        id: {
            create: _idBig,
            alias(config: IconfigFile, test: IKeyBoolean) {
                return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${addDoubleQuotes(_ID)}`: ''}` ;
            },
            type: "number",
        },
        name: {
            create: _text('no name'),
            alias() {},
            type: "text",
        },
        definition: {
            create: _text('no definition'),
            alias() {},
            type: "text",
        },
        description: {
            create: _text('no description'),
            alias() {},
            type: "text",
        },
    },
    constraints: {
        observedproperty_pkey: 'PRIMARY KEY ("id")',
        observedproperty_unik_name: 'UNIQUE ("name")',
    },
    relations: {
        Datastreams: {
            type: ERelations.hasMany,
            // expand: "err: 501 : Not Implemented.",
            expand: `"datastream"."id" in (SELECT "datastream"."id" from "datastream" WHERE "datastream"."observedproperty_id" = "observedproperty"."id")`,
            link: `"datastream"."id" in (SELECT "datastream"."id" FROM "datastream" WHERE "datastream"."observedproperty_id" = $ID)`,
            entityName: "Datastreams",
            tableName: "datastream",
            relationKey: "observedproperty_id",
            entityColumn: "id",
            tableKey: "id",
        },
        MultiDatastreams: {
            type: ERelations.hasMany,
            expand: `"multidatastream"."id" in (SELECT "multidatastreamobservedproperty"."multidatastream_id" FROM "multidatastreamobservedproperty" WHERE "multidatastreamobservedproperty"."observedproperty_id" = "observedproperty"."id")`,
            link: `"multidatastream"."id" in (SELECT "multidatastreamobservedproperty"."multidatastream_id" FROM "multidatastreamobservedproperty" WHERE "multidatastreamobservedproperty"."observedproperty_id" = $ID)`,
            entityName: "MultiDatastreams",
            tableName: "multidatastreamobservedproperty",
            relationKey: "observedproperty_id",
            entityColumn: "multidatastream_id",
            tableKey: "multidatastream_id",
        },
    },
});