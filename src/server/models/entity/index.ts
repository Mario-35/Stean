import { EDataType, EDatesType, EQuery, ERelations, EentityType, allEntities } from "../../enums";
import { doubleQuotes } from "../../helpers";
import { msg, errors } from "../../messages";
import { IentityColumn, IentityColumnAliasOptions, IentityCore, IentityRelation } from "../../types";
import { as, singular } from "../helpers";

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
    name: string; // Entity Name
    singular: string;
    table: string;
    createOrder: number;
    type: EentityType;
    order: number;
    orderBy: string;
    columns: { [key: string]: IentityColumn };
    relations: { [key: string]: IentityRelation };
    constraints: Record<string, string>;
    indexes: Record<string, string>;
    after?: string;
    trigger: string[];
    clean?: string[];
    start?: string[];
    uniques?: string[];
    partition?: {
        column: string;
        entityRelation?: string[];
    };

    constructor(name: string, datas: IentityCore) {
        super();
        const entity = allEntities[name];
        if (entity) {
            (this.createOrder = datas.createOrder), (this.type = datas.type), (this.order = datas.order), (this.columns = datas.columns), (this.orderBy = Object.keys(datas.columns)[0]);
            (this.relations = datas.relations), (this.constraints = {}), (this.indexes = {}), (this.after = datas.after), (this.name = name);
            if (datas.trigger) this.trigger = datas.trigger;
            this.singular = singular(entity);
            this.table = this.singular.toLowerCase();
        } else throw new Error(msg(errors.noValidEntity, name));
        this.prepareRelations();
        this.prepareColums();
        this.createConstraints();
        this.createTriggers();
        // if (name === "Observations") {
        //     console.log(this);
        //     process.exit(111);
        // }
    }

    addTrigger(action: string, table: string, relTable: string) {
        return `do $$ BEGIN
    CREATE TRIGGER ${table}s_actualization_${action}
        after ${action}
        on "${relTable}"
        for each row
        execute procedure ${table}s_update_${action}();
  exception
    when others then null;
  end $$;`;
    }

    private cleanString(input: string) {
        return input.replace("@DATAS@", "").replace("@COLUMN@", "");
    }

    private prepareRelations() {
        Object.keys(this.relations).forEach((e) => {});
    }
    private prepareColums() {
        Object.keys(this.columns).forEach((e) => {
            if (this.columns[e].partition && this.columns[e].partition === true) {
                if (this.columns[e].entityRelation) {
                    if (this.partition && this.partition.entityRelation) {
                        this.partition.entityRelation.push(this.columns[e].entityRelation);
                    } else {
                        this.partition = {
                            column: e,
                            entityRelation: [this.columns[e].entityRelation]
                        };
                        this.after += `CREATE TABLE IF NOT EXISTS "${this.table}default" PARTITION OF "${this.table}" DEFAULT;`;
                        // this.after += `CREATE TABLE IF NOT EXISTS "${this.table}01" PARTITION OF "${this.table}" FOR VALUES IN (01);`;
                    }
                }
            }

            if (this.columns[e].indexes) {
                this.columns[e].indexes.forEach((k) => {
                    this.addToIndexes(`${this.table}_${e}_${k}`, `ON public."${this.table}" USING btree ("${e}", "${k}")`);
                });
            }
            if (this.columns[e].dataType === EDataType.tstzrange || this.columns[e].dataType === EDataType.tsrange) {
                const entityRelation = this.columns[e].entityRelation;
                // const coalesce = this.columns[e].coalesce;
                // const cast = EDataType.tstzrange ? "TIMESTAMPTZ" : "TIMESTAMP";
                if (entityRelation) {
                    if (!Entity.trigger[this.table]) Entity.trigger[this.table] = {};
                    const relationTable = singular(allEntities[entityRelation as keyof object]).toLowerCase();
                    this.columns[e].create = "";
                    this.columns[e].alias = function functionResult(options: IentityColumnAliasOptions) {
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

    private createTriggers() {
        if (Entity.trigger[this.table]) {
            this.trigger = Object.keys(Entity.trigger[this.table]).map((elem: string) => this.cleanString(Entity.trigger[this.table][elem]));
        }
    }

    private is(elem: string) {
        return Object.keys(this.columns).includes(`${elem.toLowerCase()}_id`);
    }

    private addToPass(key: string, value?: string) {
        value = value || `FOREIGN KEY ("${this.table}_id") REFERENCES "${this.table}"("id") ON UPDATE CASCADE ON DELETE CASCADE`;
        if (!Entity.pass[key]) Entity.pass[key] = { constraints: {}, indexes: {} };
        Entity.pass[key].constraints[`${singular(key).toLowerCase()}_${this.table}_id_fkey`] = value;
    }

    private addToConstraints(key: string, value: string) {
        this.constraints[key] = value;
    }

    private addToIndexes(key: string, value: string) {
        this.indexes[key] = value;
    }

    private createConstraints() {
        Object.keys(this.columns).forEach((elem: string) => {
            if (this.columns[elem].orderBy) this.orderBy = `"${elem}" ${this.columns[elem].orderBy.toUpperCase()}`;
            if (this.columns[elem].create.startsWith("BIGINT GENERATED ALWAYS AS IDENTITY")) {
                this.addToConstraints(`${this.table}_pkey`, this.partition ? `UNIQUE NULLS NOT DISTINCT ("${elem}","${this.partition.column}")` : `PRIMARY KEY ("${elem}")`);
                // this.addToConstraints(`${this.table}_pkey`, `PRIMARY KEY ("${elem}"${this.partition ? `,"${this.partition.column}"` : ""})`);
                this.addToIndexes(`${this.table}_${elem}`, `ON public."${this.table}" USING btree ("${elem}")`);
            } else if (this.columns[elem].create.includes(" UNIQUE")) {
                this.addToConstraints(`${this.table}_unik_${elem}`, this.partition ? `UNIQUE NULLS NOT DISTINCT ("${elem}","${this.partition.column}")` : `UNIQUE ("${elem}")`);
                // this.addToConstraints(`${this.table}_unik_${elem}`, `UNIQUE ("${elem}"${this.partition ? `,"${this.partition.column}"` : ""})`);
                this.addToIndexes(`${this.table}_${elem}`, `ON public."${this.table}" USING btree ("${elem}")`);
            }
        });

        Object.keys(this.relations).forEach((elem: string) => {
            if (this.relations[elem].unique)
                this.addToConstraints(
                    `${this.table}_unik_${elem.toLowerCase()}`,
                    this.partition
                        ? `UNIQUE NULLS NOT DISTINCT (${this.relations[elem].unique.filter((e) => e !== this.partition?.column).map((e) => `"${e}"`)},"${this.partition.column}")`
                        : `UNIQUE (${this.relations[elem].unique.map((e) => `"${e}"`)})`
                );
            switch (this.relations[elem].type) {
                case ERelations.belongsTo:
                    const value = `FOREIGN KEY ("${elem.toLowerCase()}_id") REFERENCES "${elem.toLowerCase()}"("id") ON UPDATE CASCADE ON DELETE CASCADE`;
                    if (this.relations[elem].entityRelation && this.is(elem)) this.addToPass(this.relations[elem].entityRelation, value);
                    else if (this.is(elem)) this.addToConstraints(`${this.table}_${elem.toLowerCase()}_id_fkey`, value);
                    if (!this.relations[elem].entityRelation) this.addToIndexes(`${this.table}_${elem.toLowerCase()}_id`, `ON public."${this.table}" USING btree ("${elem.toLowerCase()}_id")`);
                    break;
                case ERelations.defaultUnique:
                    this.addToConstraints(
                        `${this.table}_${elem.toLowerCase()}_id_fkey`,
                        `FOREIGN KEY ("_default_${elem.toLowerCase()}") REFERENCES "${elem.toLowerCase()}"("id") ON UPDATE CASCADE ON DELETE CASCADE`
                    );
                    break;
                case ERelations.belongsToMany:
                    if (this.relations[elem].entityRelation) this.addToPass(this.relations[elem].entityRelation);
                    break;
                case ERelations.hasMany:
                    if (this.relations[elem].entityRelation) this.addToPass(this.relations[elem].entityRelation);
                    break;
            }
        });

        if (this.type === EentityType.link && Object.keys(this.columns).length === 2) {
            this.addToConstraints(`${this.table}_pkey`, `PRIMARY KEY (${Object.keys(this.columns).map((e) => `"${e}"`)})`);
            Object.keys(this.columns).forEach((elem) => {
                //   this.addToIndexes("ELSE", `${this.table}_${elem}`, `ON public."${this.table}" USING btree ("${elem}")`);
            });
        }

        if (Entity.pass[this.name]) {
            Object.keys(Entity.pass[this.name].constraints).forEach((elem: string) => {
                this.constraints[elem] = Entity.pass[this.name].constraints[elem];
            });
        }
    }
}
