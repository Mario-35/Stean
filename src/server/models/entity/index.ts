/**
 * entity Maker
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EDataType, EDatesType, EErrors, EQuery, ERelations, EentityType, allEntities } from "../../enums";
import { doubleQuotes } from "../../helpers";
import { messages } from "../../messages";
import { Ientity, IentityColumnAliasOptions, IentityCore } from "../../types";
import { as, singular } from "../helpers";

// class to be extend to pass params for global

class EntityPass {
    // global trigger
    static trigger: { [key: string]: Record<string, string> } = {};
    // global constraints and indexes
    static pass: {
        [key: string]: {
            constraints: Record<string, string>;
            indexes: Record<string, string>;
        };
    } = {};
}

export class Entity extends EntityPass {
    _: Ientity = {
        name: "",
        singular: "",
        table: "",
        constraints: {},
        indexes: {},
        orderBy: "",
        createOrder: -1,
        type: EentityType.blank,
        order: 0,
        columns: {},
        relations: {}
    };
    constructor(name: string, datas: IentityCore) {
        super();
        const entity = allEntities[name];
        if (entity) {
            (this._.createOrder = datas.createOrder), (this._.type = datas.type), (this._.order = datas.order), (this._.columns = datas.columns), (this._.orderBy = Object.keys(datas.columns)[0]);
            (this._.relations = datas.relations), (this._.constraints = {}), (this._.indexes = {}), (this._.after = datas.after), (this._.name = name);
            if (datas.trigger) this._.trigger = datas.trigger;
            this._.singular = singular(entity);
            this._.table = this._.singular.toLowerCase();
        } else throw new Error(messages.str(EErrors.noValidEntity, name));
        this.prepareColums();
        this.createConstraints();
        this.createTriggers();
        this.createPartition();
    }

    toEntity() {
        return this._;
    }

    private prepareColums() {
        Object.keys(this._.columns).forEach((e) => {
            if (this._.columns[e].partition) {
                if (this._.columns[e].entityRelation) {
                    // this.addToPartition(this._.columns[e].partition, e);
                    if (this._.partition) {
                        if (this._.columns[e].partition === "main") this._.partition.main = e;
                        else this._.partition.sub = e;
                    } else {
                        this._.partition =
                            this._.columns[e].partition === "main"
                                ? {
                                      main: e
                                  }
                                : {
                                      main: "",
                                      sub: e
                                  };
                    }
                }
            }

            if (this._.columns[e].indexes) {
                this._.columns[e].indexes.forEach((k) => {
                    this.addToIndexes(`${this._.table}_${e}_${k}`, `ON public."${this._.table}" USING btree ("${e}", "${k}")`);
                });
            }
            if (this._.columns[e].dataType === EDataType.tstzrange || this._.columns[e].dataType === EDataType.tsrange) {
                const entityRelation = this._.columns[e].entityRelation;
                if (entityRelation) {
                    if (!Entity.trigger[this._.table]) Entity.trigger[this._.table] = {};
                    const relationTable = singular(allEntities[entityRelation as keyof object]).toLowerCase();
                    this._.columns[e].create = "";
                    this._.columns[e].alias = function functionResult(options: IentityColumnAliasOptions) {
                        return options.context?.target === EQuery.OrderBy
                            ? doubleQuotes(e)
                            : `NULLIF (CONCAT_WS('/', to_char((SELECT MIN("${e}") FROM "${relationTable}" WHERE "${relationTable}"."${options.entity.table}_id" = ${options.entity.table}.id),'${
                                  EDatesType.dateTz
                              }'),  to_char((SELECT MAX("${e}") FROM "${relationTable}" WHERE "${relationTable}"."${options.entity.table}_id" =${options.entity.table}.id),'${
                                  EDatesType.dateTz
                              }')), '')${as(options)}`;
                    };
                }
            }
        });
    }

    private createConstraints() {
        Object.keys(this._.columns).forEach((elem: string) => {
            if (this._.columns[elem].orderBy) this._.orderBy = `"${elem}" ${this._.columns[elem].orderBy.toUpperCase()}`;
            if (this._.columns[elem].create.endsWith(" GENERATED ALWAYS AS IDENTITY")) {
                this.addToConstraints(`${this._.table}_pkey`, `PRIMARY KEY ("${elem}")`);
                this.addToConstraints(
                    `${this._.table}_pkey`,
                    this._.partition ? `UNIQUE NULLS NOT DISTINCT (${this.unik([this._.partition.main, this._.partition.sub || ""], elem)})` : `PRIMARY KEY ("${elem}")`
                );
            } else if (this._.columns[elem].create.includes(" UNIQUE")) {
                this.addToConstraints(
                    `${this._.table}_unik_${elem}`,
                    this._.partition ? `UNIQUE NULLS NOT DISTINCT (${this.unik([this._.partition.main, this._.partition.sub || ""], elem)})` : `UNIQUE ("${elem}")`
                );
                this.addToIndexes(`${this._.table}_${elem}`, `ON public."${this._.table}" USING btree ("${elem}")`);
            }
        });

        Object.keys(this._.relations).forEach((elem: string) => {
            if (this._.relations[elem].unique)
                this.addToConstraints(
                    `${this._.table}_unik_${elem.toLowerCase()}`,
                    this._.partition
                        ? `UNIQUE NULLS NOT DISTINCT (${this.unik([...new Set([this._.partition.main, this._.partition.sub || ""]), ...new Set(this._.relations[elem].unique)])})`
                        : `UNIQUE (${this._.relations[elem].unique.map((e) => `"${e}"`)})`
                );
            switch (this._.relations[elem].type) {
                case ERelations.belongsTo:
                    const value = `FOREIGN KEY ("${elem.toLowerCase()}_id") REFERENCES "${elem.toLowerCase()}"("id") ON UPDATE CASCADE ON DELETE CASCADE`;
                    if (this._.relations[elem].entityRelation && this.isIn(`${elem.toLowerCase()}_id`)) this.addToPass(this._.relations[elem].entityRelation, value);
                    else if (this.isIn(`${elem.toLowerCase()}_id`)) this.addToConstraints(`${this._.table}_${elem.toLowerCase()}_id_fkey`, value);
                    if (!this._.relations[elem].entityRelation) this.addToIndexes(`${this._.table}_${elem.toLowerCase()}_id`, `ON public."${this._.table}" USING btree ("${elem.toLowerCase()}_id")`);
                    break;
                case ERelations.defaultUnique:
                    this.addToConstraints(
                        `${this._.table}_${elem.toLowerCase()}_id_fkey`,
                        `FOREIGN KEY ("_default_${elem.toLowerCase()}") REFERENCES "${elem.toLowerCase()}"("id") ON UPDATE CASCADE ON DELETE CASCADE`
                    );
                    break;
                case ERelations.belongsToMany:
                    if (this._.relations[elem].entityRelation) this.addToPass(this._.relations[elem].entityRelation);
                    break;
                case ERelations.hasMany:
                    if (this._.relations[elem].entityRelation) this.addToPass(this._.relations[elem].entityRelation);
                    break;
            }
        });

        if (this._.type === EentityType.link && Object.keys(this._.columns).length === 2) {
            this.addToConstraints(`${this._.table}_pkey`, `PRIMARY KEY (${Object.keys(this._.columns).map((e) => `"${e}"`)})`);
        }

        if (Entity.pass[this._.name]) {
            Object.keys(Entity.pass[this._.name].constraints).forEach((elem: string) => {
                this._.constraints[elem] = Entity.pass[this._.name].constraints[elem];
            });
        }
    }

    private createTriggers() {
        if (Entity.trigger[this._.table])
            this._.trigger = Object.keys(Entity.trigger[this._.table]).map((elem: string) => Entity.trigger[this._.table][elem].replace("@DATAS@", "").replace("@COLUMN@", ""));
    }

    private createPartition() {
        if (this._.partition) {
            if (this._.partition.main === "") throw new Error(`No main partition`);
            if (!this.isIn(this._.partition.main)) throw new Error(`The column ${this._.partition.main} not exist`);
            // if (!Object.keys(this._.columns).includes(this._.partition.main)) throw new Error(`The column ${this._.partition.main} not exist`);
            this.addToAfter(`CREATE TABLE IF NOT EXISTS "${this._.partition.main}default" PARTITION OF "${this._.table}" DEFAULT`);
            this.addToAfter(
                `CREATE TABLE IF NOT EXISTS "${this._.partition.main}0" PARTITION OF "${this._.table}" FOR VALUES IN (NULL)${
                    this._.partition.sub ? ` PARTITION BY LIST("${this._.partition.sub}")` : ""
                }`
            );
            this.addToAfter(`CREATE TABLE IF NOT EXISTS "${this._.partition.main}1" PARTITION OF "${this._.table}" FOR VALUES IN (1)`);
            if (this._.partition.sub) {
                if (!this.isIn(this._.partition.sub)) throw new Error(`The column ${this._.partition.sub} not exist`);
                this.addToAfter(`CREATE TABLE IF NOT EXISTS "${this._.partition.sub}default" PARTITION OF "${this._.partition.main}0" DEFAULT`);
                this.addToAfter(`CREATE TABLE IF NOT EXISTS "${this._.partition.sub}1" PARTITION OF "${this._.partition.main}0" FOR VALUES IN (1)`);
            }
        }
    }

    private addToAfter(value: string) {
        if (this._.after) this._.after.push(value);
        else this._.after = [value];
    }

    private addToConstraints(key: string, value: string) {
        this._.constraints[key] = value;
    }

    private addToIndexes(key: string, value: string) {
        this._.indexes[key] = value;
    }

    private addToPass(key: string, value?: string) {
        value = value || `FOREIGN KEY ("${this._.table}_id") REFERENCES "${this._.table}"("id") ON UPDATE CASCADE ON DELETE CASCADE`;
        if (!Entity.pass[key]) Entity.pass[key] = { constraints: {}, indexes: {} };
        Entity.pass[key].constraints[`${singular(key).toLowerCase()}_${this._.table}_id_fkey`] = value;
    }

    private isIn(elem: string) {
        return Object.keys(this._.columns).includes(elem);
    }

    private unik(list: string[] | undefined, add?: string) {
        let ret: string[] = [];
        if (list) {
            ret = add ? [`"${add}"`, ...new Set(list.map((e) => `"${e}"`))] : [...new Set(list.map((e) => `"${e}"`))];
        } else if (add) ret = [`"${add}"`];
        return ret.filter((e) => e !== "");
    }
}
