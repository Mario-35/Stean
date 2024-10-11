import { errors } from "../messages";
export class Csv {
    constructor() {     
    }

  flattenArray(array: Record<string, any>, ancestors?: Record<string, any>) {
    ancestors || (ancestors = []);
    function combineKeys(a: Record<string, any>, b: Record<string, any>) {
      const result = a.slice(0);
      if (!Array.isArray(b)) return result;
      for (let i = 0; i < b.length; i++)
        if (result.indexOf(b[i]) === -1) result.push(b[i]);
      return result;
    }
    function extend(target: Record<string, any>, source: Record<string, any>) {
      target = target || {};
      for (const prop in source) {
        if (typeof source[prop] === 'object') {
          target[prop] = extend(target[prop], source[prop]);
        } else {
          target[prop] = source[prop];
        }
      }
      return target;
    }
    const rows: Record<string, any> = [];
    for (let i = 0; i < array.length; i++) {
        let o = array[i],
          row: Record<string, any> = {},
          orows: Record<string, any> = {},
          count = 1;
      if (o !== undefined && o !== null && (!this.isObject(o) || Array.isArray(o)))
        throw errors.errorItemNotAnObject.replace('{0}', JSON.stringify(o));
      const keys = this.getKeys(o);
      for (let k = 0; k < keys.length; k++) {
        const value = o[keys[k]],
            keyChain = combineKeys(ancestors, [keys[k]]),
            key = keyChain.join('.');
        if (Array.isArray(value)) {
          orows[key] = this.flattenArray(value, keyChain);
          count += orows[key].length;
        } else {
          row[key] = value;
        } 
      }
      if (count == 1) {
        rows.push(row);
      } else {
        const keys:string[] = this.getKeys(orows);
        for (let k = 0; k < keys.length; k++) {
          const key = keys[k];
          for (let r = 0; r < orows[key].length; r++) {
            rows.push(extend(extend({}, row), orows[key][r]));
          }
        }
      }
    }
    return rows;
  }
  isObject(o: Record<string, any>) {
    return o && typeof o == 'object';
  }
  getKeys(o: Record<string, any>) {
    if (!this.isObject(o)) return [];
    return Object.keys(o);
  }
  convert(data: Record<string, any>, options?: Record<string, any>) {
		options || (options = {});
    
    if (!this.isObject(data)) throw errors.errorNotAnArray;
    if (!Array.isArray(data)) data = [data];
		
    const separator = options.separator || ',';
		if (!separator) throw errors.errorMissingSeparator;
    
    const flatten = options.flatten || false;
    if (flatten) data = this.flattenArray(data);
    const allKeys: Record<string, any> = [];
    const allRows: Record<string, any> = [];
    
    data.forEach((d: any) => {
      const o = d[0] || d;
    	const row: Record<string, any> = {};
    	if (o !== undefined && o !== null && (!this.isObject(o) || Array.isArray(o)))
    		throw errors.errorItemNotAnObject.replace('{0}', JSON.stringify(o));
    	const keys = this.getKeys(o);
    	for (let k = 0; k < keys.length; k++) {
    		const key = keys[k];
    		if (allKeys.indexOf(key) === -1) allKeys.push(key);
    		const value = o[key];
    		if (value === undefined && value === null) continue;
        if (typeof value == 'string') {
          row[key] = '"' + value.replace(/"/g, options.output_csvjson_variant ? '\\"' : '""') + '"';
          if (options.output_csvjson_variant) row[key] = row[key].replace(/\n/g, '\\n');
        } else {
          row[key] = JSON.stringify(value);
          if (!options.output_csvjson_variant && (this.isObject(value) || Array.isArray(value)))
            row[key] = '"' + row[key].replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
        }
    	}
    	allRows.push(row);
    });

    // for (let i = 0; i < data.length; i++) {
    //   const o = data[i][0] || data[i];
    // 	const row: Record<string, any> = {};
    // 	if (o !== undefined && o !== null && (!this.isObject(o) || Array.isArray(o)))
    // 		throw errors.errorItemNotAnObject.replace('{0}', JSON.stringify(o));
    // 	const keys = this.getKeys(o);
    // 	for (let k = 0; k < keys.length; k++) {
    // 		const key = keys[k];
    // 		if (allKeys.indexOf(key) === -1) allKeys.push(key);
    // 		const value = o[key];
    // 		if (value === undefined && value === null) continue;
    //     if (typeof value == 'string') {
    //       row[key] = '"' + value.replace(/"/g, options.output_csvjson_variant ? '\\"' : '""') + '"';
    //       if (options.output_csvjson_variant) row[key] = row[key].replace(/\n/g, '\\n');
    //     } else {
    //       row[key] = JSON.stringify(value);
    //       if (!options.output_csvjson_variant && (this.isObject(value) || Array.isArray(value)))
    //         row[key] = '"' + row[key].replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
    //     }
    // 	}
    // 	allRows.push(row);
    // }
    const keyValues: Record<string, any> = [];
    for (let i = 0; i < allKeys.length; i++) {
      keyValues.push('"' + allKeys[i].replace(/"/g, options.output_csvjson_variant ? '\\"' : '""') + '"');
    }
    let csv = keyValues.join(separator)+'\n';
    for (let r = 0; r < allRows.length; r++) {
    	const row = allRows[r],
    			rowArray = [];
    	for (let k = 0; k < allKeys.length; k++) {
    		const key = allKeys[k];
    		rowArray.push(row[key] || (options.output_csvjson_variant ? 'null' : ''));
    	}
    	csv += rowArray.join(separator) + (r < allRows.length-1 ? '\n' : '');
    }
    
    return csv;
	}
	
    json2csv() {
    //   if (typeof exports !== 'undefined') {
    //       if (typeof module !== 'undefined' && module.exports) {
    //           exports = module.exports = convert;
    //       }
    //       exports.json2csv = convert;
    //   } else {
    //     this.CSVJSON || (this.CSVJSON = {});
    //     this.CSVJSON.json2csv = convert;
    //   }
  }
}