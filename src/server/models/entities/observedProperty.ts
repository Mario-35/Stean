/**
 * entity ObservedProperty
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- entity ObservedProperty -----------------------------------!");

import { createEntity } from ".";
import { ERelations, ETable } from "../../enums";
import { Iservice, Ientity, IKeyBoolean } from "../../types";
import { _idBig, _text } from "./constants";
import { doubleQuotesString } from "../../helpers";
import { _ID } from "../../db/constants";

export const ObservedProperty:Ientity  = createEntity("ObservedProperties", {
    createOrder: 5,
    type: ETable.table,
    order: 8,
    orderBy: `"id"`,
    columns: {
        id: {
            create: _idBig,
            alias(service: Iservice , test: IKeyBoolean) {
                return `"id"${test["alias"] && test["alias"] === true  === true ? ` AS ${doubleQuotesString(_ID)}`: ''}` ;
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
            type: ERelations.hasMany
        },
        MultiDatastreams: {
            type: ERelations.hasMany,
            entityRelation: "MultiDatastreamObservedProperties",
        },
    },
});