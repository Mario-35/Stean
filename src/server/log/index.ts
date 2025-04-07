/**
 * Log class
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import util from "util";
import { color, EChar, EColor, EConstant } from "../enums";
import { Lexer } from "../odata/parser";
import { _DEBUG } from "../constants";

// class to logCreate configs environements
class Log {
    private debugFile = false;
    private line = (nb: number) => "═".repeat(nb);
    private logAll = (input: any, colors?: boolean) => (typeof input === "object" ? util.inspect(input, { showHidden: false, depth: null, colors: colors || false }) : input);
    private separator = (title: string, nb: number) => `${color(EColor.Green)} ${this.line(nb)} ${color(EColor.Yellow)} ${title} ${color(EColor.Green)} ${this.line(nb)}${color(EColor.Reset)}`;
    private logCleInfos = (cle: string, infos: object) => `${color(EColor.Green)} ${cle} ${color(EColor.White)} : ${color(EColor.Cyan)} ${this.logAll(infos, this.debugFile)}${color(EColor.Reset)}`;

    /**
     *
     * @param cle key message
     * @param value  message
     * @returns formated string
     */
    public booting<T>(cle: string, value: T) {
        return `\x1b[${EColor.Cyan}m${cle} ${EChar.arrowright}\x1b[${EColor.White}m ${value}\x1b[${EColor.Reset}m`;
    }

    public showAll<T>(input: T, colors?: boolean) {
        return typeof input === "object" ? util.inspect(input, { showHidden: false, depth: null, colors: colors || false }) : input;
    }

    /**
     *
     * @param cle key message
     * @param value  message
     * @returns formated string
     */
    public create(cle: string, value: string | number) {
        return `${color(EColor.White)} -->${color(EColor.Cyan)} ${cle} ${color(EColor.White)} ${this.showAll(value)}${color(EColor.Reset)}`;
    }

    /**
     *
     * @param cle key message
     * @param infos  message
     * @returns formated string
     */
    public message<T>(cle: string, infos: T) {
        return `${color(EColor.Yellow)}${cle} ${color(EColor.White)}:${color(EColor.Cyan)} ${this.showAll(infos)}${color(EColor.Reset)}`;
    }

    /**
     *
     * @param sql sql query
     * @returns formated string
     */
    public query(sql: unknown) {
        if (_DEBUG) return `${color(EColor.Code)}${"=".repeat(5)}[ Query Start ]${"=".repeat(5)}${EConstant.return}${color(EColor.Sql)} ${this.showAll(sql)}${EConstant.return}${color(EColor.Sql)}${color(EColor.Code)}${color(EColor.Reset)}`;
    }

    /**
     * format Sql error
     *
     * @param query sql query
     * @param error error message
     * @returns formated string
     */
    public queryError<T>(query: unknown, error: T) {
        return `${color(EColor.Green)} ${"=".repeat(15)} ${color(EColor.Cyan)} ERROR ${color(EColor.Green)} ${"=".repeat(15)}${color(EColor.Reset)}
      ${color(EColor.Red)} ${error} ${color(EColor.Blue)}
      ${color(EColor.Cyan)} ${this.showAll(query, false)}${color(EColor.Reset)}`;
    }

    /**
     * format Odata token
     *
     * @param infos Odata Token
     * @returns formated string
     */
    oData(infos: Lexer.Token | undefined) {
        if (infos && _DEBUG) {
            const tmp = `${color(EColor.White)} ${infos} ${color(EColor.Reset)}`;
            return `${color(EColor.Red)} ${"=".repeat(8)} ${color(EColor.Cyan)} ${new Error().stack?.split(EConstant.return)[2].trim().split("(")[0].split("at ")[1].trim()} ${tmp}${color(EColor.Red)} ${"=".repeat(8)}${color(EColor.Reset)}`;
        }
    }

    /**
     * format Object
     *
     * @param title string message
     * @param input object
     * @returns formated string
     */
    object(title: string, input: object) {
        if (_DEBUG) {
            const res = [this._head(title)];
            Object.keys(input).forEach((cle: string) => {
                res.push(this.logCleInfos("  " + cle, input[cle as keyof object]));
            });
            return res.join(EConstant.return);
        }
    }

    url(link: string) {
        return `${EChar.web} ${color(EColor.Default)} : ${color(EColor.Cyan)} ${link}${color(EColor.Reset)}`;
    }
    _head<T>(cle: string, infos?: T) {
        return infos ? `${color(EColor.Green)}${this.line(12)} ${color(EColor.Cyan)} ${cle} ${color(EColor.White)} ${this.logAll(infos, this.debugFile)} ${color(EColor.Green)} ${this.line(12)}${color(EColor.Reset)}` : this.separator(cle, 12);
    }
    debug_head<T>(cle: string, infos?: T) {
        if (_DEBUG) return this._head(cle, infos);
    }
    _infos<T>(cle: string, infos: T) {
        if (_DEBUG) return `${color(EColor.Green)} ${cle} ${color(EColor.White)} : ${color(EColor.Cyan)} ${this.logAll(infos, this.debugFile)}${color(EColor.Reset)}`;
    }
    debug_infos<T>(cle: string, infos: T) {
        if (_DEBUG) return this._infos(cle, infos);
    }
    _result<T>(cle: string, infos?: T) {
        return `${color(EColor.Green)}     >>${color(EColor.Black)} ${cle} ${color(EColor.Default)} : ${color(EColor.Cyan)} ${this.logAll(infos, this.debugFile)}${color(EColor.Reset)}`;
    }
    debug_result<T>(cle: string, infos?: T) {
        if (_DEBUG) return this._result(cle, infos);
    }

    whereIam(infos?: unknown) {
        if (_DEBUG) {
            const tmp = infos ? `${color(EColor.Default)} ${infos} ${color(EColor.Reset)}` : "";
            return `${color(EColor.Red)}${this.line(4)} ${color(EColor.Cyan)} ${new Error().stack?.split(EConstant.return)[2].trim().split("(")[0].split("at ")[1].trim()} ${tmp}${color(EColor.Red)} ${this.line(4)}${color(EColor.Reset)}`;
        }
    }

    logo(ver: string) {
        return `${color(EColor.Code)}${color(EColor.Sql)}${EConstant.return} ____ __________    _     _   _ ${EConstant.return}/ ___|_ __  ____|  / \\   | \\ | |${EConstant.return}\\___ \\| | |  _|   / _ \\  |  \\| |${EConstant.return} ___) | | | |___ / ___ \\ | |\\  |${EConstant.return}|____/|_| |_____|_/   \\_\\|_| \\_|  ${color(EColor.Blue)}run API ----> ${color(EColor.Green)}${ver}${color(EColor.Sql)}${color(EColor.Code)}${EConstant.return}${EChar.web} ${color(
            EColor.White
        )}https://github.com/Mario-35/Stean/ ${EChar.mail} ${color(EColor.Yellow)} mario.adam@inrae.fr${color(EColor.Reset)}`;
    }

    update<T>(value: T) {
        return `\x1b[${EColor.Green}mUpdate : \x1b[${EColor.White}m${value}\x1b[${EColor.Reset}m`;
    }

    error<T>(cle: unknown, infos?: T) {
        process.stdout.write(infos ? `${color(EColor.Red)} ${cle} ${color(EColor.Blue)} : ${color(EColor.Yellow)} ${this.logAll(infos, this.debugFile)}${color(EColor.Reset)}` : `${color(EColor.Red)} Error ${color(EColor.Blue)} : ${color(EColor.Yellow)} ${this.logAll(cle)}${color(EColor.Reset)}` + EConstant.return);
    }

    newLog(input: any) {
        if (input) process.stdout.write(input + EConstant.return);
    }
}
export const log = new Log();
