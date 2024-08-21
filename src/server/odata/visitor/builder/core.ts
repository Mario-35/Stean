/**
 * core builder
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- core builder -----------------------------------!");

import { removeAllQuotes } from "../../../helpers";

export class Core {
  private _src: string[];
  
  constructor(input?: string | string[]) {    
    this._src = input ? typeof input === "string" ? [input]  : input : [] ;
  }
  
  addKey(input: string) {      
    const addTo = (input: string[]) => {
      input.forEach(key =>  {
        key = key.includes(" AS ") ? key.split(" AS ")[1] : key;
        key = key.includes(".") ? key.split(".")[1] : key;
        if (!this._src.includes(key) && key.trim() !== "") this._src.push(removeAllQuotes(key));      
      });
    }
    addTo((typeof input === "string") ? [input] : input);    
}
  
  add(input: string) {    
    this._src.push(input);
  }

  init(input: string) {
    this._src = [input];
  }
  
  toArray():string[] {    
    return this._src;
  }

  toString():string {    
    return this._src.join("");
  }

  notNull() {    
    return this._src.filter(e => e !+ "").length > 0;
  }

  replace(from: any, to: any) {    
    this._src = this._src.map(e => typeof e === "string" ? e.replace(from, to) : e);
  }

}
