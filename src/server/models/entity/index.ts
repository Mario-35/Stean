import { EConstant, EDataType, ERelations, EentityType, allEntities } from "../../enums";
import { msg, errors } from "../../messages";
import { IentityColumn, IentityCore, IentityRelation } from "../../types";
import { singular } from "../helpers";

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

    dataStr(table: string, column: string, tim: string, coalesce?: string) {
        return `IF (NEW."${column}" IS NOT NULL) THEN
       MIN := NULL;
       MAX := NULL; 
      IF (NEW."${column}" < lower(SOURCE."${column}") OR lower(SOURCE."${column}") IS NULL )
        THEN MIN := NEW."${column}"::${tim};
        ELSE MIN := lower(SOURCE."${column}")::${tim};
        MAX := upper(SOURCE."${column}")::${tim};
      END IF;

      IF (NEW."${column}" > upper(SOURCE."${column}") OR upper(SOURCE."${column}") IS NULL )
        THEN MAX := NEW."${column}"::${tim};
        ELSE MAX := upper(SOURCE."${column}")::${tim};
        IF (MIN IS NULL) THEN 
          MIN := lower(SOURCE."${column}")::${tim};
        END IF;
      END IF;

      IF (MIN IS NOT NULL AND MAX IS NOT NULL) THEN 
		    EXECUTE 'UPDATE "${table}" SET "${column}" = ''[' || MIN || ',' || MAX || ']'' WHERE "${table}"."id"=' || NEW."${table}_id" using NEW;
      END IF;
  	END IF;
`;
    }

    insertStr(table: string, column: string, relTable: string, timeType: string, coalesce?: string) {
        // Ajoute une fonction en vue d'un trigger
        const datas = this.dataStr(table, column, timeType);

        Entity.trigger[table].insert = Entity.trigger[table].hasOwnProperty("insert")
            ? Entity.trigger[table].insert.replace("@DATAS@", `${EConstant.return}${datas}@DATAS@`).replace("@COLUMN@", `,"${column}"@COLUMN@`)
            : `CREATE OR REPLACE FUNCTION ${table}s_update_insert()  RETURNS TRIGGER LANGUAGE PLPGSQL AS $$ DECLARE SOURCE RECORD; MIN ${timeType} := NULL; MAX ${timeType} := NULL; BEGIN IF (NEW."${table}_id" is not null) THEN SELECT "id","${column}"@COLUMN@ INTO SOURCE FROM "${table}" WHERE "${table}"."id" = NEW."${table}_id"; ${datas}@DATAS@ END IF; RETURN NEW; END; $$`;
        this.addToClean(Entity.trigger[table].insert);
        // Ajoute la fonction precedement créer
        Entity.trigger[table].doInsert = this.addTrigger("insert", table, relTable);
    }

    updateStr(table: string, column: string, relTable: string, timeType: string, coalesce?: string) {
        // Ajoute une fonction en vue d'un trigger
        const datas = this.dataStr(table, column, timeType);

        Entity.trigger[table].update = Entity.trigger[table].hasOwnProperty("update")
            ? Entity.trigger[table].update.replace("@DATAS@", `${EConstant.return}${datas}@DATAS@`).replace("@COLUMN@", `,"${column}"@COLUMN@`)
            : `CREATE OR REPLACE FUNCTION ${table}s_update_update()  RETURNS TRIGGER LANGUAGE PLPGSQL AS $$ DECLARE SOURCE RECORD; MIN ${timeType} := NULL; MAX ${timeType} := NULL; BEGIN IF (NEW."${table}_id" is not null) THEN SELECT "id","${column}"@COLUMN@ INTO SOURCE FROM "${table}" WHERE "${table}"."id" = NEW."${table}_id"; ${datas}@DATAS@ END IF; RETURN NEW; END; $$`;
        Entity.trigger[table].doUpdate = this.addTrigger("update", table, relTable);
    }

    deleteStr(table: string, column: string, relTable: string, timeType: string, coalesce?: string) {
        const datas = `IF (OLD."${column}" IS NOT NULL) THEN
      IF (OLD."${column}" = lower(SOURCE."${column}") OR OLD."${column}" = upper(SOURCE."${column}")) THEN 
		    EXECUTE 'UPDATE "${table}" SET "${column}" = tstzrange((SELECT MIN("${column}") FROM "${relTable}" WHERE "${relTable}"."${this.table}_id" = ${this.table}.id), (SELECT MAX("${column}") FROM "${relTable}" WHERE "${relTable}"."${this.table}_id" = ${this.table}.id)) WHERE "${table}"."id"=' || OLD."${table}_id" using OLD;

      END IF;
  	END IF;
`;

        Entity.trigger[table].delete = Entity.trigger[table].hasOwnProperty("delete")
            ? Entity.trigger[table].delete.replace("@DATAS@", `${EConstant.return}${datas}@DATAS@`).replace("@COLUMN@", `,"${column}"@COLUMN@`)
            : `CREATE OR REPLACE FUNCTION ${table}s_update_delete()  RETURNS TRIGGER LANGUAGE PLPGSQL AS $$ DECLARE SOURCE RECORD; BEGIN IF (OLD."${table}_id" is not null) THEN SELECT "id","${column}"@COLUMN@ INTO SOURCE FROM "${table}" WHERE "${table}"."id" = OLD."${table}_id"; ${datas}@DATAS@ END IF; RETURN OLD; END; $$`;
        Entity.trigger[table].doDelete = this.addTrigger("delete", table, relTable);
    }

    private cleanString(input: string) {
        return input.replace("@DATAS@", "").replace("@COLUMN@", "");
    }
    private addToClean(input: string) {
        input = this.cleanString(input);
        if (this.clean) this.clean.push(input);
        else this.clean = [input];
    }

    private prepareColums() {
        Object.keys(this.columns).forEach((e) => {
            if (this.columns[e].indexes) {
                this.columns[e].indexes.forEach((name) => {
                    this.addToClean(` CREATE INDEX IF NOT EXISTS "${this.table}_${e}_${name}" ON "${this.table}" ("${e}", "${name}");`);
                    this.addToIndexes(`${this.table}_${e}_${name}`, `ON public."${this.table}" ("${e}", "${name}")`);
                });
            }
            if (this.columns[e].dataType === EDataType.tstzrange || this.columns[e].dataType === EDataType.tsrange) {
                const entityRelation = this.columns[e].entityRelation;
                const coalesce = this.columns[e].coalesce;
                const cast = EDataType.tstzrange ? "TIMESTAMPTZ" : "TIMESTAMP";
                if (entityRelation) {
                    if (!Entity.trigger[this.table]) Entity.trigger[this.table] = {};
                    const relationTable = singular(allEntities[entityRelation as keyof object]).toLowerCase();
                    this.insertStr(this.table, e, relationTable, cast, coalesce);
                    this.updateStr(this.table, e, relationTable, cast, coalesce);
                    this.deleteStr(this.table, e, relationTable, cast, coalesce);
                    this.addToClean(
                        `@UPDATE@ "${e}" = tstzrange((SELECT MIN("${e}") FROM "${relationTable}" WHERE "${relationTable}"."${this.table}_id" = ${this.table}.id), (SELECT MAX("${e}") FROM "${relationTable}" WHERE "${relationTable}"."${this.table}_id" = ${this.table}.id)) WHERE lower("${e}") IS NULL`
                    );
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
