import { ERelations, ETable, allEntities } from "../enums";
import { doubleQuotesString } from "../helpers";
import { msg, errors } from "../messages";
import { IentityColumn, IentityCore, IentityRelation, IKeyString } from "../types";
import { singular } from "./helpers";

class Pass {
    static pass:  {
        [key: string]: {
            constraints:  IKeyString; 
            indexes:      IKeyString;
        }
    } = {};
}

export class Entity extends Pass {
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
    clean?:        string[];
    after?:        string;    
    constructor (name: string, datas: IentityCore) {
      super();
        const entity= allEntities[name];
          if (entity) {
            this.createOrder = datas.createOrder,
            this.type = datas.type,
            this.order = datas.order,
            this.orderBy = datas.orderBy,
            this.columns = datas.columns,
            this.relations = datas.relations,
            this.constraints = {},
            this.indexes = {},
            this.clean = datas.clean,
            this.after = datas.after,
            this.name = name;
            this.singular = singular(entity);
            this.table = this.singular.toLowerCase();
          } else throw new Error(msg( errors.noValidEntity, name));
          this.createConstraints();
      };

      is(elem: string) {
        return Object.keys(this.columns).includes(`${elem.toLowerCase()}_id`);
      }

      addToPass(key: string, value?: string) {
        value = value || `FOREIGN KEY ("${this.table}_id") REFERENCES "${this.table}"("id") ON UPDATE CASCADE ON DELETE CASCADE`;
        if (!Entity.pass[key]) Entity.pass[key] = {constraints: {}, indexes: {} };
        Entity.pass[key].constraints[`${singular(key).toLowerCase()}_${this.table}_id_fkey`] = value;
      }

      addToConstraints( key: string, value: string) {
          this.constraints[key] = value;
      }

      addToIndexes( key: string, value: string) {
          this.indexes[key] = value;
      }
      
      private createConstraints() {
        Object.keys(this.columns).forEach((elem: string) => {
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
          })
          
        }

        if (Entity.pass[this.name]) {
          Object.keys(Entity.pass[this.name].constraints).forEach((elem: string) => {
            this.constraints[elem] = Entity.pass[this.name].constraints[elem];
            // delete Entity.pass[this.name].constraints[elem];
          });
        }

      }
}