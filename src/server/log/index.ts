/**
 * Log class
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- Log class -----------------------------------!");

import util from "util";
import { EChar, EColor } from "../enums";
import { color, showAll, _DEBUG } from "../constants";
import { Lexer } from "../odata/parser";
import { _ID } from "../db/constants";

// class to logCreate configs environements
class Log {
  private debugFile = false;
  private line = (nb: number)  => "═".repeat(nb);
  private logAll = (input: any, colors?: boolean) => typeof input === "object" ? util.inspect(input, { showHidden: false, depth: null, colors: colors || false, }) : input;
  private separator = (title: string, nb: number) => `${color(EColor.Green)} ${this.line(nb)} ${color( EColor.Yellow )} ${title} ${color(EColor.Green)} ${this.line(nb)}${color( EColor.Reset )}`;
  private logCleInfos = (cle: string, infos: object) =>  `${color(EColor.Green)} ${cle} ${color( EColor.White )} : ${color(EColor.Cyan)} ${this.logAll( infos, this.debugFile )}${color(EColor.Reset)}`;

  public booting<T>(cle: string, value: T) { 
    return `\x1b[${ EColor.Cyan }m${cle}\x1b[${EColor.White}m ${value}\x1b[${EColor.Reset}m`;
  }

  public create(cle: string, value: string | number) {
    return `${color(EColor.White)} -->${color( EColor.Cyan )} ${cle} ${color(EColor.White)} ${showAll(value)}${color(EColor.Reset)}`;
  }

  public message<T>(cle: string, infos: T) {
    return `${color(EColor.Yellow)}${cle} ${color( EColor.White )}:${color(EColor.Cyan)} ${showAll( infos)}${color(EColor.Reset)}`;
  }

  public query(sql: unknown) {
    if (_DEBUG) return `${color(EColor.Code)}${"=".repeat(5)}[ Query Start ]${"=".repeat(5)}\n${color(EColor.Sql)} ${showAll(sql)}\n${color(EColor.Sql)}${color(EColor.Code)}\n${color( EColor.Reset )}`;
  }

  public queryError<T>(query: unknown, error: T) {  
    return `${color(EColor.Green)} ${"=".repeat(15)} ${color( EColor.Cyan )} ERROR ${color(EColor.Green)} ${"=".repeat(15)}${color( EColor.Reset )}
      ${color(EColor.Red)} ${error} ${color( EColor.Blue )}
      ${color(EColor.Cyan)} ${showAll(query, false ) }${color(EColor.Reset)}`;
  }

  // Usefull for id not used ;)
  oData(infos: Lexer.Token | undefined) {  
    if (infos && _DEBUG)  {
      const tmp = `${color(EColor.White)} ${infos} ${color(EColor.Reset)}`;
      return `${color(EColor.Red)} ${"=".repeat(8)} ${color(EColor.Cyan)} ${ new Error().stack?.split("\n")[2].trim().split("(")[0].split("at ")[1].trim() } ${tmp}${color(EColor.Red)} ${"=".repeat(8)}${color(EColor.Reset)}`;
    }
    return infos;
  }

  // log an object or json
  object(title: string, input: object) {
    if (_DEBUG) {
      const res = [this._head(title)];
      Object.keys(input).forEach((cle: string) => {
        res.push(this.logCleInfos("  " + cle, input[cle as keyof object]));
      });
      return res.join("\n");
    }
  }

  url(link: string) {
    return `${EChar.web} ${color(EColor.Default)} : ${color( EColor.Cyan )} ${link}${color(EColor.Reset)}`;
  }

  _head<T>(cle: string, infos?: T) {
    return infos ? `${color(EColor.Green)}${this.line(12)} ${color( EColor.Cyan )} ${cle} ${color(EColor.White)} ${this.logAll( infos, this.debugFile )} ${color(EColor.Green)} ${this.line(12)}${color( EColor.Reset )}` : this.separator(cle, 12);
  }
  debug_head<T>(cle: string, infos?: T) {
    if (_DEBUG) return this._head(cle, infos);
  }

  _infos<T>(cle: string, infos: T) {
    if (_DEBUG) return `${color(EColor.Green)} ${cle} ${color( EColor.White )} : ${color(EColor.Cyan)} ${this.logAll( infos, this.debugFile )}${color(EColor.Reset)}`;
  }
  debug_infos<T>(cle: string, infos: T) {
    if (_DEBUG) return this._infos(cle, infos);
  }

  _result<T>(cle: string, infos?: T) {
    return `${color(EColor.Green)}     >>${color( EColor.Black )} ${cle} ${color(EColor.Default)} : ${color( EColor.Cyan )} ${this.logAll(infos, this.debugFile)}${color(EColor.Reset)}` ;
  }
  debug_result<T>(cle: string, infos?: T) {
    if (_DEBUG) return this._result(cle, infos);
  }

  error<T>(cle: unknown, infos?: T) {
    return infos
      ? `${color(EColor.Red)} ${cle} ${color( EColor.Blue )} : ${color(EColor.Yellow)} ${this.logAll( infos, this.debugFile )}${color(EColor.Reset)}`
      : `${color(EColor.Red)} Error ${color( EColor.Blue )} : ${color(EColor.Yellow)} ${this.logAll(cle)}${color( EColor.Reset )}`;
  }

  whereIam(infos?: unknown) {  
    if (_DEBUG) {
      const tmp = infos ? `${color(EColor.Default)} ${infos} ${color(EColor.Reset)}` : '';
      return `${color(EColor.Red)}${this.line(4)} ${color(EColor.Cyan)} ${ new Error().stack?.split("\n")[2].trim().split("(")[0].split("at ")[1].trim() } ${tmp}${color(EColor.Red)} ${this.line(4)}${color(EColor.Reset)}`;
    };
  }  

  logo(ver: string) {
    return `${color(EColor.Code)}${color(EColor.Sql)}\n ____ __________    _     _   _ \n/ ___|_ __  ____|  / \\   | \\ | |\n\\___ \\| | |  _|   / _ \\  |  \\| |\n ___) | | | |___ / ___ \\ | |\\  |\n|____/|_| |_____|_/   \\_\\|_| \\_|  ${color(EColor.Blue)}run API ----> ${color(EColor.Green)}${ver}${color(EColor.Sql)}${color(EColor.Code)}\n${EChar.web} ${color(EColor.White)}https://github.com/Mario-35/Stean/ ${EChar.mail} ${color(EColor.Yellow)} mario.adam@inrae.fr${color( EColor.Reset )}`
  }

  
}

export const log = new Log();
