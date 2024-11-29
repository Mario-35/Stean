import { EDataType, ERelations, ETable, allEntities } from "../../enums";
import { doubleQuotesString } from "../../helpers";
import { msg, errors } from "../../messages";
import { IentityColumn, IentityCore, IentityRelation, IKeyString } from "../../types";
import { singular } from "../helpers";
import { Time, Timestamp } from "../types";

class EntityPass {
    static pass:  {
        [key: string]: {
            constraints:  IKeyString; 
            indexes:      IKeyString;
        }
    } = {};
}

export class Entity extends EntityPass {
    name:          string; // Entity Name
    singular:      string;
    table:         string;
    createOrder:   number;
    type:          ETable;
    order:         number;
    orderBy:       string;
    columns:       { [key: string]: IentityColumn };
    relations:     { [key: string]: IentityRelation };
    constraints:   IKeyString;
    indexes:       IKeyString;
    update?:        string[];
    after?:        string;    
    constructor (name: string, datas: IentityCore) {
      super();
        const entity= allEntities[name];
          if (entity) {
            this.createOrder = datas.createOrder,
            this.type = datas.type,
            this.order = datas.order,
            this.columns = datas.columns,
            this.orderBy =Object.keys(datas.columns)[0];
            this.relations = datas.relations,
            this.constraints = {},
            this.indexes = {},
            this.after = datas.after,
            this.name = name;
            this.singular = singular(entity);
            this.table = this.singular.toLowerCase();
          } else throw new Error(msg( errors.noValidEntity, name));
          this.prepareColums();
          this.createConstraints();          
      };

      private prepareColums() {
        Object.keys(this.columns).forEach(e => {
          if (this.columns[e].dataType === EDataType.period) {
            const table = this.columns[e].entityRelation;
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
            this.addToUpdate(`WITH stream AS (SELECT DISTINCT "${this.table}_id" AS id FROM ${table}),
      datas AS (SELECT 
        "${this.table}_id" AS id,
        MIN("${e}") AS pmin ,
        MAX("${e}") AS pmax
        FROM ${table}, stream WHERE "${this.table}_id" = stream.id GROUP BY "${this.table}_id")
      UPDATE "${this.table}" SET 
        "_${e}Start" =  datas.pmin ,
        "_${e}End" = datas.pmax
      FROM datas WHERE "${this.table}".id = datas.id`);
      this.columns[e].create = "";
          }
        });
      }

      private is(elem: string) {
        return Object.keys(this.columns).includes(`${elem.toLowerCase()}_id`);
      }

      private addToUpdate(value: string) {
        if (this.update) 
          this.update.push(value);
        else this.update = [value];
      }

      private addToPass(key: string, value?: string) {
        value = value || `FOREIGN KEY ("${this.table}_id") REFERENCES "${this.table}"("id") ON UPDATE CASCADE ON DELETE CASCADE`;
        if (!Entity.pass[key]) Entity.pass[key] = {constraints: {}, indexes: {} };
        Entity.pass[key].constraints[`${singular(key).toLowerCase()}_${this.table}_id_fkey`] = value;
      }

      private addToConstraints( key: string, value: string) {
          this.constraints[key] = value;
      }

      private addToIndexes( key: string, value: string) {
          this.indexes[key] = value;
      }
      
      private createConstraints() {
        Object.keys(this.columns).forEach((elem: string) => {
          if (this.columns[elem].orderBy) this.orderBy = `${doubleQuotesString(elem)} ${this.columns[elem].orderBy.toUpperCase()}` ;
          if (this.columns[elem].create.startsWith('BIGINT GENERATED ALWAYS AS IDENTITY')) {
            this.addToConstraints(`${this.table}_pkey`,`PRIMARY KEY ("${elem}")`);
            this.addToIndexes(`${this.table}_${elem}`, `ON public."${this.table}" USING btree ("${elem}")`);
          } else if (this.columns[elem].create.includes(' UNIQUE')) {
            this.addToConstraints(`${this.table}_unik_${elem}`, `UNIQUE ("${elem}")`);
            this.addToIndexes(`${this.table}_${elem}_id`, `ON public."${this.table}" USING btree ("${elem}_id")`);
          }           
        });
        
        Object.keys(this.relations).forEach((elem: string) => {
          if (this.relations[elem].unique) this.addToConstraints(`${this.table}_unik_${elem.toLowerCase()}`, `UNIQUE (${this.relations[elem].unique.map(e => doubleQuotesString(e))})`);
          switch (this.relations[elem].type) {
            case ERelations.belongsTo:
              const value = `FOREIGN KEY ("${elem.toLowerCase()}_id") REFERENCES "${elem.toLowerCase()}"("id") ON UPDATE CASCADE ON DELETE CASCADE`;
              if (this.relations[elem].entityRelation && this.is(elem))
                this.addToPass(this.relations[elem].entityRelation, value)
              else if (this.is(elem))
                this.addToConstraints(`${this.table}_${elem.toLowerCase()}_id_fkey`, value);
              
              this.addToIndexes(`${this.table}_${elem.toLowerCase()}_id`, `ON public."${this.table}" USING btree ("${elem.toLowerCase()}_id")`);
              break;
            case ERelations.defaultUnique:
              this.addToConstraints(`${this.table}_${elem.toLowerCase()}_id_fkey`, `FOREIGN KEY ("_default_${elem.toLowerCase()}") REFERENCES "${elem.toLowerCase()}"("id") ON UPDATE CASCADE ON DELETE CASCADE`);
              break;
            case ERelations.belongsToMany:
              if (this.relations[elem].entityRelation) 
                this.addToPass(this.relations[elem].entityRelation)
              break;
            case ERelations.hasMany:
              if (this.relations[elem].entityRelation) 
                this.addToPass(this.relations[elem].entityRelation)
              break;
          }
        });

        if (this.type === ETable.link && Object.keys(this.columns).length === 2) {
          this.addToConstraints(`${this.table}_pkey`,`PRIMARY KEY (${Object.keys(this.columns).map(e => doubleQuotesString(e))})`);
          Object.keys(this.columns).forEach(elem => {
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