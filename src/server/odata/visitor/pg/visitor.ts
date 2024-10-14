/**
 * Visitor for odata
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { SqlOptions } from "../../parser/sqlOptions";
import { IreturnFormat, koaContext } from "../../../types";
import { returnFormats } from "../../../helpers";
import { PgVisitor } from "../";
import { Query } from "../builder";
export class Visitor {
  public ctx: koaContext;
  public options: SqlOptions;
  onlyRef = false;
  onlyValue = false;
  valueskeys = false;
  returnFormat: IreturnFormat = returnFormats.json;
  query: Query = new Query();
  includes: PgVisitor[];
  constructor(ctx: koaContext, options = <SqlOptions>{}) {
    this.ctx = ctx;
    this.options = options;
    this.onlyRef = options.onlyRef;
    this.onlyValue = options.onlyValue;
    this.valueskeys = options.valueskeys;
    this.returnFormat = (options.onlyValue === true) ? returnFormats.txt : returnFormats.json;
  }
}
