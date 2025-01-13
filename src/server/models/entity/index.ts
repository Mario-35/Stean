import { EDataType, ERelations, ETable, allEntities } from "../../enums";
import { msg, errors } from "../../messages";
import { IentityColumn, IentityCore, IentityRelation } from "../../types";
import { singular } from "../helpers";
import { Time, Timestamp } from "../types";

class EntityPass {
    // static period: Record<string, string> = {};
    static trigger: { [key: string]: Record<string, string> } = {};
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
    type: ETable;
    order: number;
    orderBy: string;
    columns: { [key: string]: IentityColumn };
    relations: { [key: string]: IentityRelation };
    constraints: Record<string, string>;
    indexes: Record<string, string>;
    update?: string[];
    after?: string;
    trigger: string[];

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
        this.prepareColums();
        this.createConstraints();
        this.createTriggers();
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

    querySet(column: string, imp: "Start" | "End") {
        return `THEN queryset := queryset || delimitr || '"_${column}${imp}" = $1."${column}"'; delimitr := ','; END IF;`;
    }

    insertStr(table: string, column: string, relTable: string, coalesce?: string) {
        const datas = `IF ( NEW."${column}" < "DS_ROW"."_${column}Start" OR "DS_ROW"."_${column}Start" IS NULL ) ${this.querySet(column, "Start")}\n IF (${coalesce ? ` COALESCE( NEW."${column}", NEW."${coalesce}") ` : `NEW."${column}"`} > "DS_ROW"."_${column}End" OR "DS_ROW"."_${column}End" IS NULL ) ${this.querySet(column, "End")}`;
        Entity.trigger[table].insert = Entity.trigger[table].hasOwnProperty("insert")
            ? Entity.trigger[table].insert.replace("@DATAS@", `\n${datas}@DATAS@`)
            : `CREATE OR REPLACE FUNCTION ${table}s_update_insert() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$ DECLARE "DS_ROW" RECORD; queryset TEXT := ''; delimitr char(1) := ' '; BEGIN IF (NEW."${table}_id" is not null) THEN SELECT "id", "_${column}Start", "_${column}End", "_resultTimeStart", "_resultTimeEnd" INTO "DS_ROW" FROM "${table}" WHERE "${table}"."id" = NEW."${table}_id"; ${datas} @DATAS@ IF (delimitr = ',') THEN EXECUTE 'update "${table}" SET ' || queryset || ' where "${table}"."id"=$1."${table}_id"' using NEW; END IF; RETURN new; END IF; RETURN new; END; $$`;
        Entity.trigger[table].doInsert = this.addTrigger("insert", table, relTable);
    }

    updateStr(table: string, column: string, relTable: string, coalesce?: string) {
        const datas = `IF (NEW."${column}" != OLD."${column}") THEN for "DS_ROW" IN SELECT * FROM "${table}" WHERE "id"=NEW."${table}_id" LOOP IF (${coalesce ? ` COALESCE( NEW."${column}", NEW."${coalesce}") ` : `NEW."${column}"`} < "DS_ROW"."_${column}Start") ${this.querySet(column, "End")} END LOOP; END IF;`;
        Entity.trigger[table].update = Entity.trigger[table].hasOwnProperty("update")
            ? Entity.trigger[table].update.replace("@DATAS@", `\n${datas}@DATAS@`)
            : `CREATE OR REPLACE FUNCTION ${table}s_update_update() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$ DECLARE "DS_ROW" "${table}"%rowtype; queryset TEXT := ''; delimitr char(1) := ' '; BEGIN IF (NEW."${table}_id" is not null) THEN ${datas} @DATAS@ IF (delimitr = ',') THEN EXECUTE 'update "${table}" SET ' || queryset ||  ' where "${table}"."id"=$1."${table}_id"' using NEW; END IF; END IF; RETURN NEW; END; $$`;
        Entity.trigger[table].doUpdate = this.addTrigger("update", table, relTable);
    }

    deleteStr(table: string, column: string, relTable: string) {
        const datas = `IF (OLD."${column}" = "DS_ROW"."_${column}Start" OR OLD."${column}" = "DS_ROW"."_${column}End") THEN queryset := queryset || delimitr || '"_${column}Start" = (select min("${column}") from "${relTable}" where "${relTable}"."${table}_id" = $1."${table}_id")'; delimitr := ','; queryset := queryset || delimitr || '"_${column}End" = (select max(coalesce("${column}", "resultTime")) from "${relTable}" where "${relTable}"."${table}_id" = $1."${table}_id")'; END IF;`;
        Entity.trigger[table].delete = Entity.trigger[table].hasOwnProperty("delete")
            ? Entity.trigger[table].delete.replace("@DATAS@", `\n${datas}@DATAS@`)
            : `CREATE OR REPLACE FUNCTION ${table}s_update_delete() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$ DECLARE "DS_ROW" "${table}"%rowtype; queryset TEXT := ''; delimitr char(1) := ' '; BEGIN IF (OLD."${table}_id" is not null) THEN SELECT * INTO "DS_ROW" FROM "${table}" WHERE "${table}"."id"=OLD."${table}_id"; ${datas} @DATAS@ IF (delimitr = ',') THEN EXECUTE 'update "${table}" SET ' || queryset ||  ' where "${table}"."id"=$1."${table}_id"' using OLD; END IF; END IF; RETURN NULL; END; $$`;
        Entity.trigger[table].doDelete = this.addTrigger("delete", table, relTable);
    }

    private prepareColums() {
        Object.keys(this.columns).forEach((e) => {
            if (this.columns[e].dataType === EDataType.period) {
                const entityRelation = this.columns[e].entityRelation;
                const coalesce = this.columns[e].coalesce;
                switch (this.columns[e].create.split(" ")[0]) {
                    case "TIME":
                        this.columns[e] = new Time().alias(e).type();
                        this.columns[`_${e}Start`] = new Time().type();
                        this.columns[`_${e}End`] = new Time().type();
                        break;
                    case "TIMETZ":
                        this.columns[e] = new Time("tz").alias(e).type();
                        this.columns[`_${e}Start`] = new Time("tz").type();
                        this.columns[`_${e}End`] = new Time("tz").type();
                        break;
                    case "TIMESTAMP":
                        this.columns[e] = new Timestamp().alias(e).type();
                        this.columns[`_${e}Start`] = new Timestamp().type();
                        this.columns[`_${e}End`] = new Timestamp().type();
                        break;
                    case "TIMESTAMPTZ":
                        this.columns[e] = new Timestamp("tz").alias(e).type();
                        this.columns[`_${e}Start`] = new Timestamp("tz").type();
                        this.columns[`_${e}End`] = new Timestamp("tz").type();
                        break;
                }

                if (entityRelation) {
                    if (!Entity.trigger[this.table]) Entity.trigger[this.table] = {};
                    this.insertStr(this.table, e, entityRelation, coalesce);
                    this.updateStr(this.table, e, entityRelation, coalesce);
                    this.deleteStr(this.table, e, entityRelation);
                }
                this.columns[e].create = "";
            }
        });
    }

    private createTriggers() {
        if (Entity.trigger[this.table]) {
            this.trigger = [];
            Object.keys(Entity.trigger[this.table]).forEach((elem: string) => {
                this.trigger.push(Entity.trigger[this.table][elem].replace("@DATAS@", ""));
            });
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
                this.addToConstraints(`${this.table}_pkey`, `PRIMARY KEY ("${elem}")`);
                this.addToIndexes(`${this.table}_${elem}`, `ON public."${this.table}" USING btree ("${elem}")`);
            } else if (this.columns[elem].create.includes(" UNIQUE")) {
                this.addToConstraints(`${this.table}_unik_${elem}`, `UNIQUE ("${elem}")`);
                this.addToIndexes(`${this.table}_${elem}_id`, `ON public."${this.table}" USING btree ("${elem}_id")`);
            }
        });

        Object.keys(this.relations).forEach((elem: string) => {
            if (this.relations[elem].unique) this.addToConstraints(`${this.table}_unik_${elem.toLowerCase()}`, `UNIQUE (${this.relations[elem].unique.map((e) => `"${e}"`)})`);
            switch (this.relations[elem].type) {
                case ERelations.belongsTo:
                    const value = `FOREIGN KEY ("${elem.toLowerCase()}_id") REFERENCES "${elem.toLowerCase()}"("id") ON UPDATE CASCADE ON DELETE CASCADE`;
                    if (this.relations[elem].entityRelation && this.is(elem)) this.addToPass(this.relations[elem].entityRelation, value);
                    else if (this.is(elem)) this.addToConstraints(`${this.table}_${elem.toLowerCase()}_id_fkey`, value);

                    this.addToIndexes(`${this.table}_${elem.toLowerCase()}_id`, `ON public."${this.table}" USING btree ("${elem.toLowerCase()}_id")`);
                    break;
                case ERelations.defaultUnique:
                    this.addToConstraints(`${this.table}_${elem.toLowerCase()}_id_fkey`, `FOREIGN KEY ("_default_${elem.toLowerCase()}") REFERENCES "${elem.toLowerCase()}"("id") ON UPDATE CASCADE ON DELETE CASCADE`);
                    break;
                case ERelations.belongsToMany:
                    if (this.relations[elem].entityRelation) this.addToPass(this.relations[elem].entityRelation);
                    break;
                case ERelations.hasMany:
                    if (this.relations[elem].entityRelation) this.addToPass(this.relations[elem].entityRelation);
                    break;
            }
        });

        if (this.type === ETable.link && Object.keys(this.columns).length === 2) {
            this.addToConstraints(`${this.table}_pkey`, `PRIMARY KEY (${Object.keys(this.columns).map((e) => `"${e}"`)})`);
            Object.keys(this.columns).forEach((elem) => {
                this.addToIndexes(`${this.table}_${elem}`, `ON public."${this.table}" USING btree ("${elem}")`);
            });
        }

        if (Entity.pass[this.name]) {
            Object.keys(Entity.pass[this.name].constraints).forEach((elem: string) => {
                this.constraints[elem] = Entity.pass[this.name].constraints[elem];
            });
        }
    }
}
